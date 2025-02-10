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

# Load the trained model
MODEL_PATH = "C:/Users/91810/OneDrive/Documents/GitHub/deepfake/server/detection/models/model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

# Load the face detection model
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

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
    confidence = float(confidence)
    os.remove(file_path)
    return JsonResponse({"result": result, "confidence": confidence, "explanation": explanation})
    return JsonResponse({"error": "Invalid request"}, status=400)
