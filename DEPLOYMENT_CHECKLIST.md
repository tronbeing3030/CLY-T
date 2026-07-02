# 🚀 Deployment Checklist

Use this checklist to ensure your app is ready for production deployment.

## Pre-Deployment (Before Any Deploy)

### Setup & Configuration

- [ ] **Environment File Created**
    ```bash
    cp .env.example .env
    # Edit .env with your actual values
    ```
- [ ] **Environment Variables Set**
    - `SECRET_KEY` - Random string (min 32 chars)
    - `GEMINI_API_KEY` - Your Google API key
    - `FLASK_ENV` - Set to "production"

- [ ] **All Dependencies Listed**
    - Run: `pip install -r requirements.txt`
    - No import errors when running: `python app.py`

### Testing & Verification

- [ ] **Build Check Passes**

    ```bash
    python build_check.py
    # Should see all ✓ marks
    ```

- [ ] **Local Testing Works**
    - Start app: `python app.py`
    - Visit http://localhost:5000
    - Test registration/login
    - Test product upload
    - Test AI generation (if API key set)
    - Test translation (if API key set)

- [ ] **Static Files Load**
    - CSS/JS not broken
    - Images display correctly
    - No 404 errors in console

- [ ] **Database Functions Work**
    - Create user account
    - Add product
    - Edit product
    - Delete product
    - Upload profile picture

### Code Quality

- [ ] **No Debug Code Left**
    - No `print()` statements for debugging
    - No `console.log()` statements left
    - Check `app.py` for debug mode

- [ ] **Environment Variables Safe**
    - `.env` is in `.gitignore`
    - `.env.example` shows template only
    - No secrets in code comments

- [ ] **Error Handling Added**
    - No bare `except:` clauses
    - Graceful error messages for users
    - Proper error logging

## Deployment to Vercel

### Step 1: Prepare Repository

- [ ] **Git Repository Set Up**

    ```bash
    git init
    git add .
    git commit -m "Prepare for deployment"
    ```

- [ ] **Code Pushed to Remote**
    ```bash
    git remote add origin <your-repo-url>
    git push -u origin main
    ```

### Step 2: Vercel Setup

- [ ] **Vercel Account Created**
    - Visit https://vercel.com
    - Sign up with GitHub/GitLab/Bitbucket

- [ ] **Project Imported**
    - Import repository in Vercel Dashboard
    - Auto-detects Python project

### Step 3: Environment Variables

- [ ] **Environment Variables Set in Vercel**
    1. Go to Project > Settings > Environment Variables
    2. Add:
        - `SECRET_KEY` - Your secret key
        - `GEMINI_API_KEY` - Your API key
        - `DATABASE_URL` (if using PostgreSQL)
        - `FLASK_ENV` - Set to "production"

### Step 4: Deploy

- [ ] **Initial Deployment**

    ```bash
    vercel --prod
    ```

- [ ] **Deployment Successful**
    - Check Vercel dashboard
    - Status shows "Ready"
    - URL provided works

### Step 5: Post-Deployment Testing

- [ ] **Live URL Works**
    - Visit your Vercel URL
    - Site loads without errors
    - No 404 errors in console

- [ ] **Basic Features Work**
    - User registration
    - User login
    - Product creation
    - Product viewing

- [ ] **API Keys Working**
    - AI generation works
    - Translation works
    - Image uploads work

## Alternative Deployments

### Docker Deployment

- [ ] **Docker Installed**

    ```bash
    docker --version
    ```

- [ ] **Image Builds**

    ```bash
    docker build -t clyst:latest .
    ```

- [ ] **Container Runs**

    ```bash
    docker run -p 5000:5000 clyst:latest
    ```

- [ ] **Test at localhost:5000**

### Heroku / Railway / Render

- [ ] **Account Created**
    - Visit platform website
    - Sign up/login

- [ ] **App Created**
    - New app created
    - Repository connected
    - Environment variables set

- [ ] **Deployment Triggered**
    - Auto-deploy from git push
    - Watch logs for errors

- [ ] **Test Live URL**
    - Visit provided URL
    - Verify functionality

## Post-Deployment

### Monitoring

- [ ] **Enable Error Tracking**
    - Check Vercel Function Logs
    - Set up notifications (optional)

- [ ] **Monitor API Usage**
    - Check Gemini API quota
    - Monitor database connections
    - Watch for rate limiting

### Optimization

- [ ] **Verify Static File Caching**
    - Browser cache working
    - Long-term cache headers set

- [ ] **Database Performance**
    - Monitor query times
    - Add indexes if needed
    - Consider read replicas

### Security

- [ ] **HTTPS Enabled**
    - Auto-enabled on Vercel
    - Certificate valid

- [ ] **Security Headers Set**
    - Consider adding CORS headers
    - Set CSP if needed

- [ ] **Input Validation**
    - User inputs validated
    - File uploads restricted
    - SQL injection protected

### Backup & Recovery

- [ ] **Database Backups**
    - Automated backups enabled
    - Test restore process
    - Know recovery procedure

- [ ] **Error Alerting Set Up**
    - Notified of errors
    - Know how to access logs
    - Have rollback plan

## Common Issues & Fixes

| Issue            | Fix                                             |
| ---------------- | ----------------------------------------------- |
| 502 Bad Gateway  | Check Vercel logs, restart, update dependencies |
| Import errors    | Ensure all packages in requirements.txt         |
| Static files 404 | Check static folder config in app.py            |
| Database errors  | Verify DATABASE_URL if using custom DB          |
| API timeouts     | Check API keys, rate limits, network            |
| CORS errors      | May need headers configuration                  |

## Performance Checklist

- [ ] **Load Time < 3 seconds**
    - Use Chrome DevTools
    - Check waterfall chart
    - Optimize slow endpoints

- [ ] **Database Queries Optimized**
    - No N+1 queries
    - Indexes on frequent columns
    - Connection pooling enabled

- [ ] **Static Files Optimized**
    - CSS/JS minified
    - Images compressed
    - Gzip compression enabled

## Final Sign-Off

- [ ] **All Tests Passed**
- [ ] **Documentation Updated**
- [ ] **Team Notified**
- [ ] **Monitoring Configured**
- [ ] **Backup Plan Ready**
- [ ] **Rollback Plan Ready**

---

## Quick Deploy Command

```bash
# One-liner for Vercel deployment (after git setup)
git add . && git commit -m "Deploy" && git push && vercel --prod
```

## Support

Need help? Check:

- `README.md` - Project overview
- `DEPLOYMENT.md` - Detailed deployment guide
- `QUICKSTART.md` - Common commands
- `BUILD_SUMMARY.md` - Build details

---

**Status: Ready to Deploy** ✅

Once you've completed this checklist, your app is ready for production!
