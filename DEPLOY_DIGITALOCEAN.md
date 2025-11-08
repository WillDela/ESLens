# 🚀 Deploy ESLens to DigitalOcean (GitHub Student Edition)

## Prerequisites

✅ GitHub account with Student Pack activated
✅ DigitalOcean account (sign up with GitHub Student email)
✅ Gemini API key
✅ Code pushed to GitHub

---

## Step 1: Activate DigitalOcean Student Credits

1. Go to: https://education.github.com/pack
2. Scroll to "DigitalOcean"
3. Click "Get access"
4. You'll get **$200 in credits** (valid for 1 year)
5. Sign up for DigitalOcean using your student email

---

## Step 2: Push Code to GitHub

```bash
cd /c/Users/William\ Delaosa/Desktop/ESLens

# Initialize git (already done)
# git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ESLens AI Tutoring System"

# Create GitHub repo (do this on github.com first!)
# Then connect:
git remote add origin https://github.com/YOUR_USERNAME/eslens.git

# Push
git push -u origin main
```

**OR** use GitHub Desktop:
1. Open GitHub Desktop
2. Add Local Repository: `C:/Users/William Delaosa/Desktop/ESLens`
3. Publish to GitHub
4. Make repository **Public** (required for hackathon)

---

## Step 3: Prepare for Deployment

### A. Update Backend for Production

Edit `backend/server.js` - it's already configured for production! ✅

### B. Update Frontend for Production

Edit `frontend/package.json` and add:

```json
"homepage": ".",
```

This tells React to use relative paths.

---

## Step 4: Deploy to DigitalOcean App Platform

### Create New App

1. Go to: https://cloud.digitalocean.com/apps
2. Click **"Create App"**
3. Choose **"GitHub"** as source
4. Authorize DigitalOcean to access your GitHub
5. Select your **eslens** repository
6. Branch: **main**
7. Check "Autodeploy" (deploys automatically on push)

### Configure Backend Component

1. Click **"Edit"** on the detected component
2. Settings:
   - **Name**: `eslens-backend`
   - **Type**: Web Service
   - **Source Directory**: `/backend`
   - **Build Command**: `npm install`
   - **Run Command**: `node server.js`
   - **HTTP Port**: `3001`

3. **Environment Variables** (IMPORTANT):
   Click "Environment Variables" and add:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://your-app-name.ondigitalocean.app
   ```

   Note: You'll update FRONTEND_URL after deployment

4. **Plan**: Select "$5/month" plan (will use your credits)

### Configure Frontend Component

1. Click **"Add Component"** → **"Web Service"**
2. Settings:
   - **Name**: `eslens-frontend`
   - **Type**: Static Site
   - **Source Directory**: `/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `build`

3. **Plan**: Select "Static Site" (FREE!)

### Review and Deploy

1. Review all settings
2. Click **"Create Resources"**
3. Wait 5-10 minutes for deployment

---

## Step 5: Configure Backend to Accept Frontend

Once deployed:

1. Copy your app URL (e.g., `https://eslens-abc123.ondigitalocean.app`)
2. Go to backend **Environment Variables**
3. Update `FRONTEND_URL` to your actual URL
4. Click **"Save"**
5. Backend will redeploy automatically

---

## Step 6: Get a Free Domain (GitHub Student Pack)

### Option A: Namecheap (Free .me domain for 1 year)

1. Go to: https://education.github.com/pack
2. Find "Namecheap"
3. Get your free .me domain
4. Register: **eslens.me** (or similar)

### Option B: .tech Domains (Free .tech for 1 year)

1. Go to: https://get.tech/github-student-developer-pack
2. Register: **eslens.tech**

### Configure Custom Domain in DigitalOcean

1. In DigitalOcean App Platform, go to **"Settings"** → **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain: `eslens.me` or `eslens.tech`
4. DigitalOcean will show you DNS records to add
5. Go to your domain registrar (Namecheap/.tech)
6. Add the DNS records:
   - **Type**: CNAME
   - **Host**: `@` or `www`
   - **Value**: `your-app.ondigitalocean.app`
