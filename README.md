# Bhada Rider App

Mobile-first rider-facing frontend for the Bhada parcel delivery platform.

## Features

- **Phone OTP Login** — Firebase phone authentication
- **Dashboard** — Real-time availability toggle (Online / Offline / Break) + performance stats
- **Orders** — View available orders, accept them, confirm pickup with OTP, deliver with OTP, cancel with reason
- **Routes & Areas** — Register routes and delivery areas you cover
- **Profile & Onboarding** — Step-by-step onboarding: profile → vehicle → KYC → submit application

## Setup

```bash
npm install
cp .env.example .env    # fill in your values
npm run dev
```

App runs on http://localhost:3001

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   └── Layout.jsx          # Bottom nav + top bar
├── context/
│   └── AuthContext.jsx     # Auth state management
├── pages/
│   ├── LoginPage.jsx       # Phone OTP login (2 steps)
│   ├── DashboardPage.jsx   # Home: status toggle + metrics
│   ├── OrdersPage.jsx      # Available & in-progress orders
│   ├── RoutesAreasPage.jsx # Routes and delivery areas
│   └── ProfilePage.jsx     # Profile, onboarding steps, KYC
├── services/
│   ├── api.js              # All API calls (axios)
│   └── firebase.js         # Firebase phone auth
├── App.jsx
├── main.jsx
└── index.css
```

## API

Connects to the Bhada REST API v2.2.0. Set `VITE_API_URL` in `.env`.

The rider logs in via `POST /auth/verify-firebase` (no admin password needed, unlike the admin app).

## Design

Dark theme matching the admin app aesthetic — `#05080f` base, `#00e5a0` accent (teal instead of yellow), mobile-first layout with bottom navigation.
