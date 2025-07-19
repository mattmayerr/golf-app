# Golf App Deployment Guide

This guide will help you deploy your golf app to production using Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub account
- Vercel account (free)
- Render account (free)
- MongoDB Atlas account (already configured)

## Step 1: Deploy Backend to Render

### 1.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Click "New +" and select "Web Service"

### 1.2 Connect Repository
1. Connect your GitHub repository containing the golf app
2. Configure the service:
   - **Name**: `golf-app-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 1.3 Set Environment Variables
In Render dashboard, add these environment variables:
```
MONGO_URI=mongodb+srv://mattmayerr:%21Buster1326@cluster0.at5rajz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=10000
GOOGLE_MAPS_API_KEY=AIzaSyCPBgf65V_6V94p8gnjU04DWYLJLehnXLg
```

### 1.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL (e.g., `https://golf-app-backend.onrender.com`)

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"

### 2.2 Import Repository
1. Import your GitHub repository
2. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 2.3 Set Environment Variables
In Vercel dashboard, add these environment variables:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyCPBgf65V_6V94p8gnjU04DWYLJLehnXLg
```

**Important**: Replace `your-backend-url.onrender.com` with your actual Render backend URL.

### 2.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be available at the provided Vercel URL

## Step 3: Update CORS Configuration (if needed)

If you encounter CORS issues, update your backend CORS configuration in `backend/server.js`:

```javascript
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

## Step 4: Test Your Deployment

1. Visit your Vercel frontend URL
2. Test user registration and login
3. Test adding golf rounds and courses
4. Verify all functionality works as expected

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your backend CORS configuration includes your frontend URL
2. **Environment Variables**: Double-check all environment variables are set correctly
3. **Build Errors**: Check the build logs in Vercel/Render for any missing dependencies
4. **Database Connection**: Verify your MongoDB Atlas connection string is correct

### Useful Commands:

- **Check backend logs**: View logs in Render dashboard
- **Check frontend logs**: View logs in Vercel dashboard
- **Redeploy**: Both platforms support automatic redeployment on git push

## Security Notes

1. **JWT Secret**: Change the JWT secret in production
2. **API Keys**: Keep your Google Maps API key secure
3. **Database**: Ensure your MongoDB Atlas cluster has proper security settings

## Cost

- **Vercel**: Free tier includes unlimited deployments
- **Render**: Free tier includes 750 hours/month
- **MongoDB Atlas**: Free tier includes 512MB storage

## Next Steps

1. Set up custom domain (optional)
2. Configure monitoring and analytics
3. Set up automated testing
4. Implement CI/CD pipeline

Your golf app is now live and ready to use! 🏌️ 