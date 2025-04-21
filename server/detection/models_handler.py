import os
import urllib.request
from pathlib import Path

# Base directory for models
MODELS_DIR = Path(__file__).resolve().parent / 'models'

def ensure_model_exists(model_name, download_url=None):
    """Ensure model file exists, download if needed and URL provided."""
    model_path = MODELS_DIR / model_name
    
    # Create models directory if it doesn't exist
    os.makedirs(MODELS_DIR, exist_ok=True)
    
    # If model doesn't exist and we have a download URL
    if not model_path.exists() and download_url:
        print(f"Downloading model {model_name}...")
        urllib.request.urlretrieve(download_url, model_path)
        print(f"Model {model_name} downloaded successfully.")
    
    return model_path