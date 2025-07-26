# Deployment Guide - Mideyateller Fashion Store

This guide will help you deploy the Mideyateller Fashion Store to production using Netlify for the frontend and Heroku for the backend.

## 🚀 Frontend Deployment (Netlify)

### Prerequisites
- GitHub account with the repository pushed
- Netlify account (free tier available)

### Step 1: Connect Repository to Netlify

1. **Login to Netlify**: Go to [netlify.com](https://netlify.com) and sign in
2. **New Site from Git**: Click "New site from Git"
3. **Choose GitHub**: Select GitHub as your Git provider
4. **Select Repository**: Choose `Mrteesoft/mideyateller_fashion_store`
5. **Configure Build Settings**:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

### Step 2: Environment Variables

In your Netlify dashboard, go to **Site settings > Environment variables** and add:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.herokuapp.com/api
NEXT_PUBLIC_SITE_URL=https://your-netlify-site.netlify.app
NEXT_PUBLIC_SITE_NAME=Mideyateller Fashion Store
```

### Step 3: Deploy

1. Click **Deploy site**
2. Wait for the build to complete
3. Your site will be available at `https://your-site-name.netlify.app`

### Step 4: Custom Domain (Optional)

1. Go to **Site settings > Domain management**
2. Click **Add custom domain**
3. Enter your domain (e.g., `mideyateller.com`)
4. Follow DNS configuration instructions

---

## 🔧 Backend Deployment (Heroku)

### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed

### Step 1: Prepare Backend for Deployment

1. **Create Procfile** in the `server` directory:
```bash
echo "web: node server.js" > server/Procfile
```

2. **Update package.json** in server directory to include start script:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Step 2: Create Heroku App

```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Add MongoDB addon (optional - or use MongoDB Atlas)
heroku addons:create mongolab:sandbox
```

### Step 3: Set Environment Variables

```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-jwt-key
heroku config:set MONGODB_URI=your-mongodb-connection-string
heroku config:set FRONTEND_URL=https://your-netlify-site.netlify.app
heroku config:set PORT=3002
```

### Step 4: Deploy to Heroku

```bash
# Add Heroku remote
git remote add heroku https://git.heroku.com/your-app-name.git

# Deploy only the server directory
git subtree push --prefix=server heroku main
```

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier M0)

### Step 2: Configure Database Access

1. **Database Access**: Create a database user
2. **Network Access**: Add your IP address (or 0.0.0.0/0 for all IPs)
3. **Connect**: Get your connection string

### Step 3: Update Environment Variables

Update both Netlify and Heroku with the MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mideyateller?retryWrites=true&w=majority
```

---

## 🔄 Continuous Deployment

### Automatic Deployments

Both Netlify and Heroku can be configured for automatic deployments:

**Netlify**: Automatically deploys when you push to the `main` branch

**Heroku**: Set up automatic deployments from GitHub:
1. Go to your Heroku app dashboard
2. Click **Deploy** tab
3. Connect to GitHub
4. Enable automatic deploys from `main` branch

---

## 🧪 Testing Deployment

### Frontend Testing
1. Visit your Netlify URL
2. Test all sections and navigation
3. Verify responsive design on mobile
4. Check carousel functionality

### Backend Testing
1. Test API endpoints using Postman or curl
2. Verify database connections
3. Test authentication flows
4. Check CORS settings

### Integration Testing
1. Ensure frontend can communicate with backend
2. Test form submissions
3. Verify image uploads work
4. Test all user flows

---

## 🚨 Troubleshooting

### Common Issues

**Build Failures**:
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check for missing environment variables

**API Connection Issues**:
- Verify CORS settings in backend
- Check API URL in frontend environment variables
- Ensure backend is running and accessible

**Database Connection Issues**:
- Verify MongoDB connection string
- Check database user permissions
- Ensure network access is configured

### Logs and Debugging

**Netlify Logs**: Available in the Netlify dashboard under **Deploys**

**Heroku Logs**: 
```bash
heroku logs --tail --app your-app-name
```

---

## 📊 Performance Optimization

### Frontend Optimization
- Enable Netlify's asset optimization
- Configure caching headers (already in netlify.toml)
- Optimize images and SVGs

### Backend Optimization
- Enable gzip compression
- Implement API rate limiting
- Use database indexing
- Add Redis for caching (optional)

---

## 🔒 Security Checklist

- [ ] Environment variables are secure
- [ ] JWT secrets are strong and unique
- [ ] CORS is properly configured
- [ ] Database access is restricted
- [ ] HTTPS is enabled (automatic with Netlify/Heroku)
- [ ] Input validation is implemented
- [ ] Rate limiting is configured

---

## 📈 Monitoring and Analytics

### Recommended Tools
- **Netlify Analytics**: Built-in analytics
- **Google Analytics**: Add tracking ID to environment variables
- **Heroku Metrics**: Monitor backend performance
- **MongoDB Atlas Monitoring**: Database performance

---

## 🎉 Go Live!

Once everything is deployed and tested:

1. **Update DNS** (if using custom domain)
2. **Test all functionality** thoroughly
3. **Monitor logs** for any issues
4. **Share your beautiful fashion store** with the world!

Your Mideyateller Fashion Store is now live and ready to serve customers! 🛍️✨
