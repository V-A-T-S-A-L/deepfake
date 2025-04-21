#!/usr/bin/env bash
# exit on error
set -o errexit

# Install system dependencies for dlib
apt-get update && apt-get install -y cmake libgl1-mesa-glx

pip install -r requirements.txt

# collect static files
python server/manage.py collectstatic --no-input

# run migrations
python server/manage.py migrate