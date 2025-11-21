# Unsugar.io Frontend Deployment Guide

## Quick Deploy Options

### Option 1: Netlify CLI (Recommended)

#### Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Deploy
```bash
cd /Users/kshitijshah/Desktop/Workspaces/unsugar-io

# Login to Netlify
netlify login

# Build the app
npm run build

# Deploy (first time)
netlify deploy --prod

# Follow the prompts:
# - Create & configure a new site
# - Team: Select your team
# - Site name: unsugar-blog (or choose your own)
# - Publish directory: dist
```

Your site will be live at: `https://unsugar-blog.netlify.app`

---

### Option 2: Netlify Drag & Drop (Easiest)

1. **Build your app locally:**
   ```bash
   cd /Users/kshitijshah/Desktop/Workspaces/unsugar-io
   npm run build
   ```

2. **Go to [app.netlify.com](https://app.netlify.com)**
   - Sign up or log in
   - Drag and drop the `dist` folder to Netlify

3. **Configure environment variables:**
   - Site settings → Environment variables
   - Add: `VITE_API_BASE_URL` = `http://localhost:3001` (temporary)

4. **Get your URL**: `https://[random-name].netlify.app`

---

### Option 3: Netlify GitHub Integration (Automatic)

1. **Push your code to GitHub:**
   ```bash
   cd /Users/kshitijshah/Desktop/Workspaces/unsugar-io
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/kshitijshah95/unsugar-io.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to [app.netlify.com](https://app.netlify.com)
   - "Add new site" → "Import an existing project"
   - Choose GitHub → Select `unsugar-io` repository

3. **Build settings (auto-detected):**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

4. **Configure environment variables:**
   - Site settings → Environment variables
   - Add: `VITE_API_BASE_URL` = your backend URL (after backend deployment)

---

## Full Deployment Workflow (Both Apps)

### Step 1: Deploy Backend First

Follow the backend deployment guide at:
`/Users/kshitijshah/Desktop/Workspaces/unsugar-api/DEPLOYMENT.md`

**Recommended**: Use Render.com (free tier)

You'll get a URL like: `https://unsugar-api.onrender.com`

### Step 2: Update Frontend Environment Variable

Create/update `.env.production`:
```bash
cd /Users/kshitijshah/Desktop/Workspaces/unsugar-io
echo "VITE_API_BASE_URL=https://your-api-url.onrender.com" > .env.production
```

### Step 3: Deploy Frontend

Use any of the options above. If using Netlify:

```bash
npm run build
netlify deploy --prod
```

### Step 4: Update Backend CORS

Update your backend environment variable on Render/Railway:
```
CORS_ORIGIN=https://unsugar-blog.netlify.app
```

Then redeploy the backend.

---

## Alternative Platforms

### Vercel
```bash
npm install -g vercel
cd /Users/kshitijshah/Desktop/Workspaces/unsugar-io
vercel --prod
```

### Cloudflare Pages
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect GitHub repository
3. Build command: `npm run build`
4. Output directory: `dist`

---

## Troubleshooting

### Build Fails
- Check Node version: `node -v` (should be 18+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Try build locally: `npm run build`

### API Not Working
- Check CORS settings on backend
- Verify environment variable: `VITE_API_BASE_URL`
- Check browser console for errors

### Environment Variables Not Working
- Vite requires `VITE_` prefix for client-side variables
- Redeploy after changing environment variables
- For Netlify: Site settings → Environment variables → Redeploy

---

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured correctly
- [ ] CORS updated with frontend URL
- [ ] Test all API endpoints from frontend
- [ ] Check browser console for errors
- [ ] Test on mobile devices

---

## URLs to Share

After deployment, you'll have:
- **Frontend**: `https://unsugar-blog.netlify.app`
- **Backend**: `https://unsugar-api.onrender.com`
- **API Health**: `https://unsugar-api.onrender.com/health`

Share the frontend URL with users!
