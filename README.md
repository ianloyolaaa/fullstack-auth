# Loyola, Ian Francis M. BSIT-3F
# Angular 21 Auth Boilerplate — Frontend

Full-featured authentication frontend built with **Angular 21**, connected to the **Node.js + TypeScript + MySQL** backend API.

---

## Features

- ✅ Email Sign Up & Verification
- ✅ JWT Login with silent refresh (auto-renews 1 min before expiry)
- ✅ Forgot Password & Reset Password
- ✅ Role-Based Access Control (Admin / User)
- ✅ Profile View & Update
- ✅ Admin Panel — manage all accounts (CRUD)
- ✅ Global alert system
- ✅ Auto-login on page reload (via refresh token cookie)
- ✅ Bootstrap 5 UI

---

## Project Structure

```
src/
├── app/
│   ├── _components/
│   │   └── alert.component.ts/.html     ← Global alert messages
│   ├── _helpers/
│   │   ├── app.initializer.ts           ← Auto-login on startup
│   │   ├── auth.guard.ts                ← Route protection
│   │   ├── jwt.interceptor.ts           ← Adds JWT to every request
│   │   ├── error.interceptor.ts         ← Handles 401/403 globally
│   │   └── must-match.validator.ts      ← Password confirmation validator
│   ├── _models/
│   │   ├── account.ts                   ← Account interface
│   │   ├── alert.ts                     ← Alert models
│   │   └── role.ts                      ← Role enum (Admin/User)
│   ├── _services/
│   │   ├── account.service.ts           ← All API calls to backend
│   │   └── alert.service.ts             ← Alert messaging bus
│   ├── account/                         ← Login, Register, Verify, Forgot/Reset Password
│   ├── admin/                           ← Admin panel + accounts CRUD (Admin only)
│   ├── home/                            ← Home dashboard
│   ├── profile/                         ← Profile details + update
│   ├── app.component.ts/.html           ← Root: navbar + router-outlet
│   ├── app.module.ts                    ← Root module
│   └── app-routing.module.ts            ← Top-level routes
├── environments/
│   ├── environment.ts                   ← Dev: apiUrl = http://localhost:4000
│   └── environment.prod.ts              ← Prod: apiUrl = your deployed backend
└── styles.css                           ← Global Bootstrap overrides
```

---

## Connecting to the Backend

### Step 1 — Start the Node.js backend

Make sure the backend (`node-mysql-api`) is running:

```bash
cd node-mysql-api
npm run start:dev
# Runs on http://localhost:4000
```

### Step 2 — Install Angular dependencies

```bash
cd angular-auth
npm install
```

### Step 3 — Run Angular dev server

```bash
npm start
# Runs on http://localhost:4200
# API calls proxied to http://localhost:4000 via proxy.conf.json
```

Open your browser at **http://localhost:4200**

---

## How the Connection Works

| Angular | → | Node.js Backend |
|---------|---|----------------|
| `AccountService.login()` | POST | `/accounts/authenticate` |
| `AccountService.register()` | POST | `/accounts/register` |
| `AccountService.verifyEmail()` | POST | `/accounts/verify-email` |
| `AccountService.forgotPassword()` | POST | `/accounts/forgot-password` |
| `AccountService.validateResetToken()` | POST | `/accounts/validate-reset-token` |
| `AccountService.resetPassword()` | POST | `/accounts/reset-password` |
| `AccountService.refreshToken()` | POST | `/accounts/refresh-token` |
| `AccountService.logout()` | POST | `/accounts/revoke-token` |
| `AccountService.getAll()` | GET | `/accounts` (Admin only) |
| `AccountService.getById(id)` | GET | `/accounts/:id` |
| `AccountService.create(params)` | POST | `/accounts` (Admin only) |
| `AccountService.update(id, params)` | PUT | `/accounts/:id` |
| `AccountService.delete(id)` | DELETE | `/accounts/:id` |

### JWT Flow
1. Login → backend returns `jwtToken` (15 min) + sets `refreshToken` HTTP-only cookie (7 days)
2. `JwtInterceptor` attaches `Authorization: Bearer <jwtToken>` to every request
3. Timer auto-refreshes the JWT **1 minute before** it expires (silent refresh)
4. On page reload, `appInitializer` calls `/accounts/refresh-token` using the cookie to restore the session

---

## Full End-to-End Test Flow

| Step | Action | Where |
|------|--------|-------|
| 1 | Go to `/account/register` | Register first account (becomes Admin) |
| 2 | Check Ethereal email inbox | Copy the verification token/link |
| 3 | Go to `/account/verify-email?token=TOKEN` | Verify the account |
| 4 | Go to `/account/login` | Log in |
| 5 | Home page shows name + role | Confirm Admin badge |
| 6 | Go to `/admin/accounts` | See all accounts (Admin only) |
| 7 | Go to `/profile/update` | Edit profile or change password |
| 8 | Go to `/account/forgot-password` | Test password reset flow |

---

## Changing the Backend URL

**Development** — edit `src/environments/environment.ts`:
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000'   // ← change this
};
```

**Production** — edit `src/environments/environment.prod.ts`:
```ts
export const environment = {
  production: true,
  apiUrl: 'https://your-backend.onrender.com'  // ← your deployed backend
};
```

---

## Production Build

```bash
npm run build:prod
# Output: dist/angular-auth-boilerplate/
# Deploy this folder to any static host (Netlify, Vercel, Render, etc.)
```

### Deploy to Render (Static Site)
- Build Command: `npm run build:prod`
- Publish Directory: `dist/angular-auth-boilerplate/browser`
- Set env var or edit `environment.prod.ts` with your backend URL

### CORS (Important for Production)
In the backend `config.json` or env vars, set `CORS_ORIGIN` to your Angular app's URL:
```
CORS_ORIGIN=https://your-angular-app.onrender.com
```
