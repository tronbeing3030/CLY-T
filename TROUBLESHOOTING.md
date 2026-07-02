# Troubleshooting Guide

Common issues and solutions for CLY$T deployment.

## 🔴 Critical Issues

### Error: ModuleNotFoundError: No module named 'app'

**Symptoms:** Import error when deploying

**Causes:**

- Missing `api/index.py`
- Wrong Python path in `api/index.py`

**Solutions:**

```bash
# Verify api/index.py exists
ls -la api/index.py

# Check file content starts with:
# sys.path.insert(0, os.path.dirname(os.path.dirname(...)))
```

### Error: 502 Bad Gateway

**Symptoms:** Website shows 502 error

**Causes:**

- Flask app crashing
- Missing environment variables
- Database connection error

**Solutions:**

```bash
# Check Vercel logs
vercel logs

# Test locally
python app.py

# Verify environment variables in Vercel dashboard
# Add missing ones from .env.example
```

### Error: Connection refused / Cannot connect to database

**Symptoms:** App crashes on startup

**Causes:**

- `DATABASE_URL` not set
- Wrong database credentials
- Database offline

**Solutions:**

```bash
# Check if using default SQLite
# That's fine for dev, but for production set DATABASE_URL:
DATABASE_URL=postgresql://user:pass@host/db

# Test connection locally
python -c "from sqlalchemy import create_engine; e = create_engine(os.environ['DATABASE_URL']); e.connect()"
```

## 🟡 Common Issues

### Static Files Not Loading (404 errors)

**Symptoms:** CSS/JS files return 404, images broken

**Causes:**

- Wrong `static_folder` configuration
- Static files not deployed
- Wrong paths in templates

**Check:**

```python
# In app.py, ensure:
app = Flask(__name__,
    static_folder='static',      # ← Check this
    static_url_path='/static',
    template_folder='templates')
```

**Fix in templates:**

```html
<!-- Correct -->
<link
	rel="stylesheet"
	href="{{ url_for('static', filename='css/styles.css') }}" />
<img src="{{ url_for('static', filename='images/logo.png') }}" />

<!-- Incorrect -->
<link rel="stylesheet" href="/static/css/styles.css" />
```

### API Keys Not Working (Gemini AI / Translation)

**Symptoms:** AI generation returns errors, translation fails

**Causes:**

- API key not set
- Invalid API key
- API quota exceeded
- Network issue

**Solutions:**

```bash
# 1. Check environment variable in Vercel Settings
# 2. Verify API key is valid
# 3. Test in code:
import os
key = os.environ.get('GEMINI_API_KEY')
print(f"Key exists: {bool(key)}")
print(f"Key starts with: {key[:10] if key else 'None'}...")

# 4. Check API quota in Google Cloud Console
```

### Database: "Locked database" error

**Symptoms:** SQLite locked database error

**Causes:**

- Multiple processes accessing SQLite
- File permissions issue

**Solutions:**

```bash
# For SQLite in development only
# For production, use PostgreSQL instead

# Quick fix:
rm instance/shop.db
python app.py  # Recreate database
```

### Timeout errors on Gemini API calls

**Symptoms:** Request times out waiting for AI response

**Causes:**

- API too slow
- Large image processing
- Network latency

**Solutions:**

```python
# Add timeout in ai_detect.py
genai.configure(api_key=api_key, timeout=30)

# Or optimize:
# - Use smaller images
# - Cache responses
# - Use different model (faster)
```

## 🟢 Minor Issues

### Build Warnings

**Solution:** Run build_check.py to see details

```bash
python build_check.py
```

### Import warnings on startup

**Solution:** Likely harmless, but check:

```bash
python app.py 2>&1 | grep -i warning
```

### Slow page loads

**Solutions:**

1. Check Chrome DevTools Network tab
2. Optimize database queries
3. Compress static files
4. Use CDN for images

### CORS errors in browser console

**Symptoms:** "Access to XMLHttpRequest blocked"

**Causes:**

- Cross-origin API calls
- Missing CORS headers

**Solutions:**

```bash
# Install Flask-CORS
pip install Flask-CORS

# In app.py add:
from flask_cors import CORS
CORS(app)
```

