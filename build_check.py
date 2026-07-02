#!/usr/bin/env python3
"""
Build verification script for CLY$T app
Checks all required files and dependencies before deployment
"""

import os
import sys
import subprocess
from pathlib import Path


def check_file_exists(filepath, description=""):
    """Check if a file exists"""
    if Path(filepath).exists():
        print(f"✓ {description or filepath}")
        return True
    else:
        print(f"✗ MISSING: {description or filepath}")
        return False


def check_directory_exists(dirpath, description=""):
    """Check if a directory exists"""
    if Path(dirpath).exists() and Path(dirpath).is_dir():
        print(f"✓ {description or dirpath}")
        return True
    else:
        print(f"✗ MISSING: {description or dirpath}")
        return False


def check_python_packages():
    """Check if required Python packages are installed"""
    packages = [
        'flask',
        'flask_login',
        'flask_sqlalchemy',
        'sqlalchemy',
        'dotenv',
        'requests',
        'PIL',
        'deep_translator',
        'langdetect',
    ]
    
    print("\n📦 Checking Python packages...")
    missing = []
    
    for package in packages:
        try:
            __import__(package)
            print(f"✓ {package}")
        except ImportError:
            print(f"✗ {package} - NOT INSTALLED")
            missing.append(package)
    
    return len(missing) == 0, missing


def check_environment_variables():
    """Check if environment variables are set"""
    print("\n🔑 Checking environment variables...")
    required_for_prod = ['SECRET_KEY', 'GEMINI_API_KEY']
    
    for var in required_for_prod:
        if os.environ.get(var):
            print(f"✓ {var}")
        else:
            print(f"⚠ {var} - NOT SET (required for production)")
    
    if os.environ.get('FLASK_ENV') == 'production':
        print(f"✓ FLASK_ENV=production")
    else:
        print(f"⚠ FLASK_ENV not set to 'production'")


def main():
    print("🔍 CLY$T Build Verification\n")
    print("=" * 50)
    
    all_good = True
    
    # Check core files
    print("\n📄 Checking core files...")
    all_good &= check_file_exists("app.py", "Main Flask application")
    all_good &= check_file_exists("requirements.txt", "Python dependencies")
    all_good &= check_file_exists("vercel.json", "Vercel configuration")
    all_good &= check_file_exists(".env.example", "Environment template")
    all_good &= check_file_exists("api/index.py", "Vercel entry point")
    
    # Check directories
    print("\n📁 Checking directories...")
    all_good &= check_directory_exists("static", "Static files directory")
    all_good &= check_directory_exists("templates", "Templates directory")
    all_good &= check_directory_exists("models", "Models directory")
    all_good &= check_directory_exists("py", "Python modules directory")
    
    # Check subdirectories
    print("\n📂 Checking subdirectories...")
    all_good &= check_directory_exists("static/css", "CSS files")
    all_good &= check_directory_exists("static/js", "JavaScript files")
    all_good &= check_directory_exists("static/images", "Images directory")
    
    # Check Python packages
    packages_ok, missing_packages = check_python_packages()
    all_good &= packages_ok
    
    # Check environment
    check_environment_variables()
    
    print("\n" + "=" * 50)
    
    if all_good and packages_ok:
        print("\n✅ All checks passed! App is ready for deployment.")
        return 0
    else:
        print("\n⚠️  Some checks failed. Please review above.")
        if missing_packages:
            print(f"\nTo install missing packages, run:")
            print(f"pip install {' '.join(missing_packages)}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
