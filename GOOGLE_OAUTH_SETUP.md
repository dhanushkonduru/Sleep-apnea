# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Sleep Apnea Detection System.

## Prerequisites

- A Google Cloud Platform account
- Access to the Google Cloud Console
- Your Supabase project set up and running

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create a New Project (or select existing)**
   - Click on the project dropdown at the top
   - Click "New Project"
   - Enter project name: "Sleep Apnea Detection"
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click on it and click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - If prompted, configure the OAuth consent screen first:
     - Choose "External" user type
     - Fill in required fields:
       - App name: "Sleep Apnea Detection"
       - User support email: your email
       - Developer contact: your email
     - Add scopes: `email`, `profile`, `openid`
     - Add test users if needed

5. **Configure OAuth Client**
   - Application type: "Web application"
   - Name: "Sleep Apnea Detection Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `http://localhost:3002` (for development)
     - Your production domain (when deployed)
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/callback/google` (for development)
     - `http://localhost:3002/auth/callback/google` (for development)
     - Your production callback URL (when deployed)

6. **Get Your Credentials**
   - Copy the Client ID and Client Secret
   - Save them securely

## Step 2: Configure Supabase

1. **Go to Supabase Dashboard**
   - Visit [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Configure Authentication**
   - Go to "Authentication" > "Providers"
   - Find "Google" and click "Enable"
   - Enter your Google OAuth credentials:
     - Client ID: (from Step 1)
     - Client Secret: (from Step 1)
   - Set redirect URL: `https://your-project-id.supabase.co/auth/v1/callback`
   - Click "Save"

3. **Update Site URL**
   - Go to "Authentication" > "URL Configuration"
   - Set Site URL to your frontend URL:
     - Development: `http://localhost:3000`
     - Production: your production domain
   - Add redirect URLs:
     - `http://localhost:3000/**`
     - `http://localhost:3002/**`
     - Your production domain

## Step 3: Update Environment Variables

1. **Backend Environment (.env)**
   ```bash
   # Add to your backend .env file
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback/google
   ```

2. **Frontend Environment (.env.local)**
   ```bash
   # Add to your frontend .env.local file
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Update Database Schema

Run the updated schema to add OAuth provider support:

```sql
-- Run this in your Supabase SQL editor
-- The schema has been updated to include oauth_providers table
-- See supabase/schema.sql for the complete schema
```

## Step 5: Test the Integration

1. **Start the Development Servers**
   ```bash
   # Backend
   cd backend
   python -m uvicorn app.main:app --reload --port 8000

   # Frontend
   cd frontend
   npm run dev
   ```

2. **Test Google Sign-In**
   - Open `http://localhost:3000`
   - Click "Sign In" or "Sign Up"
   - Click "Sign in with Google" or "Sign up with Google"
   - Complete the Google OAuth flow
   - Verify you're redirected back to the dashboard

## Step 6: Production Deployment

1. **Update Google OAuth Settings**
   - Add your production domain to authorized origins
   - Add your production callback URL to authorized redirect URIs

2. **Update Supabase Settings**
   - Update Site URL to your production domain
   - Add production redirect URLs

3. **Update Environment Variables**
   - Set production URLs in your environment variables
   - Ensure all OAuth settings point to production URLs

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" Error**
   - Ensure the redirect URI in Google Console matches exactly
   - Check that the URL is properly encoded
   - Verify the port numbers are correct

2. **"invalid_client" Error**
   - Verify your Client ID and Client Secret are correct
   - Check that the OAuth consent screen is properly configured

3. **"access_denied" Error**
   - Check that the required scopes are added
   - Verify the user has granted necessary permissions

4. **Supabase Authentication Issues**
   - Ensure Supabase is properly configured with Google provider
   - Check that the Site URL and redirect URLs are correct
   - Verify the Supabase project is active

### Debug Steps

1. **Check Browser Console**
   - Look for JavaScript errors
   - Check network requests to see what's failing

2. **Check Backend Logs**
   - Look for authentication errors
   - Verify database connections

3. **Test OAuth Flow Manually**
   - Use Google's OAuth 2.0 Playground to test credentials
   - Verify the redirect URI works

## Security Considerations

1. **Environment Variables**
   - Never commit OAuth secrets to version control
   - Use environment variables for all sensitive data
   - Rotate secrets regularly

2. **HTTPS in Production**
   - Always use HTTPS in production
   - Update OAuth settings to use HTTPS URLs

3. **Scope Limitations**
   - Only request necessary scopes
   - Regularly review and audit permissions

4. **User Data Protection**
   - Follow GDPR/privacy regulations
   - Implement proper data retention policies
   - Secure user profile data

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Authentication Guide](https://nextjs.org/docs/authentication)
- [FastAPI OAuth Integration](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the Google Cloud Console logs
3. Check Supabase authentication logs
4. Verify all environment variables are set correctly
5. Ensure all URLs are properly configured

For additional help, refer to the official documentation or create an issue in the project repository.