## 🔍 Debugging Steps

### 1. Check Logs

```bash
# Vercel logs
vercel logs --follow

# Docker logs
docker logs <container-id>

# Heroku logs
heroku logs --tail
```

### 2. Test Locally

```bash
# Recreate production environment locally
FLASK_ENV=production python app.py

# Check for environment variable issues
python build_check.py
```

### 3. Isolate Problem

```bash
# Test each component:
python -c "import flask; print('Flask OK')"
python -c "import google.generativeai; print('Gemini OK')"
python -c "from sqlalchemy import create_engine; print('SQLAlchemy OK')"
```

### 4. Check Environment

```bash
# List all environment variables
python -c "import os; print('\n'.join(f'{k}={v}' for k,v in os.environ.items() if 'SECRET\|KEY\|TOKEN' not in k))"

# Check Python version
python --version

# Check dependencies
pip list
```

## Error Messages

### "The truth value of an array with more than one element is ambiguous"

**Cause:** SQLAlchemy comparison issue **Fix:** Use `Product.query.filter()`
instead of `if product_list`

### "TypeError: 'NoneType' object is not subscriptable"

**Cause:** Trying to access None like a dictionary **Fix:** Check if value
exists: `if request.files and request.files.get('file')`

### "SyntaxError: invalid syntax"

**Cause:** Python syntax error **Fix:** Check indentation, quotes, colons,
parentheses

### "AttributeError: 'module' object has no attribute"

**Cause:** Wrong import or typo **Fix:** Check import statement and attribute
name

## Performance Optimization

### Database Queries

```python
# Bad: N+1 query problem
for user in users:
    orders = Order.query.filter_by(user_id=user.id)  # N queries

# Good: Use relationship or join
users = User.query.options(db.joinedload(User.orders))
```

### Static Files

```bash
# Minify CSS/JS before deployment
python -m pip install csscompressor
python -m pip install jsmin

# Or use online tools:
# - CSS: https://www.toptal.com/css/minify
# - JS: https://www.toptal.com/javascript/minify
```

### Caching

```python
from flask import cache

@app.route('/data')
@cache.cached(timeout=3600)  # Cache for 1 hour
def get_data():
    return expensive_operation()
```

## Security Issues

### XSS (Cross-Site Scripting)

**Fix:** Use Jinja2 auto-escaping

```html
<!-- Jinja2 auto-escapes by default -->
{{ user_input }}
<!-- Safe -->
```

### SQL Injection

**Already protected:** SQLAlchemy uses parameterized queries

```python
# Safe (do this)
user = User.query.filter_by(email=email).first()

# Unsafe (never do this)
user = User.query.execute(f"SELECT * FROM users WHERE email='{email}'")
```

### CSRF (Cross-Site Request Forgery)

```python
# Already included with Flask-Login
# Just ensure CSRF protection is enabled
from flask_wtf.csrf import CSRFProtect
csrf = CSRFProtect(app)
```

## Before Asking for Help

1. ✅ Run `python build_check.py`
2. ✅ Check `vercel logs` or platform logs
3. ✅ Test locally: `python app.py`
4. ✅ Verify `.env` file exists with correct values
5. ✅ Check Vercel/platform environment variables
6. ✅ Review error message carefully
7. ✅ Search Stack Overflow for error message

## Getting Help

1. **Check Documentation:**
    - `README.md` - Overview
    - `DEPLOYMENT.md` - Deployment guide
    - `DEPLOYMENT_CHECKLIST.md` - Pre-deploy checklist

2. **Verify Setup:**
    - Run `python build_check.py`
    - Review logs from platform

3. **Test Components:**
    - Test database: `python -c "from app import db; print('DB OK')"`
    - Test imports: `python -c "from app import app; print('APP OK')"`
    - Test APIs: Call endpoints with curl/Postman

4. **Online Resources:**
    - [Flask Docs](https://flask.palletsprojects.com/)
    - [Vercel Help](https://vercel.com/support)
    - [Stack Overflow](https://stackoverflow.com) (tag: flask)

---

**Can't find your issue?** Check the error carefully and search online for the
exact error message + Python/Flask version.
