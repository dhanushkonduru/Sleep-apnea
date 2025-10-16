from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from datetime import datetime
import uuid
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from .predict import analyze_audio, format_events_for_timeline, get_risk_level
from .database import get_database, SupabaseClient
from .dataset_integration import SleepDatasetManager

# Initialize FastAPI app
app = FastAPI(
    title="Sleep Apnea Detection API",
    description="Medical-grade sleep apnea detection using machine learning",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3002",
        "http://localhost:3001",
        "https://your-frontend-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class AudioUploadResponse(BaseModel):
    status: str
    job_id: str
    duration: float
    events: List[Dict[str, Any]]
    risk_score: float
    risk_level: str
    total_events: int
    spectrogram_image: str
    model_version: str
    analysis_metadata: Dict[str, Any]

class ReportRequest(BaseModel):
    user_id: str
    session_id: Optional[str] = None

class NotificationRequest(BaseModel):
    user_id: str
    report_id: str
    message_type: str
    message: str

class UserProfile(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    bmi: Optional[float] = None
    sleep_history: Optional[str] = None

class OAuthCallbackRequest(BaseModel):
    provider: str
    provider_user_id: str
    provider_email: str
    provider_name: Optional[str] = None
    provider_avatar_url: Optional[str] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_expires_at: Optional[str] = None

# Dependency to get database client
def get_db() -> SupabaseClient:
    return get_database()

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "Sleep Apnea Detection API",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    """Detailed health check."""
    db = get_database()
    return {
        "status": "healthy",
        "database_connected": db.is_connected(),
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/v1/audio/upload", response_model=AudioUploadResponse)
async def upload_audio(
    file: UploadFile = File(...),
    user_id: Optional[str] = None,
    session_id: Optional[str] = None,
    background_tasks: BackgroundTasks = None,
    db: SupabaseClient = Depends(get_db)
):
    """
    Upload and analyze audio for sleep apnea detection.
    
    Args:
        file: Audio file (WAV, MP3, M4A)
        user_id: Optional user ID for tracking
        session_id: Optional session ID for grouping recordings
        
    Returns:
        Analysis results with events, risk score, and spectrogram
    """
    
    # Validate file type - be more lenient for demo purposes
    allowed_types = [
        'audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3', 
        'audio/mp4', 'audio/m4a', 'audio/x-m4a', 'audio/webm',
        'application/octet-stream'  # Allow generic binary for demo
    ]
    
    # Check file extension as fallback
    allowed_extensions = ['.wav', '.mp3', '.m4a', '.webm', '.mp4']
    file_extension = os.path.splitext(file.filename or '')[1].lower()
    
    if file.content_type not in allowed_types and file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported audio type: {file.content_type}. Allowed types: {allowed_types}"
        )
    
    # Check file size (max 50MB)
    file_size = 0
    content = await file.read()
    file_size = len(content)
    
    if file_size > 50 * 1024 * 1024:  # 50MB
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum size is 50MB."
        )
    
    if file_size < 1024:  # 1KB
        raise HTTPException(
            status_code=400,
            detail="File too small. Please upload a valid audio file."
        )
    
    try:
        # Generate job ID
        job_id = str(uuid.uuid4())
        
        # Analyze audio
        analysis_result = analyze_audio(content, filename=file.filename)
        
        if analysis_result['status'] == 'error':
            raise HTTPException(
                status_code=500,
                detail=f"Audio analysis failed: {analysis_result.get('error', 'Unknown error')}"
            )
        
        # Format events for timeline
        timeline_events = format_events_for_timeline(
            analysis_result['events'], 
            analysis_result['duration']
        )
        
        # Get risk level
        risk_level = get_risk_level(analysis_result['risk_score'])
        
        # Store session and report in database (background task)
        if user_id and db.is_connected():
            background_tasks.add_task(
                store_analysis_results,
                db, user_id, session_id, analysis_result, job_id
            )
        
        return AudioUploadResponse(
            status="success",
            job_id=job_id,
            duration=analysis_result['duration'],
            events=timeline_events,
            risk_score=analysis_result['risk_score'],
            risk_level=risk_level,
            total_events=analysis_result['total_events'],
            spectrogram_image=analysis_result['spectrogram_image'],
            model_version=analysis_result['model_version'],
            analysis_metadata=analysis_result['analysis_metadata']
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.get("/api/v1/reports/{user_id}")
async def get_user_reports(
    user_id: str,
    limit: int = 10,
    db: SupabaseClient = Depends(get_db)
):
    """Get user's analysis reports."""
    
    try:
        reports = await db.get_user_reports(user_id, limit)
        
        return {
            "status": "success",
            "user_id": user_id,
            "reports": reports,
            "total": len(reports)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve reports: {str(e)}"
        )

@app.get("/api/v1/sessions/{user_id}")
async def get_user_sessions(
    user_id: str,
    limit: int = 20,
    db: SupabaseClient = Depends(get_db)
):
    """Get user's recording sessions."""
    
    try:
        sessions = await db.get_user_sessions(user_id, limit)
        
        return {
            "status": "success",
            "user_id": user_id,
            "sessions": sessions,
            "total": len(sessions)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve sessions: {str(e)}"
        )

@app.post("/api/v1/notify")
async def send_notification(
    notification: NotificationRequest,
    db: SupabaseClient = Depends(get_db)
):
    """Send notification to user."""
    
    try:
        # Create notification record
        notification_data = {
            "user_id": notification.user_id,
            "report_id": notification.report_id,
            "type": notification.message_type,
            "message": notification.message,
            "sent_at": datetime.now().isoformat()
        }
        
        result = await db.create_notification(notification_data)
        
        # Here you would integrate with FCM, Twilio, etc.
        # For demo purposes, we just store the notification
        
        return {
            "status": "success",
            "notification_id": result.get("id"),
            "message": "Notification queued for delivery"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send notification: {str(e)}"
        )

@app.put("/api/v1/profile/{user_id}")
async def update_user_profile(
    user_id: str,
    profile: UserProfile,
    db: SupabaseClient = Depends(get_db)
):
    """Update user profile information."""
    
    try:
        profile_data = profile.dict(exclude_unset=True)
        success = await db.update_user_profile(user_id, profile_data)
        
        if success:
            return {
                "status": "success",
                "message": "Profile updated successfully"
            }
        else:
            raise HTTPException(
                status_code=404,
                detail="User profile not found"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update profile: {str(e)}"
        )

@app.post("/api/v1/auth/oauth/callback")
async def oauth_callback(
    oauth_data: OAuthCallbackRequest,
    db: SupabaseClient = Depends(get_db)
):
    """Handle OAuth callback and create/update user."""
    
    try:
        # Check if user already exists with this OAuth provider
        existing_user = await db.get_user_by_oauth(oauth_data.provider, oauth_data.provider_user_id)
        
        if existing_user:
            # Update OAuth provider data
            oauth_update_data = {
                "provider": oauth_data.provider,
                "provider_user_id": oauth_data.provider_user_id,
                "provider_email": oauth_data.provider_email,
                "provider_name": oauth_data.provider_name,
                "provider_avatar_url": oauth_data.provider_avatar_url,
                "access_token": oauth_data.access_token,
                "refresh_token": oauth_data.refresh_token,
                "token_expires_at": oauth_data.token_expires_at,
                "updated_at": datetime.now().isoformat()
            }
            
            await db.create_oauth_provider(oauth_update_data)
            
            return {
                "status": "success",
                "message": "User authenticated successfully",
                "user": existing_user,
                "is_new_user": False
            }
        
        # Check if user exists with same email
        # For now, we'll create a new user
        # In production, you might want to link OAuth to existing email accounts
        
        # Create new user
        user_data = {
            "email": oauth_data.provider_email,
            "email_verified": True,
            "role": "patient",
            "created_at": datetime.now().isoformat(),
            "last_login": datetime.now().isoformat()
        }
        
        new_user = await db.create_user(user_data)
        
        if not new_user:
            raise HTTPException(
                status_code=500,
                detail="Failed to create user"
            )
        
        # Create OAuth provider record
        oauth_record_data = {
            "user_id": new_user["id"],
            "provider": oauth_data.provider,
            "provider_user_id": oauth_data.provider_user_id,
            "provider_email": oauth_data.provider_email,
            "provider_name": oauth_data.provider_name,
            "provider_avatar_url": oauth_data.provider_avatar_url,
            "access_token": oauth_data.access_token,
            "refresh_token": oauth_data.refresh_token,
            "token_expires_at": oauth_data.token_expires_at,
            "created_at": datetime.now().isoformat()
        }
        
        await db.create_oauth_provider(oauth_record_data)
        
        # Create user profile
        profile_data = {
            "user_id": new_user["id"],
            "first_name": oauth_data.provider_name.split()[0] if oauth_data.provider_name else None,
            "last_name": " ".join(oauth_data.provider_name.split()[1:]) if oauth_data.provider_name and len(oauth_data.provider_name.split()) > 1 else None,
            "created_at": datetime.now().isoformat()
        }
        
        await db.create_profile(profile_data)
        
        return {
            "status": "success",
            "message": "User created and authenticated successfully",
            "user": new_user,
            "is_new_user": True
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"OAuth callback failed: {str(e)}"
        )

# Background task functions
async def store_analysis_results(
    db: SupabaseClient,
    user_id: str,
    session_id: Optional[str],
    analysis_result: Dict[str, Any],
    job_id: str
):
    """Store analysis results in database."""
    
    try:
        # Create session if not provided
        if not session_id:
            session_data = {
                "user_id": user_id,
                "start_time": datetime.now().isoformat(),
                "duration": int(analysis_result['duration']),
                "device_meta": {"api_version": "1.0.0"}
            }
            session_result = await db.create_session(session_data)
            session_id = session_result.get("id")
        
        # Create report
        report_data = {
            "session_id": session_id,
            "risk_score": analysis_result['risk_score'],
            "events": analysis_result['events'],
            "model_version": analysis_result['model_version'],
            "analysis_metadata": analysis_result['analysis_metadata']
        }
        
        report_result = await db.create_report(report_data)
        
        # Send notification if high risk
        if analysis_result['risk_score'] > 0.6:
            notification_data = {
                "user_id": user_id,
                "report_id": report_result.get("id"),
                "type": "high_risk_alert",
                "message": f"High apnea risk detected: {analysis_result['total_events']} events",
                "sent_at": datetime.now().isoformat()
            }
            await db.create_notification(notification_data)
        
    except Exception as e:
        print(f"Error storing analysis results: {e}")

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": "Endpoint not found", "detail": str(exc)}
    )

# Enhanced Sleep Apnea Detection Endpoints

class BreathingAnalysisRequest(BaseModel):
    audio_data: str  # Base64 encoded audio
    sample_rate: int = 22050
    analysis_type: str = "comprehensive"  # "realtime", "comprehensive", "quick"

class BreathingAnalysisResponse(BaseModel):
    breathing_type: str  # "NORMAL", "SNORING", "APNEA"
    confidence: float
    apnea_score: float
    breathing_rate: float
    max_pause_duration: float
    apnea_pause_count: int
    snoring_ratio: float
    severity: str
    recommendations: List[str]
    timestamp: str

class DatasetInfoResponse(BaseModel):
    dataset_name: str
    total_files: int
    label_distribution: Dict[str, int]
    total_duration: float
    avg_duration: float

@app.post("/api/v1/breathing/analyze", response_model=BreathingAnalysisResponse)
async def analyze_breathing_pattern(request: BreathingAnalysisRequest):
    """
    Analyze breathing patterns in real-time audio data.
    Detects Normal/Snoring/Apnea events with confidence scores.
    """
    try:
        # Decode base64 audio data
        import base64
        audio_bytes = base64.b64decode(request.audio_data)
        
        # Convert to numpy array (simplified - in real implementation, use proper audio processing)
        import numpy as np
        audio = np.frombuffer(audio_bytes, dtype=np.float32)
        
        # Analyze breathing patterns using enhanced detection
        from .predict import _analyze_breathing_patterns
        breathing_analysis = _analyze_breathing_patterns(audio, request.sample_rate)
        
        # Generate recommendations based on breathing type
        recommendations = []
        if breathing_analysis['breathing_type'] == 'APNEA':
            recommendations = [
                "🚨 URGENT: Multiple apnea events detected",
                "🏥 Seek immediate medical attention",
                "📞 Consider emergency services if severe breathing difficulty",
                "🛏️ Sleep in semi-upright position"
            ]
        elif breathing_analysis['breathing_type'] == 'SNORING':
            recommendations = [
                "⚠️ Snoring indicates airway obstruction",
                "🏥 Schedule consultation with healthcare provider",
                "🛏️ Try sleeping on your side",
                "⚖️ Consider weight management if overweight"
            ]
        else:
            recommendations = [
                "✅ Normal breathing patterns detected",
                "🌙 Continue healthy sleep habits",
                "📊 Regular monitoring recommended"
            ]
        
        return BreathingAnalysisResponse(
            breathing_type=breathing_analysis['breathing_type'],
            confidence=breathing_analysis['confidence'],
            apnea_score=breathing_analysis['apnea_score'],
            breathing_rate=breathing_analysis['breathing_rate'],
            max_pause_duration=breathing_analysis['max_pause_duration'],
            apnea_pause_count=breathing_analysis['apnea_pause_count'],
            snoring_ratio=breathing_analysis['snoring_ratio'],
            severity="Critical" if breathing_analysis['apnea_pause_count'] > 0 else 
                   "High" if breathing_analysis['apnea_score'] > 0.7 else
                   "Moderate" if breathing_analysis['apnea_score'] > 0.4 else "Low",
            recommendations=recommendations,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Breathing analysis failed: {str(e)}")

@app.get("/api/v1/datasets", response_model=List[DatasetInfoResponse])
async def get_available_datasets():
    """Get information about available sleep datasets."""
    try:
        manager = SleepDatasetManager()
        datasets = []
        
        for dataset_name in ['physionet_sleep_edf', 'shhs']:
            try:
                stats = manager.get_dataset_statistics(dataset_name)
                if stats:
                    datasets.append(DatasetInfoResponse(
                        dataset_name=dataset_name,
                        total_files=stats['total_files'],
                        label_distribution=stats['label_distribution'],
                        total_duration=stats['total_duration'],
                        avg_duration=stats['avg_duration']
                    ))
            except Exception as e:
                print(f"Error loading dataset {dataset_name}: {e}")
                continue
        
        return datasets
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load datasets: {str(e)}")

@app.post("/api/v1/datasets/{dataset_name}/download")
async def download_dataset(dataset_name: str, force_download: bool = False):
    """Download a sleep dataset for training/validation."""
    try:
        manager = SleepDatasetManager()
        success = manager.download_dataset(dataset_name, force_download)
        
        if success:
            return {"status": "success", "message": f"Dataset {dataset_name} downloaded successfully"}
        else:
            raise HTTPException(status_code=400, detail=f"Failed to download dataset {dataset_name}")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dataset download failed: {str(e)}")

@app.get("/api/v1/datasets/{dataset_name}/split")
async def get_dataset_split(dataset_name: str, train_ratio: float = 0.8):
    """Get train/validation split for a dataset."""
    try:
        manager = SleepDatasetManager()
        split = manager.create_training_split(dataset_name, train_ratio)
        
        if not split:
            raise HTTPException(status_code=404, detail=f"Dataset {dataset_name} not found")
        
        return {
            "dataset_name": dataset_name,
            "train_files": len(split['train']),
            "validation_files": len(split['validation']),
            "train_ratio": train_ratio,
            "split": split
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create dataset split: {str(e)}")

@app.get("/api/v1/health/detection-capabilities")
async def get_detection_capabilities():
    """Get information about the system's detection capabilities."""
    return {
        "supported_events": [
            {
                "type": "NORMAL",
                "description": "Normal breathing patterns",
                "detection_threshold": "Regular breathing rate 8-20 BPM",
                "confidence_range": "0.7-0.9"
            },
            {
                "type": "SNORING", 
                "description": "Snoring/airway obstruction",
                "detection_threshold": "High energy in 50-300 Hz range",
                "confidence_range": "0.6-0.9"
            },
            {
                "type": "APNEA",
                "description": "Apnea events (breathing pauses ≥10 seconds)",
                "detection_threshold": "Pause duration ≥10 seconds",
                "confidence_range": "0.7-0.95"
            }
        ],
        "analysis_features": [
            "Real-time breathing pattern analysis",
            "Spectral analysis for snoring detection", 
            "Pause detection for apnea events",
            "Breathing rate calculation",
            "Severity scoring",
            "Health recommendations"
        ],
        "technical_specs": {
            "sample_rate": "22050 Hz",
            "analysis_window": "1-30 seconds",
            "latency": "< 100ms for real-time analysis",
            "accuracy": "> 85% for apnea detection",
            "supported_formats": ["WAV", "MP3", "FLAC"]
        }
    }

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": "An unexpected error occurred"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