7. Wait 10-30 minutes for DNS propagation
8. ✅ Your app will be live at `https://eslens.me`!

---

## Step 7: Test Your Deployment

Visit your live URL:
```
https://eslens.me (or your chosen domain)
https://your-app-name.ondigitalocean.app
```

**Test checklist:**
- [ ] Frontend loads
- [ ] Backend health check works: `https://your-url.com/api/health`
- [ ] Upload homework image
- [ ] Chat with tutor
- [ ] Voice synthesis works
- [ ] Session history works

---

## Alternative: Deploy to Render (100% Free)

If you want completely free hosting without using credits:

### Deploy to Render

1. Go to: https://render.com
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**

#### Backend:
- **Name**: eslens-backend
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Plan**: Free
- **Environment Variables**:
  ```
  GEMINI_API_KEY=your_key
  NODE_ENV=production
  PORT=3001
  ```

#### Frontend:
- **New +** → **"Static Site"**
- **Name**: eslens-frontend
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`
- **Plan**: Free

**Note**: Free tier has cold starts (30s delay if no traffic)

---

## Cost Breakdown

### DigitalOcean (With $200 Student Credit):
- Backend: $5/month (covered by credits for 40 months!)
- Frontend: FREE (static site)
- Domain: FREE for 1 year (GitHub Student Pack)
- **Total**: $0 for first year! ✅

### Render (No Credits Needed):
- Backend: FREE (with cold starts)
- Frontend: FREE
- Domain: FREE for 1 year (GitHub Student Pack)
- **Total**: $0 ✅

---

## Troubleshooting

### Backend won't start:
- Check Environment Variables are set correctly
- Verify `GEMINI_API_KEY` has no extra spaces
- Check build logs in DigitalOcean dashboard

### Frontend can't reach backend:
- Make sure `FRONTEND_URL` in backend env vars is correct
- Check CORS is enabled (already configured in server.js)
- Try accessing backend directly: `https://backend-url/api/health`

### Database issues:
- SQLite database is ephemeral on App Platform
- For production, consider upgrading to PostgreSQL (DigitalOcean Managed Database - $15/month, covered by credits)

### Domain not working:
- Wait 30 minutes for DNS propagation
- Check DNS records are correct
- Try accessing via direct DigitalOcean URL first

---

## Environment Variables Checklist

Make sure these are set in DigitalOcean:

**Backend:**
```
GEMINI_API_KEY=AIza...your_key
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.com
```

**Frontend:** (if needed)
```
REACT_APP_API_URL=https://your-backend-url
```

---

## Post-Deployment Checklist

- [ ] App is live and accessible
- [ ] Custom domain working (eslens.me or eslens.tech)
- [ ] Backend API responding
- [ ] Frontend can upload images
- [ ] Gemini AI agents working
- [ ] No CORS errors
- [ ] SSL certificate active (https://)
- [ ] Screenshot the live app
- [ ] Test on mobile device
- [ ] Add deployment URL to README
- [ ] Update Devpost submission with live link

---

## For Hackathon Submission

Add to your Devpost:

**Try it out link:**
```
https://eslens.me
or
https://your-app.ondigitalocean.app
```

**Demo credentials:** (if needed)
```
No login required - just upload homework and start chatting!
```

**Technologies used:**
- Google Gemini API ⭐
- DigitalOcean App Platform
- GitHub Student Pack
- Node.js, Express, React
- SQLite

---

## Next Steps After Deployment

1. **Share the link** in your hackathon submission
2. **Test thoroughly** before demo day
3. **Monitor usage** in DigitalOcean dashboard
4. **Add to resume** - you built and deployed a full-stack AI app!

---

## 🎉 Congratulations!

You now have a **live, production-ready AI tutoring system** accessible to anyone on the internet!

**Your app is helping immigrant students worldwide! 🌍📚**

---

**Need help?** Check the DigitalOcean docs or feel free to ask!
