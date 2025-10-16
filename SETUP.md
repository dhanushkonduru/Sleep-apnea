# Sleep Apnea Detection System - Setup Guide

This guide provides step-by-step instructions for setting up the Sleep Apnea Detection System.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Python 3.11+** - [Download here](https://python.org/)
- **Docker** (optional) - [Download here](https://docker.com/)
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Quick Setup (5 minutes)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd sleep-apnea-demo
```

### 2. Environment Configuration

```bash
# Copy the environment template
cp env.example .env

# Edit the .env file with your settings
nano .env  # or use your preferred editor
```

### 3. Supabase Setup

1. **Create a Supabase account** at [supabase.com](https://supabase.com)
2. **Create a new project**
3. **Go to Settings > API** and copy your credentials
4. **Update your .env file**:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Database Schema

1. **Go to your Supabase project dashboard**
2. **Navigate to SQL Editor**
3. **Copy and paste the contents of `supabase/schema.sql`**
4. **Run the SQL script**

### 5. Start the Application

#### Option A: Docker (Recommended)

```bash
# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

#### Option B: Manual Setup

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Detailed Setup

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

### Database Setup

#### Using Supabase (Recommended)

1. **Create a Supabase project**
2. **Run the schema**:
   ```sql
   -- Copy contents of supabase/schema.sql into Supabase SQL Editor
   ```
3. **Add sample data** (optional):
   ```sql
   -- Copy contents of supabase/seed.sql into Supabase SQL Editor
   ```

#### Using Local PostgreSQL

1. **Install PostgreSQL**
2. **Create database**:
   ```sql
   CREATE DATABASE sleepapnea;
   CREATE USER sleepapnea WITH PASSWORD 'sleepapnea123';
   GRANT ALL PRIVILEGES ON DATABASE sleepapnea TO sleepapnea;
   ```
3. **Run schema**:
   ```bash
   psql -h localhost -U sleepapnea -d sleepapnea -f supabase/schema.sql
   ```

## 🐳 Docker Setup

### Full Stack with Docker

```bash
# Clone the repository
git clone <your-repo-url>
cd sleep-apnea-demo

# Copy environment file
cp env.example .env

# Edit .env with your Supabase credentials
nano .env

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Database: localhost:5432
# Redis: localhost:6379
# MinIO: http://localhost:9001
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3001
```

### Individual Services

```bash
# Start only backend
docker-compose up backend

# Start only frontend
docker-compose up frontend

# Start with specific services
docker-compose up backend frontend redis
```

## 🔍 Verification

### Check Backend Health

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "database_connected": true,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Check Frontend

Visit http://localhost:3000 in your browser. You should see the landing page.

### Check Database Connection

```bash
# Using Supabase
curl -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     "https://your-project.supabase.co/rest/v1/users"

# Using local PostgreSQL
psql -h localhost -U sleepapnea -d sleepapnea -c "SELECT COUNT(*) FROM users;"
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or use different port
uvicorn app.main:app --reload --port 8001
```

#### 2. Python Dependencies Issues

```bash
# Update pip
pip install --upgrade pip

# Install with specific Python version
python3.11 -m pip install -r requirements.txt

# Use virtual environment
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 3. Node.js Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use specific Node version
nvm use 18
```

#### 4. Database Connection Issues

- **Check Supabase credentials** in `.env` file
- **Verify database URL** format
- **Check network connectivity**
- **Verify API keys** are correct

#### 5. Docker Issues

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check Docker logs
docker-compose logs -f backend
```

### Environment Variables Checklist

Ensure these variables are set in your `.env` file:

```env
# Required
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional (for local development)
DATABASE_URL=postgresql://sleepapnea:sleepapnea123@localhost:5432/sleepapnea
REDIS_URL=redis://localhost:6379
```

## 📊 Monitoring Setup

### Prometheus

Access Prometheus at http://localhost:9090

### Grafana

1. **Access Grafana** at http://localhost:3001
2. **Login** with admin/admin123
3. **Import dashboards** from `monitoring/grafana/`

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🔧 Development Tools

### Code Quality

```bash
# Backend linting
cd backend
flake8 app/
black app/
isort app/

# Frontend linting
cd frontend
npm run lint
npm run type-check
```

### Testing

```bash
# Backend tests
cd backend
python -m pytest tests/

# Frontend tests
cd frontend
npm test
```

## 🚀 Production Deployment

### Railway Deployment

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and link**:
   ```bash
   railway login
   railway link
   ```

3. **Deploy**:
   ```bash
   railway up
   ```

### Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy frontend**:
   ```bash
   cd frontend
   vercel --prod
   ```

### Environment Variables for Production

```env
# Production settings
DEBUG=false
NODE_ENV=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-production-key
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## 📞 Support

If you encounter issues:

1. **Check the logs** for error messages
2. **Verify environment variables** are correct
3. **Check network connectivity**
4. **Review the troubleshooting section** above
5. **Open an issue** on GitHub with detailed information

## 🎯 Next Steps

After successful setup:

1. **Explore the demo** at http://localhost:3000
2. **Try recording audio** with the built-in recorder
3. **View the analysis results** and spectrogram
4. **Check the dashboard** for user insights
5. **Customize the application** for your needs

---

**Happy coding! 🚀**
