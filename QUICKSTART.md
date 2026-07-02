# Quick Reference Guide

## Local Development

### Setup

```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (Mac/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your API keys
```

### Running

```bash
# Flask development server
python app.py

# Flask with auto-reload
FLASK_ENV=development FLASK_APP=app.py flask run

# With Docker
docker-compose up
```

### Testing

```bash
# Pre-deployment check
python build_check.py

# Install test dependencies
pip install pytest pytest-cov

# Run tests
pytest
```

## Database

### Local Development

```bash
# Database uses SQLite (shop.db) by default
# Database creates automatically on first run
```

### Production

```bash
# Set DATABASE_URL environment variable
# Example PostgreSQL:
DATABASE_URL=postgresql://user:password@localhost/dbname

# SQLAlchemy will use this automatically
```

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login (first time)
vercel login

# Deploy (staging)
vercel

# Deploy (production)
vercel --prod
```

### Docker

```bash
# Build image
docker build -t clyst:latest .

# Run container
docker run -p 5000:5000 clyst:latest

# Using docker-compose
docker-compose up --build

# Stop container
docker-compose down
```

### Traditional Servers

```bash
# Update Procfile as needed
# For Heroku:
heroku create
git push heroku main

# For Railway/Render: Push to git, connect to repo
```

## Environment Variables

```bash
# Required
SECRET_KEY=your-very-secret-key-here
GEMINI_API_KEY=your-google-api-key

# Optional
DATABASE_URL=postgresql://...  # Production database
FLASK_ENV=production           # Set for production
```

## Git Workflow

```bash
# Check what changed
git status

# Stage changes
git add .
git commit -m "Your commit message"

# Push to remote
git push origin main

# Pull latest
git pull origin main
```

## Debugging

### Enable Debug Mode

```bash
# In .env or terminal
FLASK_ENV=development
FLASK_DEBUG=1
```

### View Logs

```bash
# Flask development
# Logs appear in terminal

# Production (Vercel)
# View at: vercel.com > Project > Function Logs

# Docker
docker logs <container-id>
```

### Common Issues

```bash
# Module not found
pip install -r requirements.txt

# Port already in use
python app.py --port 5001

# Database locked
rm instance/shop.db  # Delete and recreate

# Clear cache
rm -rf __pycache__
```

## Package Management

```bash
# Add new package
pip install package-name
pip freeze > requirements.txt

# Update package
pip install --upgrade package-name

# Remove package
pip uninstall package-name
```

## Code Quality

```bash
# Format code
pip install black
black .

# Lint
pip install flake8
flake8 .

# Type checking
pip install mypy
mypy .
```

## Performance Testing

```bash
# Check static file sizes
find static -type f -exec du -h {} +

# Test API response time
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/
```

## Useful Links

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Google Generative AI](https://ai.google.dev/)
- [Vercel Docs](https://vercel.com/docs)
- [Flask-Login](https://flask-login.readthedocs.io/)

## File Locations

| What            | Where                  |
| --------------- | ---------------------- |
| Main app        | `app.py`               |
| Database models | `models/models.py`     |
| AI features     | `py/ai_detect.py`      |
| Translation     | `py/translate_text.py` |
| CSS             | `static/css/`          |
| JavaScript      | `static/js/`           |
| Images          | `static/images/`       |
| HTML pages      | `templates/`           |
| Config          | `.env`, `vercel.json`  |

## Quick Fixes

```bash
# Restart everything
git pull origin main
pip install -r requirements.txt
rm -rf instance/shop.db
python app.py

# Sync database
python -c "from app import app, db; app.app_context().push(); db.create_all()"

# Verify setup
python build_check.py
```

---

**Need more help?** Check:

- `README.md` - Project overview
- `DEPLOYMENT.md` - Deployment guide
- `BUILD_SUMMARY.md` - Build details
