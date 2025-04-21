from django.shortcuts import render
import os
import numpy as np
import tensorflow as tf
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import cv2
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import matplotlib.pyplot as plt
import tensorflow.keras.backend as K
from tensorflow.keras.models import Model
import io
import base64
from io import BytesIO
from PIL import Image

# Load the trained model
MODEL_PATH = "detection/models/model.h5"
model = tf.keras.models.load_model(MODEL_PATH)
model.summary()
for layer in model.layers:
    print(layer.name)

from tensorflow.keras.layers import LSTM
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.inception_v3 import InceptionV3, preprocess_input
import tempfile

# Create a custom LSTM class that ignores time_major
class CustomLSTM(LSTM):
    def __init__(self, *args, **kwargs):
        # Remove time_major if it exists
        if 'time_major' in kwargs:
            del kwargs['time_major']
        super(CustomLSTM, self).__init__(*args, **kwargs)

# Load the image model
MODEL_PATH = "detection/models/model.h5"
image_model = tf.keras.models.load_model(MODEL_PATH)

# Load the video model with custom LSTM
VIDEO_MODEL_PATH = "detection/models/deepfake_lstm_model.h5"
video_model = load_model(VIDEO_MODEL_PATH, custom_objects={'LSTM': CustomLSTM})

# Load a feature extraction model (InceptionV3 without top layer)
feature_extractor = InceptionV3(include_top=False, weights='imagenet', pooling='avg')

# Load the face detection model
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def generate_gradcam(image_path, model, last_conv_layer_name):
    # Skip Grad-CAM if there are issues and return a basic visualization
    try:
        # Find the target convolutional layer
        for i, layer in enumerate(model.layers):
            if layer.name == last_conv_layer_name:
                target_layer = layer
                break
        else:
            # If target layer not found, find the last conv layer
            for i in reversed(range(len(model.layers))):
                if 'conv' in model.layers[i].name.lower():
                    target_layer = model.layers[i]
                    print(f"Using {target_layer.name} instead of {last_conv_layer_name}")
                    break
            else:
                # If no conv layer found, return a simple heatmap
                img = cv2.imread(image_path)
                img = cv2.resize(img, (128, 128))
                _, buffer = cv2.imencode('.jpg', img)
                return base64.b64encode(buffer).decode('utf-8')
        
        # Load and preprocess the image
        img = load_img(image_path, target_size=(128, 128))
        img_array = img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Create a simpler visualization based on activation maps
        # Create a model that outputs the activations of the target conv layer
        activation_model = tf.keras.models.Model(
            inputs=model.inputs,
            outputs=target_layer.output
        )
        
        # Get activations
        activations = activation_model.predict(img_array)
        
        # Create a heatmap from the activations
        heatmap = np.mean(activations[0], axis=-1)
        heatmap = np.maximum(heatmap, 0)
        heatmap = heatmap / np.max(heatmap) if np.max(heatmap) > 0 else heatmap
        
        # Resize and apply color map
        heatmap = cv2.resize(heatmap, (128, 128))
        heatmap = np.uint8(255 * heatmap)
        heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        
        # Superimpose the heatmap on the original image
        orig_img = cv2.imread(image_path)
        orig_img = cv2.resize(orig_img, (128, 128))
        superimposed_img = cv2.addWeighted(orig_img, 0.6, heatmap_color, 0.4, 0)
        
        # Convert to base64 for web display
        _, buffer = cv2.imencode('.jpg', superimposed_img)
        heatmap_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return heatmap_base64
        
    except Exception as e:
        print(f"Error generating Grad-CAM: {e}")
        # Return a blank image or the original image as fallback
        img = cv2.imread(image_path)
        img = cv2.resize(img, (128, 128))
        _, buffer = cv2.imencode('.jpg', img)
        return base64.b64encode(buffer).decode('utf-8')

