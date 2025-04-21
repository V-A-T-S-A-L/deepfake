#!/usr/bin/env bash
# exit on error
set -o errexit

# Install packages in smaller groups to avoid memory issues
pip install django django-cors-headers gunicorn whitenoise
pip install opencv-python-headless pillow numpy matplotlib
pip install tensorflow

# collect static files
python server/manage.py collectstatic --no-input

# run migrations
python server/manage.py migrate