import os
from typing import Dict, List, Any, Optional
from supabase import create_client, Client
from datetime import datetime
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class SupabaseClient:
    """Supabase database client for sleep apnea detection system."""
    
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_ANON_KEY")
        
        if not self.url or not self.key:
            print("Warning: Supabase credentials not found. Using mock database.")
            self.client = None
        else:
            self.client: Client = create_client(self.url, self.key)
    
    def is_connected(self) -> bool:
        """Check if database connection is available."""
        return self.client is not None
    
    async def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user in the database."""
        if not self.is_connected():
            return {"id": "mock_user_id", "created_at": datetime.now().isoformat()}
        
        try:
            result = self.client.table("users").insert(user_data).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            print(f"Error creating user: {e}")
            return {}
    
    async def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID."""
        if not self.is_connected():
            return {"id": user_id, "email": "demo@example.com", "role": "patient"}
        
        try:
            result = self.client.table("users").select("*").eq("id", user_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error getting user: {e}")
            return None
    
    async def create_session(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new recording session."""
        if not self.is_connected():
            return {"id": "mock_session_id", "created_at": datetime.now().isoformat()}
        
        try:
            result = self.client.table("sessions").insert(session_data).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            print(f"Error creating session: {e}")
            return {}
    
    async def create_report(self, report_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create an analysis report."""
        if not self.is_connected():
            return {"id": "mock_report_id", "created_at": datetime.now().isoformat()}
        
        try:
            # Convert events to JSON string for storage
            if "events" in report_data and isinstance(report_data["events"], list):
                report_data["events"] = json.dumps(report_data["events"])
            
            result = self.client.table("reports").insert(report_data).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            print(f"Error creating report: {e}")
            return {}
    
    async def get_user_reports(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get user's analysis reports."""
        if not self.is_connected():
            return [
                {
                    "id": "mock_report_1",
                    "risk_score": 0.3,
                    "total_events": 2,
                    "created_at": datetime.now().isoformat()
                }
            ]
        
        try:
            result = self.client.table("reports")\
                .select("*, sessions!inner(user_id)")\
                .eq("sessions.user_id", user_id)\
                .order("created_at", desc=True)\
                .limit(limit)\
                .execute()
            
            reports = []
            for report in result.data:
                # Parse events JSON
                if report.get("events"):
                    try:
                        report["events"] = json.loads(report["events"])
                    except:
                        report["events"] = []
                reports.append(report)
            
            return reports
        except Exception as e:
            print(f"Error getting user reports: {e}")
            return []
    
    async def update_user_profile(self, user_id: str, profile_data: Dict[str, Any]) -> bool:
        """Update user profile information."""
        if not self.is_connected():
            return True
        
        try:
            result = self.client.table("profiles")\
                .update(profile_data)\
                .eq("user_id", user_id)\
                .execute()
            return len(result.data) > 0
        except Exception as e:
            print(f"Error updating profile: {e}")
            return False
    
    async def create_notification(self, notification_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a notification record."""
        if not self.is_connected():
            return {"id": "mock_notification_id", "created_at": datetime.now().isoformat()}
        
        try:
            result = self.client.table("notifications").insert(notification_data).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            print(f"Error creating notification: {e}")
            return {}
    
    async def get_user_sessions(self, user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Get user's recording sessions."""
        if not self.is_connected():
            return [
                {
                    "id": "mock_session_1",
                    "duration": 300,
                    "created_at": datetime.now().isoformat(),
                    "device_meta": {"browser": "Chrome", "os": "macOS"}
                }
            ]
        
        try:
            result = self.client.table("sessions")\
                .select("*")\
                .eq("user_id", user_id)\
                .order("created_at", desc=True)\
                .limit(limit)\
                .execute()
            
            return result.data or []
        except Exception as e:
            print(f"Error getting user sessions: {e}")
            return []
    
    async def create_oauth_provider(self, oauth_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create or update OAuth provider record."""
        if not self.is_connected():
            return {"id": "mock_oauth_id", "created_at": datetime.now().isoformat()}
        
        try:
            # Check if provider already exists
            existing = self.client.table("oauth_providers")\
                .select("*")\
                .eq("provider", oauth_data["provider"])\
                .eq("provider_user_id", oauth_data["provider_user_id"])\
                .execute()
            
            if existing.data:
                # Update existing record
                result = self.client.table("oauth_providers")\
                    .update(oauth_data)\
                    .eq("id", existing.data[0]["id"])\
                    .execute()
                return result.data[0] if result.data else {}
            else:
                # Create new record
                result = self.client.table("oauth_providers").insert(oauth_data).execute()
                return result.data[0] if result.data else {}
        except Exception as e:
            print(f"Error creating OAuth provider: {e}")
            return {}
    
    async def get_oauth_provider(self, provider: str, provider_user_id: str) -> Optional[Dict[str, Any]]:
        """Get OAuth provider by provider and provider_user_id."""
        if not self.is_connected():
            return None
        
        try:
            result = self.client.table("oauth_providers")\
                .select("*")\
                .eq("provider", provider)\
                .eq("provider_user_id", provider_user_id)\
                .execute()
            
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error getting OAuth provider: {e}")
            return None
    
    async def get_user_by_oauth(self, provider: str, provider_user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by OAuth provider and provider_user_id."""
        if not self.is_connected():
            return None
        
        try:
            result = self.client.table("oauth_providers")\
                .select("*, users!inner(*)")\
                .eq("provider", provider)\
                .eq("provider_user_id", provider_user_id)\
                .execute()
            
            if result.data:
                oauth_data = result.data[0]
                user_data = oauth_data["users"]
                return user_data
            return None
        except Exception as e:
            print(f"Error getting user by OAuth: {e}")
            return None
    
    async def create_profile(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create user profile."""
        if not self.is_connected():
            return {"id": "mock_profile_id", "created_at": datetime.now().isoformat()}
        
        try:
            result = self.client.table("profiles").insert(profile_data).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            print(f"Error creating profile: {e}")
            return {}

# Global database client
db_client = SupabaseClient()

def get_database() -> SupabaseClient:
    """Get the global database client."""
    return db_client
