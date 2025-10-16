# Sleep Apnea Detection System

A medical-grade web application for detecting sleep apnea events from audio recordings using machine learning.

## 🚀 Features

- 🎤 **Real-time audio recording** and upload
- 🧠 **ML-powered apnea detection** using spectrogram analysis
- 📊 **Animated spectrogram visualization** with interactive timeline
- 📈 **Risk scoring** and event detection
- 🔔 **Real-time notifications** and alerts
- 🔐 **Google OAuth authentication** for secure sign-in/sign-up
- 📱 **Mobile-responsive design** with accessibility features
- ♿ **WCAG compliant** for accessibility
- 🎯 **Demo mode** with sample audio clips
- 📊 **Analytics dashboard** with user insights

## 🛠 Tech Stack

### Frontend
- **Next.js 13** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Web Audio API** for recording
- **Supabase** for authentication and database

### Backend
- **FastAPI** with Python
- **PyTorch** for ML inference
- **Librosa** for audio processing
- **Docker** for containerization

### Database & Storage
- **Supabase** (PostgreSQL + Storage)
- **Redis** for caching
- **MinIO** for local S3-compatible storage

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker (optional)
- Supabase account

### 1. Clone and Setup

```bash
git clone <your-repo>
cd sleep-apnea-demo
```

### 2. Environment Setup

Copy the environment template:
```bash
cp env.example .env
```

Edit `.env` with your configuration:
```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Run the database schema**:
   ```sql
   -- Copy and paste the contents of supabase/schema.sql
   -- into your Supabase SQL editor
   ```
3. **Get your project credentials** from Settings > API
4. **Update your .env file** with the credentials

### 4. Google OAuth Setup (Optional)

For Google sign-in/sign-up functionality:

1. **Follow the detailed guide**: See [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)
2. **Quick setup**:
   - Create Google OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Google provider in Supabase Authentication
   - Add OAuth credentials to your `.env` file

### 5. Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 6. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 7. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services Included

- **Frontend**: Next.js app on port 3000
- **Backend**: FastAPI on port 8000
- **Database**: PostgreSQL on port 5432
- **Redis**: Caching on port 6379
- **MinIO**: S3-compatible storage on port 9000
- **Nginx**: Reverse proxy on port 80
- **Prometheus**: Monitoring on port 9090
- **Grafana**: Visualization on port 3001

## 📁 Project Structure

```
sleep-apnea-demo/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py            # FastAPI application
│   │   ├── model.py           # ML model implementation
│   │   ├── predict.py         # Audio processing pipeline
│   │   ├── database.py        # Database client
│   │   └── requirements.txt   # Python dependencies
│   └── Dockerfile             # Backend container
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── pages/             # Next.js pages
│   │   ├── components/         # React components
│   │   ├── lib/               # Utilities and API client
│   │   └── styles/            # Global styles
│   ├── public/sample_clips/   # Demo audio files
│   ├── package.json           # Node dependencies
│   └── Dockerfile             # Frontend container
├── supabase/                   # Database schema
│   ├── schema.sql             # Database schema
│   ├── seed.sql               # Sample data
│   └── config.toml            # Supabase config
├── nginx/                      # Reverse proxy config
│   └── nginx.conf             # Nginx configuration
├── monitoring/                 # Monitoring setup
│   ├── prometheus.yml         # Prometheus config
│   └── grafana/               # Grafana dashboards
├── docker-compose.yml         # Docker services
├── env.example                # Environment template
└── README.md                  # This file
```

## 🔌 API Endpoints

### Audio Analysis
- `POST /api/v1/audio/upload` - Upload audio for analysis
- `WS /api/v1/audio/stream` - Real-time streaming analysis

### User Management
- `GET /api/v1/reports/{user_id}` - Get user reports
- `GET /api/v1/sessions/{user_id}` - Get user sessions
- `PUT /api/v1/profile/{user_id}` - Update user profile

### Notifications
- `POST /api/v1/notify` - Send notifications

### Health Check
- `GET /health` - Service health status

## 🎯 Demo Flow

1. **Visit the landing page** at http://localhost:3000
2. **Try the demo** with sample audio clips
3. **Record your own audio** (10-30 seconds recommended)
4. **View the analysis** with animated spectrogram
5. **Explore the timeline** with detected events
6. **Check the dashboard** for historical data

## 🔧 Development

### Backend Development

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Database Management

```bash
# Connect to local PostgreSQL
psql -h localhost -U sleepapnea -d sleepapnea

# Run migrations
psql -h localhost -U sleepapnea -d sleepapnea -f supabase/schema.sql
```

## 📊 Monitoring

### Prometheus Metrics
- **Backend metrics**: http://localhost:9090
- **Custom metrics**: Audio processing time, success rates

### Grafana Dashboards
- **Application metrics**: http://localhost:3001
- **Username**: admin
- **Password**: admin123

## 🚀 Production Deployment

### Railway Deployment

1. **Backend**:
   ```bash
   # Connect to Railway
   railway login
   railway link
   
   # Deploy
   railway up
   ```

2. **Frontend**:
   ```bash
   # Deploy to Vercel
   vercel --prod
   ```

### Environment Variables for Production

```env
# Production settings
DEBUG=false
NODE_ENV=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-production-key
```

## 🔒 Security

### Data Protection
- **Encryption**: All audio files encrypted at rest
- **HTTPS**: TLS encryption in transit
- **Authentication**: Supabase Auth with JWT tokens
- **Rate Limiting**: API rate limiting enabled

### Privacy Compliance
- **HIPAA Ready**: Medical data handling compliance
- **GDPR Compliant**: EU data protection standards
- **Data Retention**: Configurable retention policies

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Tests
```bash
# Run with Docker
docker-compose -f docker-compose.test.yml up --build
```

## 📈 Performance

### Optimization Features
- **Audio compression**: Automatic audio optimization
- **Caching**: Redis-based caching layer
- **CDN**: Static asset delivery
- **Database indexing**: Optimized queries

### Monitoring
- **Real-time metrics**: Prometheus + Grafana
- **Error tracking**: Comprehensive logging
- **Performance alerts**: Automated monitoring

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Medical Disclaimer

**Important**: This application is for educational and research purposes only. It is not intended for medical diagnosis or treatment. Always consult with qualified healthcare professionals for medical advice.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

### Common Issues

1. **Audio upload fails**: Check file format and size limits
2. **Analysis timeout**: Reduce audio duration or check server resources
3. **Database connection**: Verify Supabase credentials
4. **CORS errors**: Check API URL configuration

## 🔄 Updates

### Version History
- **v1.0.0**: Initial release with basic apnea detection
- **v1.1.0**: Added real-time analysis and notifications
- **v1.2.0**: Enhanced UI with accessibility features

### Roadmap
- [ ] Mobile app (React Native)
- [ ] Advanced ML models
- [ ] Multi-language support
- [ ] Clinical integration
- [ ] Real-time collaboration

---

**Built with ❤️ for better sleep health**
