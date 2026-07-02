# Deployment Guide for CLY$T App

## Prerequisites

- Node.js and npm installed
- Vercel CLI installed (`npm i -g vercel`)
- Python 3.11 or higher
- All required environment variables set

## Deployment Checklist

### 1. Environment Variables

Before deploying, ensure these environment variables are set in your Vercel
project settings:

- `SECRET_KEY` - Your Flask secret key for session management
- `GEMINI_API_KEY` - Your Google Gemini API key for AI features
- `DATABASE_URL` (optional) - For production database (e.g., PostgreSQL)

### 2. Local Testing

Run these commands to test locally before deployment:

```bash
# Install dependencies
pip install -r requirements.txt

# Run the Flask app
python app.py
```

The app should be accessible at `http://localhost:5000`

### 3. Deploy to Vercel

```bash
# Login to Vercel (first time only)
vercel login

# Deploy the app
vercel

# For production deployment
vercel --prod
```

### 4. Database Considerations

**Current Setup**: SQLite (shop.db)

- Works fine for development
- Not ideal for serverless/production on Vercel (data may be lost)

**Recommended for Production**:

- PostgreSQL (via Neon, Railway, or similar)
- MongoDB
- Firebase/Firestore

To use a different database, update the `DATABASE_URL` environment variable.

## Important Notes

### File Structure

- `/api/index.py` - Vercel serverless entry point
- `/app.py` - Main Flask application
- `/static/` - Static files (CSS, JS, images)
- `/templates/` - HTML templates
- `/models/` - Database models
- `/py/` - Python modules (AI, translation)

### Static Files

Vercel will serve static files from the `/static` directory with long-term
caching headers for optimal performance.

### Features

- User authentication (login/register)
- Product listing and management
- AI-powered product description generation
- Multi-language support
- User profiles with avatars

## Troubleshooting

### Issue: Database connection errors

- Ensure `DATABASE_URL` is properly set in Vercel environment variables
- Verify database credentials and network access

### Issue: Missing environment variables

- Check Vercel project settings > Environment Variables
- Ensure all required keys are set

### Issue: Static files not loading

- Check browser console for 404 errors
- Verify static file paths in templates
- Ensure `/static` folder is included in deployment

### Issue: API timeouts

- Gemini API calls may timeout - consider increasing timeout settings
- Check API key validity and rate limits

## Local Development

For development, ensure `.env` file contains:

```
SECRET_KEY=your_dev_secret_key
GEMINI_API_KEY=your_gemini_api_key
FLASK_ENV=development
```

Do NOT commit `.env` file to git - use `.env.example` as a template.

## Monitoring

After deployment, monitor your Vercel project:

1. Check Vercel Dashboard for deployment status
2. View logs in Vercel > Function Logs
3. Monitor API usage (especially Gemini API)
4. Watch for database connection issues
