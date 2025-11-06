# MLops Intelligent Analyzer

## Project Overview
MLops Intelligent Analyzer is a full-stack machine learning operations platform designed for users to train, monitor, and manage machine learning models efficiently. The backend is built with FastAPI, providing secure JWT-based authentication, asynchronous model training with scikit-learn, and admin management. The frontend is a vibrant React application using Tailwind CSS and Framer Motion for a smooth user experience with dark/light mode support.

## Features
- User registration and login with secure password hashing and JWT authentication.
- Admin role auto-assigned based on specific email addresses.
- Start and monitor ML model training with CSV or manual data input.
- Real-time training progress using WebSocket.
- Dashboard with training statistics and charts.
- Admin panel for user, training, and log management with pagination and filters.
- Responsive and accessible UI with dark/light mode toggle.
- Dockerized backend and frontend, orchestrated with docker-compose.
- CI/CD workflows for automated testing and building.

## Tech Stack
- Backend: Python, FastAPI, SQLAlchemy, PostgreSQL/SQLite, scikit-learn, pandas, bcrypt, python-jose.
- Frontend: React, Vite, Tailwind CSS, Framer Motion, React Router, Axios, Zustand.
- DevOps: Docker, docker-compose, GitHub Actions.

## Prerequisites
- Docker and docker-compose installed (for containerized deployment)
- Python 3.10+ (if running backend locally)
- Node.js 18+ and npm (if running frontend locally)

## Backend Setup

### Environment Variables
Copy `backend/backend.env.example` to `backend/backend.env` and fill in:

    SECRET_KEY=your_secret_key_here
    DATABASE_URL=sqlite+aiosqlite:///./sql_app.db
    ADMIN_EMAILS=dasriyanka858@gmail.com,durjoychatterjee59@gmail.com
    ACCESS_TOKEN_EXPIRE_MINUTES=60

### Installation

    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    pip install -r requirements.txt

### Running

    uvicorn backend.main:app --reload

The backend will be available at `http://localhost:8000`.

### Testing

    pytest tests --asyncio-mode=auto --maxfail=1 --disable-warnings -q

## Frontend Setup

### Environment Variables
Copy `frontend/.env.example` to `.env.local` and adjust:

    VITE_API_BASE_URL=http://localhost:8000
    VITE_WS_BASE_URL=ws://localhost:8000

### Installation

    cd frontend
    npm ci

### Running

    npm run dev

The frontend will be available at `http://localhost:3000`.

## Docker Usage

Build and start containers:

    make init
    make start

- Backend accessible on port 8000
- Frontend accessible on port 3000

## Deployment

- Use environment variables securely in production.
- Use a production database like PostgreSQL.
- Configure HTTPS and domain routing.
- Scale backend and frontend services as needed.

## API Endpoints Summary

### Auth
- POST `/auth/register`: Register new user.
- POST `/auth/login`: Login user, returns JWT token.

### Training
- POST `/training/start`: Start training with parameters and optional CSV.
- GET `/training/progress`: WebSocket for training progress.
- GET `/training/{training_id}`: Get training details.

### Dashboard
- GET `/dashboard/summary`: Get user training stats.
- GET `/dashboard/results`: List of user trainings.

### Admin (Admin Only)
- GET `/admin/users`: List users.
- GET `/admin/users/{user_id}`: Get user.
- PUT `/admin/users/{user_id}`: Update user status and roles.
- DELETE `/admin/users/{user_id}`: Delete user.
- GET `/admin/trainings`: List trainings.
- DELETE `/admin/trainings/{training_id}`: Delete training.
- GET `/admin/logs`: Get system logs.

## Frontend Routes Summary

- `/`: Landing page.
- `/login`: Login form.
- `/register`: Registration form.
- `/form`: Training input form (authenticated).
- `/dashboard`: User dashboard (authenticated).
- `/admin`: Admin dashboard (admin only).
- `/admin/users`: User management.
- `/admin/trainings`: Training management.
- `/admin/logs`: Logs viewer.

## Troubleshooting

- Ensure backend is running on port 8000 before starting frontend.
- Verify environment variables are correctly set.
- For WebSocket issues, confirm proxy or firewall allows ws/wss.
- Check Docker resource limits if containers fail to start.
- Review logs for detailed error messages.

## Contribution Guidelines

- Fork the repository.
- Create feature branches.
- Write tests for new features.
- Follow code style and best practices.
- Submit pull requests for review.

## License

MIT License © 2024 MLops Intelligent Analyzer
