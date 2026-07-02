import sys
import os

# Add the root directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

# Vercel expects the WSGI app to be exported as 'app'
# This is automatically imported and handled by Vercel
