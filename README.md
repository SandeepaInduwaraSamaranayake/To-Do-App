# TODO App 📝

A modern, full-stack TODO application built with React, FastAPI, and PostgreSQL. Features a beautiful, responsive UI with Tailwind CSS and a robust REST API backend.

![TODO App](https://img.shields.io/badge/Status-Production%20Ready-green)
![Docker](https://img.shields.io/badge/Docker-Supported-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Real-time Updates**: Add and complete tasks instantly
- **Persistent Storage**: PostgreSQL database with automated schema setup
- **RESTful API**: FastAPI backend with automatic API documentation
- **Docker Support**: Complete containerized setup for easy deployment
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🛠️ Technologies Used

### Frontend
- **React** `19.1.1` - Modern UI library with hooks
- **Vite** `7.1.7` - Lightning-fast build tool and dev server
- **Tailwind CSS** `3.4.18` - Utility-first CSS framework
- **PostCSS** `8.5.6` - CSS processing and optimization
- **ESLint** `9.36.0` - Code linting and formatting

### Backend
- **FastAPI** - Modern, fast Python web framework
- **Uvicorn** - Lightning-fast ASGI server
- **SQLAlchemy** - Python SQL toolkit and ORM
- **Pydantic** - Data validation using Python type hints
- **psycopg2-binary** - PostgreSQL adapter for Python

### Database
- **PostgreSQL** `16.10` - Advanced open-source relational database

### DevOps
- **Docker** - Containerization platform
- **Docker Compose** - Multi-container application orchestration
- **Nginx** - High-performance web server and reverse proxy

## 📋 Prerequisites

Before running this application, make sure you have:

- **Docker** (v20.0 or higher)
- **Docker Compose** (v2.0 or higher)
- **Node.js** `20.x` (for local development)
- **Python** `3.11+` (for local development)

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TODO_APP
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Option 2: Local Development

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
export DATABASE_URL="postgresql+psycopg2://user:password@localhost:5432/todo_db"
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Database Setup
```bash
# Start PostgreSQL (using Docker)
docker run --name todo_db -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=todo_db -p 5432:5432 -v ./db/schema.sql:/docker-entrypoint-initdb.d/schema.sql postgres:16-alpine
```

## 📁 Project Structure

```
TODO_APP/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application file
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile         # Backend container config
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Global styles with Tailwind
│   ├── package.json       # Node.js dependencies
│   ├── tailwind.config.js # Tailwind configuration
│   ├── vite.config.js     # Vite configuration
│   ├── nginx.conf         # Nginx configuration
│   └── Dockerfile         # Frontend container config
├── db/
│   └── schema.sql         # Database schema and sample data
├── docker-compose.yml     # Multi-container configuration
└── README.md             # This file
```

## 🗄️ Database Schema

The application uses a simple but effective schema:

```sql
CREATE TABLE task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Configuration

### Environment Variables

The application supports the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+psycopg2://user:password@db:5432/todo_db` |
| `PORT` | Backend server port | `8000` |

### Docker Compose Services

- **db**: PostgreSQL database with automatic schema initialization
- **api**: FastAPI backend server
- **web**: Nginx server serving the React frontend and proxying API requests

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | Get the 5 most recent incomplete tasks |
| `POST` | `/tasks` | Create a new task |
| `PATCH` | `/tasks/{task_id}/complete` | Mark a task as completed |
| `GET` | `/docs` | Interactive API documentation |

### Example API Usage

```bash
# Get tasks
curl http://localhost:8000/tasks

# Create a task
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, bread, eggs"}'

# Complete a task
curl -X PATCH http://localhost:8000/tasks/1/complete
```

## 🎨 UI Features

- **Responsive Grid Layout**: Two-column layout on large screens, single column on mobile
- **Modern Form Design**: Clean input fields with focus states
- **Task Cards**: Beautiful cards with shadows and hover effects
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Smooth Animations**: Hover effects and transitions

## 🐳 Docker Configuration

### Frontend (Multi-stage build)
- **Build Stage**: Node.js 20 Alpine for building the React app
- **Production Stage**: Nginx Alpine for serving static files and API proxying

### Backend
- **Base**: Python 3.11 Slim for optimal performance
- **Features**: Automatic dependency installation and hot-reload support

### Database
- **Base**: PostgreSQL 16 Alpine
- **Features**: Automatic schema initialization with sample data

## 🔍 Troubleshooting

### Common Issues

1. **CSS not loading**: Ensure Tailwind CSS v3.x is installed (not v4.x beta)
2. **API connection errors**: Check that all containers are running with `docker-compose ps`
3. **Database connection issues**: Verify PostgreSQL is ready before starting API
4. **Port conflicts**: Ensure ports 8080, 8000, and 5432 are available

### Useful Commands

```bash
# View container logs
docker-compose logs -f [service-name]

# Restart services
docker-compose restart

# Rebuild containers
docker-compose up --build --force-recreate

# Clean up
docker-compose down -v
docker system prune
```

## 🚀 Deployment

### Production Deployment

1. **Update environment variables** for production database
2. **Configure reverse proxy** (e.g., Nginx, Traefik)
3. **Set up SSL certificates** for HTTPS
4. **Configure monitoring** and logging
5. **Set up backup strategy** for PostgreSQL

### Environment-specific Configuration

```bash
# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Development
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) for the excellent Python web framework
- [React](https://reactjs.org/) for the powerful UI library
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful styling system
- [Docker](https://www.docker.com/) for containerization support

---

**Built with ❤️ using modern web technologies**