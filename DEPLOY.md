# Twin Angels — Deployment Guide

## ✅ Prerequisites
- GitHub account (free): https://github.com
- Vercel account (free): https://vercel.com

---

## 🚀 Deploy to Vercel (FREE — Step by Step)

### Step 1 — Push to GitHub
```bash
# In your project folder (E:\twin-angels)
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2 — Connect to Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"**
3. Find and select **Twin-Angels-International** from your repos
4. Click **Import**

### Step 3 — Configure Build Settings
Vercel auto-detects Next.js — leave all settings as default:
- Framework Preset: **Next.js** (auto)
- Build Command: `npm run build` (auto)
- Output Directory: `.next` (auto)
- Install Command: `npm install` (auto)

### Step 4 — Environment Variables
Click **"Environment Variables"** and add:
```
NEXT_PUBLIC_APP_URL = https://your-project.vercel.app
```
(You can update this after you get your domain)

### Step 5 — Deploy!
Click **"Deploy"** — Vercel builds and deploys in ~2 minutes.

Your site will be live at: `https://twin-angels-international.vercel.app`

---

## 🔁 Auto-Deploy on Push
After setup, every `git push` to `main` automatically redeploys — no manual steps.

---

## 🌐 Custom Domain (Optional)
1. In Vercel dashboard → your project → **Settings** → **Domains**
2. Add your domain e.g. `twinangels.co.zw`
3. Update your domain's DNS to point to Vercel (they show you exactly what to add)

---

## ⚠️ Important Note About Orders
Currently orders are stored in **server memory** (resets on redeploy). 
For permanent order storage, you'll need a database.

**Free database options:**
- **Neon** (PostgreSQL, free tier): https://neon.tech
- **PlanetScale** (MySQL, free tier): https://planetscale.com
- **Supabase** (PostgreSQL, free tier): https://supabase.com

Contact your developer to connect a database when ready.

---

## 📱 After Deploy — Update Settings
1. Go to `https://your-site.vercel.app/admin`
2. Click **Site Settings & Logo**
3. Update your WhatsApp number, social links, and logo
