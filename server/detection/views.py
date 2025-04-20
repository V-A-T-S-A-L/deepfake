from django.shortcuts import render

# Create your views here.
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
    
    prediction = model.predict(image_array)
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

@csrf_exempt
def predict(request):
    print("backend from predict")
    if request.method == 'POST' and request.FILES.get('image'):
        image_file = request.FILES['image']
        file_path = default_storage.save("temp.jpg", ContentFile(image_file.read()))
    
        result, confidence, explanation = classify_image(file_path)
        heatmap_b64 = generate_gradcam(file_path, model, last_conv_layer_name="conv2d_2")  # use correct layer name here
        confidence = float(confidence)
        os.remove(file_path)
        return JsonResponse({
            "result": result,
            "confidence": confidence,
            "explanation": explanation,
            "heatmap": heatmap_b64
        })

    return JsonResponse({"error": "Invalid request"}, status=400)