# 🦋 Twin Angels International Development — E-Commerce Platform

Zimbabwe's premier online marketplace for Building Materials, Fabric Rolls, Printing Machines, Office & House Furniture.

> **Inspired by Takealot · Built for Zimbabwe · Scales across Africa**

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Folder Structure](#-folder-structure)
4. [Getting Started (Local Dev)](#-getting-started-local-dev)
5. [Environment Variables](#-environment-variables)
6. [Database Setup](#-database-setup)
7. [Deployment Guide](#-deployment-guide)
8. [Admin Panel](#-admin-panel)
9. [Warehouse & Dispatch TVs](#-warehouse--dispatch-tv-dashboards)
10. [WhatsApp Notifications](#-whatsapp-notifications)
11. [Payment Methods](#-payment-methods)
12. [URL Reference](#-url-reference)
13. [Roadmap](#-roadmap)

---

## 🏢 Project Overview

### What It Does
- Full online ordering system with mobile-responsive design
- Product management across 5 categories with FIFO warehouse processing
- Multi-currency support (USD & ZiG)
- Offline payment confirmation with manual admin verification
- WhatsApp automated notifications at every order milestone
- Dedicated TV dashboards for Warehouse and Dispatch operations
- Delivery zone management with auto fee calculation
- Admin panel for full site management

### Who Uses It
| Role | Access |
|------|--------|
| **Customers** | Browse, order, track, WhatsApp support |
| **Admin / IT Support** | Full site + order + content management |
| **Warehouse Staff** | TV dashboard at `/warehouse` |
| **Dispatch Staff** | TV dashboard at `/dispatch` |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | TailwindCSS + Google Fonts |
| State | Zustand (cart + currency) |
| Backend | Next.js API Routes (Node.js) |
| Database | PostgreSQL |
| Auth | JWT + bcrypt (httpOnly cookies) |
| Hosting | Vercel (frontend) + Render or Railway (DB) |
| Images | Cloudinary |
| Notifications | WhatsApp Business API |
| Payments | EcoCash · OneMoney · InnBucks · Bank Transfer · Visa/Mastercard |

---

## 📁 Folder Structure

```
twin-angels/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Homepage
│   │   ├── products/           # Product listing + detail
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout + success
│   │   ├── track/              # Order tracking
│   │   ├── admin/              # Admin panel
│   │   │   ├── page.tsx        # Admin dashboard
│   │   │   ├── orders/         # Order management
│   │   │   ├── products/       # Product & stock management
│   │   │   ├── banners/        # Homepage banner control
│   │   │   ├── promotions/     # Discount codes
│   │   │   ├── delivery/       # Delivery zone fees
│   │   │   ├── payments/       # Offline payment verification
│   │   │   ├── drivers/        # Driver & vehicle management
│   │   │   └── settings/       # Site settings, colors, social links
│   │   ├── warehouse/          # Warehouse TV dashboard
│   │   ├── dispatch/           # Dispatch TV dashboard
│   │   └── api/                # REST API endpoints
│   │       ├── auth/           # Login / logout
│   │       ├── orders/         # Order CRUD + tracking
│   │       ├── products/       # Product CRUD
│   │       └── warehouse/      # Warehouse order feed
│   ├── components/
│   │   ├── layout/             # Navbar, Footer, StoreLayout
│   │   ├── home/               # HeroBanner, etc.
│   │   └── ui/                 # ProductCard, etc.
│   ├── lib/
│   │   ├── db.ts               # PostgreSQL connection pool
│   │   ├── auth.ts             # JWT + bcrypt utilities
│   │   ├── store.ts            # Zustand cart store
│   │   ├── whatsapp.ts         # WhatsApp notification helpers
│   │   └── constants.ts        # Zones, currencies, categories
│   └── styles/
│       └── globals.css         # TailwindCSS + global styles
├── scripts/
│   ├── migrate.sql             # Full database schema
│   ├── migrate.js              # Migration runner
│   └── seed.js                 # Sample product seeder
├── public/                     # Static assets
├── .env.example                # Environment variable template
├── vercel.json                 # Vercel deployment config
├── tailwind.config.js
├── next.config.js
└── package.json
```

---

## 🚀 Getting Started (Local Dev)

### Prerequisites
- Node.js 18+ ([download](https://nodejs.org))
- PostgreSQL 14+ ([download](https://postgresql.org) or use [Supabase](https://supabase.com))
- npm or yarn
- Git

### Step 1 — Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/twin-angels.git
cd twin-angels
npm install
```

### Step 2 — Environment Setup

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values (see [Environment Variables](#-environment-variables) below).

### Step 3 — Database Setup

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE twin_angels;"

# Run migrations (creates all tables + seeds default data)
npm run db:migrate

# Optional: add sample products for development
npm run db:seed
```

### Step 4 — Start Dev Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔑 Environment Variables

Copy `.env.example` to `.env.local` and fill in each value:

```bash
# Database (PostgreSQL connection string)
DATABASE_URL=postgresql://user:password@localhost:5432/twin_angels

# Auth (generate with: openssl rand -base64 32)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NEXTAUTH_SECRET=your_nextauth_secret_change_this
NEXTAUTH_URL=http://localhost:3000

# WhatsApp Business API
WHATSAPP_API_URL=https://your-whatsapp-provider.com
WHATSAPP_API_KEY=your_api_key
WHATSAPP_FROM_NUMBER=+263XXXXXXXXX

# Payments
PAYNOW_INTEGRATION_ID=your_paynow_id
PAYNOW_INTEGRATION_KEY=your_paynow_key
PAYNOW_RESULT_URL=https://yourdomain.com/api/payments/paynow/result
PAYNOW_RETURN_URL=https://yourdomain.com/checkout/success

# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=edsonnyoni92@gmail.com
SMTP_PASS=your_gmail_app_password

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Generating Secrets

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Max 256 }))
```

---

## 🗄 Database Setup

### Option A — Supabase (Recommended for Production)

1. Go to [supabase.com](https://supabase.com) → Create free project
2. Copy the **Connection String** from Settings → Database
3. Paste it as `DATABASE_URL` in `.env.local`
4. Run: `npm run db:migrate`

### Option B — Render.com Managed PostgreSQL

1. Go to [render.com](https://render.com) → New → PostgreSQL
2. Choose free tier for development, paid for production
3. Copy the **External Connection String**
4. Set as `DATABASE_URL` and run `npm run db:migrate`

### Option C — Railway.app

1. Go to [railway.app](https://railway.app) → New Project → PostgreSQL
2. Copy the connection URL from the Variables tab
3. Set as `DATABASE_URL` and run `npm run db:migrate`

### Option D — Local PostgreSQL

```bash
# Install PostgreSQL, then:
createdb twin_angels
export DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/twin_angels"
npm run db:migrate
npm run db:seed   # optional: sample data
```

---

## ☁️ Deployment Guide

### Deploy to Vercel (Frontend)

Vercel is the recommended host for Next.js. It's free to start.

#### Method 1 — Vercel Dashboard (Easiest)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Twin Angels e-commerce"
   git remote add origin https://github.com/edson152/Twin-Angels-International.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → Sign up with GitHub

3. Click **"Add New Project"** → Select your repository

4. **Add all environment variables** from your `.env.local` in the Vercel dashboard:
   - Go to Project → Settings → Environment Variables
   - Add each variable one by one

5. Click **Deploy** — Vercel auto-detects Next.js and builds it!

6. Your site will be live at `https://twin-angels.vercel.app` (or your custom domain)

#### Method 2 — Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

Follow the prompts to link your project and set environment variables.

#### Connecting a Custom Domain

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g. `twinangels.co.zw`)
3. Update your domain's DNS records as instructed by Vercel
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your domain

---

### Database on Render.com (Production)

1. [render.com](https://render.com) → New → PostgreSQL
2. Name: `twin-angels-db`
3. Region: Choose closest to Zimbabwe (Frankfurt is often best)
4. Copy the **External Database URL**
5. Paste into Vercel → Settings → Environment Variables as `DATABASE_URL`
6. Run migration against production:
   ```bash
   DATABASE_URL="your_render_connection_string" node scripts/migrate.js
   ```

---

### Full Production Checklist

Before going live, complete this checklist:

```
✅ Change default admin password (admin@twinangels.co.zw / Admin@2024)
✅ Set a strong JWT_SECRET (min 32 random characters)
✅ Configure your real WhatsApp Business API credentials
✅ Set up Paynow or EcoCash payment gateway keys
✅ Configure Cloudinary for product image uploads
✅ Set up SMTP email (Gmail App Password)
✅ Point your custom domain to Vercel
✅ Enable HTTPS (automatic on Vercel)
✅ Update NEXT_PUBLIC_APP_URL to your live domain
✅ Test a complete order flow end-to-end
✅ Test WhatsApp notifications
✅ Set correct USD to ZiG exchange rate in Admin → Settings
```

---

## 🖥 Admin Panel

Access the admin panel at: `/admin`

**Default credentials** (change immediately after first login!):
- Email: `admin@twinangels.co.zw`
- Password: `Admin@2024`

### Admin Features

| Page | Path | Description |
|------|------|-------------|
| Dashboard | `/admin` | Stats overview + recent orders |
| Orders | `/admin/orders` | View, filter, and process all orders |
| Products | `/admin/products` | Add/edit/delete products and stock |
| Banners | `/admin/banners` | Control homepage sliding banners |
| Promotions | `/admin/promotions` | Create and manage discount codes |
| Delivery | `/admin/delivery` | Manage zones and delivery fees |
| Payments | `/admin/payments` | Verify offline payment references |
| Drivers | `/admin/drivers` | Manage drivers and vehicles |
| Settings | `/admin/settings` | Colors, social links, exchange rate, footer |

---

## 📺 Warehouse & Dispatch TV Dashboards

These are dedicated full-screen URLs for department TVs. Share these links with your teams:

### Warehouse TV
**URL: `/warehouse`**

Features:
- Auto-refreshes every 30 seconds
- FIFO-ordered queue of active orders
- 🔴 Urgent orders float to the top with pulsing badge
- Color-coded by status: Queued → Picking → Ready
- Shows picker assignment
- Live clock and date

**How to display on warehouse TV:**
1. Open Chrome/Firefox on the TV computer
2. Navigate to `https://yourdomain.com/warehouse`
3. Press `F11` for full screen
4. The page auto-refreshes — no manual action needed

### Dispatch TV
**URL: `/dispatch`**

Features:
- Ready-for-dispatch queue grouped by delivery zone
- Driver assignment board with availability status
- Vehicle allocation tracking
- One-click "Mark Delivered" confirmation
- Driver WhatsApp quick-contact buttons

---

## 💬 WhatsApp Notifications

Customers receive automated WhatsApp messages at these milestones:

| Trigger | Message Content |
|---------|----------------|
| Order placed | Order number + total + next steps |
| Payment confirmed | Confirmation + order moving to warehouse |
| Order dispatched | Driver name + driver phone number |
| Out for delivery | Alert to be ready to receive |
| Delivered | Confirmation + support contact |
| Urgent notice | Custom urgent message |

### WhatsApp Provider Options

1. **[WA.chat](https://wa.chat)** — Simple API, pay-as-you-go
2. **[Twilio WhatsApp](https://twilio.com/whatsapp)** — Reliable, well-documented
3. **[360Dialog](https://360dialog.com)** — Official WhatsApp Business API partner
4. **Meta WhatsApp Business API** — Direct, requires business verification

Configure your provider in `.env.local`:
```
WHATSAPP_API_URL=https://your-provider.com
WHATSAPP_API_KEY=your_key
WHATSAPP_FROM_NUMBER=+263XXXXXXXXX
```

---

## 💳 Payment Methods

### Supported Methods

| Method | Type | Currency |
|--------|------|----------|
| EcoCash | Mobile money | USD + ZiG |
| OneMoney | Mobile money | USD + ZiG |
| InnBucks | Mobile money | USD + ZiG |
| Bank Transfer | Offline | USD + ZiG |
| Visa / Mastercard | Card | USD only |

### Offline Payment Flow

1. Customer places order → receives WhatsApp with payment instructions
2. Customer makes payment and submits their reference number
3. Admin goes to `/admin/payments` → verifies reference against their records
4. Admin clicks **"Verify Payment"** → order moves to processing → WhatsApp confirmation sent

### Paynow Integration (for online card payments)

Register at [paynow.co.zw](https://paynow.co.zw) and get your:
- Integration ID
- Integration Key

Add to `.env.local`:
```
PAYNOW_INTEGRATION_ID=your_id
PAYNOW_INTEGRATION_KEY=your_key
```

---

## 🔗 URL Reference

### Customer-Facing
| Page | URL |
|------|-----|
| Homepage | `/` |
| All Products | `/products` |
| Category | `/products?category=building-materials` |
| Product Detail | `/products/[slug]` |
| Search | `/products?search=cement` |
| Cart | `/cart` |
| Checkout | `/checkout` |
| Order Success | `/checkout/success?order=TA-00123` |
| Track Order | `/track` |

### Staff URLs
| Dashboard | URL |
|-----------|-----|
| Admin | `/admin` |
| Admin Orders | `/admin/orders` |
| Admin Products | `/admin/products` |
| Admin Banners | `/admin/banners` |
| Admin Promotions | `/admin/promotions` |
| Admin Delivery | `/admin/delivery` |
| Admin Payments | `/admin/payments` |
| Admin Drivers | `/admin/drivers` |
| Admin Settings | `/admin/settings` |
| **Warehouse TV** | `/warehouse` |
| **Dispatch TV** | `/dispatch` |

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Authenticate user |
| GET | `/api/products` | List products (filterable) |
| POST | `/api/products` | Create product (admin) |
| POST | `/api/orders` | Create new order |
| GET | `/api/orders` | List orders (admin) |
| GET | `/api/orders/[orderNumber]/track` | Track order status |
| GET | `/api/warehouse/orders` | Warehouse queue feed |

---

## 🗺 Delivery Zones & Fees

| Zone | USD Fee | ZiG Fee |
|------|---------|---------|
| Harare | $5 | ZiG 350 |
| Bulawayo | $15 | ZiG 1,050 |
| Mutare | $18 | ZiG 1,260 |
| Gweru | $12 | ZiG 840 |
| Masvingo | $20 | ZiG 1,400 |
| Custom Rural | $25 | ZiG 1,750 |

Fees are configurable in **Admin → Delivery Zones**. The exchange rate for ZiG auto-calculation is set in **Admin → Settings**.

---

## 🔮 Roadmap

Planned future features (Phase 2):

- [ ] Mobile apps (React Native for iOS + Android)
- [ ] Vendor/marketplace multi-seller support
- [ ] Fleet GPS tracking integration
- [ ] AI product recommendations engine
- [ ] Smart warehouse automation (barcode scanning)
- [ ] Customer analytics dashboard
- [ ] Loyalty points system
- [ ] Bulk order discounts
- [ ] REST API for third-party integrations
- [ ] Pan-African expansion (Zambia, Mozambique)

---

## 👤 Contact & Support

**Twin Angels International Development**
- Email: edsonnyoni92@gmail.com
- WhatsApp: +263XXXXXXXXX

---

## 📄 License

Private and proprietary. All rights reserved © Twin Angels International Development.
