# RateMyPopUp

Full-stack application built with **Vite + React** (frontend) and **Django + PostgreSQL** (backend).

## Project Structure

```
RateMyPopUp/
├── frontend/          # Vite + React
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/           # Django + DRF
│   ├── config/        # Django project settings
│   ├── api/           # API app
│   ├── requirements.txt
│   ├── manage.py
│   └── .env
└── README.md
```

## Prerequisites

- **Node.js** >= 18
- **Python** >= 3.10
- **PostgreSQL** >= 14

## Getting Started

### 1. Database

```bash
# Create the PostgreSQL database
psql -U postgres -c "CREATE DATABASE ratemypopup;"
```

### 2. Backend

```bash
cd backend

# Create and activate a virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy and edit environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
python manage.py migrate

# Start the dev server
python manage.py runserver
```

The API will be available at **http://localhost:8000/api/**.

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173/**.

The Vite dev server proxies `/api/*` requests to Django, so the frontend can call the backend without CORS issues during development.

## API Endpoints

| Method | URL            | Description         |
|--------|----------------|---------------------|
| GET    | `/api/health/` | API health check    |

## Environment Variables

See `backend/.env.example` for all available configuration options.
