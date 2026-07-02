# CLY$T - E-Commerce Platform

A modern e-commerce platform built with Flask, featuring AI-powered product
descriptions, multi-language support, and user authentication.

## Features

- **User Authentication**: Secure login and registration system
- **Product Management**: Create, edit, and delete products
- **AI-Powered Descriptions**: Generate product descriptions using Google Gemini
  AI
- **Multi-Language Support**: Automatic translation and language detection
- **User Profiles**: Customizable user profiles with avatars
- **Responsive Design**: Mobile-friendly UI with Bootstrap

## Tech Stack

- **Backend**: Flask, SQLAlchemy, Flask-Login
- **Frontend**: Bootstrap 5, Vanilla JavaScript
- **AI**: Google Generative AI (Gemini)
- **Translation**: Deep Translator, Language Detect
- **Database**: SQLite (development), PostgreSQL (recommended for production)
- **Deployment**: Vercel, Docker, or traditional servers

## Quick Start

### Prerequisites

- Python 3.11 or higher
- Node.js (for Vercel CLI, optional)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd CLY$T
```

2. Create a virtual environment

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies

```bash
pip install -r requirements.txt
```

4. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run the application

```bash
python app.py
```

Visit `http://localhost:5000` in your browser.

## Environment Variables

```env
# Flask Configuration
SECRET_KEY=your-secret-key-here
FLASK_ENV=development  # Use 'production' for production

# API Keys
GEMINI_API_KEY=your-google-gemini-api-key

# Database (optional, defaults to SQLite)
DATABASE_URL=postgresql://user:password@host/dbname
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

### Docker

```bash
docker-compose up --build
```

### Heroku / Railway / Other Platforms

```bash
# Build will use Procfile
# Environment variables must be set on the platform
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Project Structure

```
.
├── app.py                 # Main Flask application
├── api/
│   └── index.py          # Vercel serverless entry point
├── models/
│   ├── __init__.py
│   └── models.py         # Database models (User, Product)
├── py/
│   ├── __init__.py
│   ├── ai_detect.py      # AI description generator
│   └── translate_text.py # Translation utilities
├── static/
│   ├── css/              # Stylesheets
│   ├── js/               # Client-side JavaScript
│   └── images/           # Static images
├── templates/            # HTML templates
├── requirements.txt      # Python dependencies
├── vercel.json          # Vercel configuration
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose
└── Procfile             # Heroku/Platform.sh configuration
```

## API Routes

### Authentication

- `POST /login` - User login
- `POST /register` - User registration
- `GET /logout` - User logout

### Products

- `GET /store` - List all products
- `GET /prod/<id>` - View product details
- `POST /add` - Create new product (requires login)
- `POST /edit/<id>` - Edit product (requires login)
- `POST /del_prod/<id>` - Delete product (requires login)

### User Management

- `GET /profile/<id>` - View user profile
- `GET /dash` - User dashboard (requires login)
- `POST /edit_profile` - Update profile (requires login)
- `POST /edit_dp` - Update profile picture (requires login)
- `POST /del_acc` - Delete account (requires login)

### AI & Translation

- `POST /generate` - Generate AI product description
- `POST /translate` - Translate text
- `POST /detect_lang` - Detect language

## Development

### Running Tests

```bash
python build_check.py
```

### Building for Production

See [build_check.py](build_check.py) for pre-deployment verification.

## Troubleshooting

### Database Issues

- For production, switch from SQLite to PostgreSQL
- Set `DATABASE_URL` environment variable

### Missing Environment Variables

- Copy `.env.example` to `.env`
- Fill in all required API keys

### Static Files Not Loading

- Ensure Flask is configured with correct `static_folder` and `template_folder`
- Check that static files are deployed with your application

### AI API Timeouts

- Verify Gemini API key is valid
- Check rate limits and quota
- Consider caching descriptions

## Contributing

Contributions are welcome! Please follow these guidelines:

- Create a feature branch
- Make changes with descriptive commits
- Submit a pull request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues or questions, please:

1. Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
2. Review the troubleshooting section
3. Open an issue on the repository

## Future Enhancements

- [ ] Advanced product filtering and search
- [ ] Payment integration
- [ ] Order management system
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Product ratings and reviews
- [ ] Wishlist functionality
- [ ] Analytics dashboard
