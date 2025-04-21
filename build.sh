#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

# collect static files
python server/manage.py collectstatic --no-input

# run migrations
python server/manage.py migrate