def detect_face(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    return len(faces) > 0

def classify_image(image_path):
    image = load_img(image_path, target_size=(128, 128))
    image_array = img_to_array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    
    prediction = image_model.predict(image_array)
    result = 'Fake' if prediction[0][0] > 0.5 else 'Real'
    confidence = (1 - prediction[0][0]) * 100 if result == 'Real' else prediction[0][0] * 100
    
    face_detectable = detect_face(image_path)
    explanation = ""
    
    if result == 'Real':
        explanation = "The image is real. The facial features are natural and well-aligned with the background."
    else:
        explanation = "The image is fake. Possible inconsistencies detected in texture, edges, or alignment. "
        explanation += "Face detection status: " + ("Face detected" if face_detectable else "No face detected.")
    
    return result, confidence, explanation

def extract_frames_opencv(video_path, num_frames=30):
    """Extract frames from video using OpenCV"""
    frames = []
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        raise Exception("Error opening video file")
    
    # Get video properties
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    # Calculate frame indices to extract
    if frame_count <= num_frames:
        # If video has fewer frames than requested, pad with duplicates
        indices = list(range(frame_count))
        # Pad with repeated last frame if needed
        while len(indices) < num_frames:
            indices.append(indices[-1])
    else:
        # Sample frames evenly throughout the video
        indices = [int(i * frame_count / num_frames) for i in range(num_frames)]
    
    for idx in indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if ret:
            # Resize frame to what InceptionV3 expects (299x299)
            frame = cv2.resize(frame, (299, 299))
            # Convert BGR to RGB
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frames.append(frame)
    
    cap.release()
    
    # Convert to array and preprocess for InceptionV3
    frames = np.array(frames)
    frames = preprocess_input(frames)  # Apply InceptionV3 preprocessing
    
    return frames

def classify_video(video_path):
    try:
        # Extract exactly 30 frames from the video (as expected by the model)
        frames = extract_frames_opencv(video_path, num_frames=30)
        
        if len(frames) == 0:
            return "Error", 0, "Could not extract frames from video"
            
        # Extract features for each frame using InceptionV3
        features = []
        for frame in frames:
            frame_expanded = np.expand_dims(frame, axis=0)
            feature = feature_extractor.predict(frame_expanded)
            features.append(feature[0])  # shape will be (2048,)
        
        # Stack features into a sequence of shape (30, 2048)
        feature_sequence = np.stack(features)
        # Expand dimensions to get shape (1, 30, 2048) for batch size 1
        feature_sequence = np.expand_dims(feature_sequence, axis=0)
        
        # Make prediction with the video model
        prediction = video_model.predict(feature_sequence)
        
        # Process prediction result
        if isinstance(prediction, list):
            prediction = prediction[0]  # Get first element if it's a list
        
        # Determine result based on prediction value
        # Assuming binary classification with threshold 0.5
        avg_prediction = prediction[0] if prediction.shape == (1, 1) else np.mean(prediction)
        result = 'Fake' if avg_prediction > 0.5 else 'Real'
        confidence = avg_prediction * 100 if result == 'Fake' else (1 - avg_prediction) * 100
        
        explanation = ""
        if result == 'Real':
            explanation = "The video appears to be authentic. No significant inconsistencies detected across frames."
        else:
            explanation = "The video appears to be fake. Possible inconsistencies detected in facial movements, lighting, or temporal coherence."
        
        return result, confidence, explanation
    
    except Exception as e:
        print(f"Error in classify_video: {str(e)}")
        import traceback
        traceback.print_exc()
        return "Error", 0, f"Error processing video: {str(e)}"

@csrf_exempt
def predict(request):
    if request.method == 'POST' and request.FILES.get('image'):
        uploaded_file = request.FILES['image']
        file_name = uploaded_file.name
        file_path = default_storage.save(file_name, ContentFile(uploaded_file.read()))
        file_path_full = os.path.join(default_storage.location, file_path)
        
        # Check file type to determine which model to use
        file_extension = os.path.splitext(file_name)[1].lower()
        
        try:
            if file_extension in ['.mp4', '.avi', '.mov', '.wmv']:
                # Process as video
                result, confidence, explanation = classify_video(file_path_full)
                media_type = "video"
                
                # Video response doesn't include heatmap
                response_data = {
                    "result": result, 
                    "confidence": float(confidence), 
                    "explanation": explanation,
                    "mediaType": media_type
                }
            else:
                # Process as image
                result, confidence, explanation = classify_image(file_path_full)
                media_type = "image"
                
                # Generate heatmap for image analysis
                heatmap_b64 = generate_gradcam(file_path_full, model, last_conv_layer_name="conv2d_2")
                
                # Image response includes heatmap
                response_data = {
                    "result": result, 
                    "confidence": float(confidence), 
                    "explanation": explanation,
                    "mediaType": media_type,
                    "heatmap": heatmap_b64
                }
                
            # Clean up
            if os.path.exists(file_path_full):
                os.remove(file_path_full)
            
            return JsonResponse(response_data)
            
        except Exception as e:
            # Handle any errors
            if os.path.exists(file_path_full):
                os.remove(file_path_full)
            print(f"Error in predict: {str(e)}")
            import traceback
            traceback.print_exc()
            return JsonResponse({
                "result": "Error",
                "confidence": 0,
                "explanation": f"Error processing file: {str(e)}",
                "mediaType": "video" if file_extension in ['.mp4', '.avi', '.mov', '.wmv'] else "image"
            })
    
    return JsonResponse({"error": "Invalid request"}, status=400)