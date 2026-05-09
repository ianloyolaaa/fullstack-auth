# Loyola, Ian Francis M.
# Angular 21 Auth Boilerplate (Beginner Guide)

This project is a beginner-friendly Angular 21 boilerplate that demonstrates a complete authentication flow:

- Email sign up + email verification
- Login + logout
- JWT auth header for API requests
- Refresh tokens (cookie-based) + auto-refresh before access token expiry
- Forgot password + reset password
- Role-based authorization (User & Admin)
- Admin area for account management
- Profile area for viewing/updating your own account

## Table of contents

1. Prerequisites
2. Run the app (real API)
3. Run the app (fake backend, no API)
4. Using the app (what to click)
5. How authentication works
6. Authorization (roles + route guards)
7. Project structure (quick tour)
8. Troubleshooting

## 1) Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node.js)
- (Optional) Angular CLI:
  npm i -g @angular/cli

## 2) Run the app (real API)

- Default API: http://localhost:4000

Step 1: install packages
npm install

Step 2: start backend API

Step 3: start Angular
npm start

## 3) Run the app (fake backend, no API)

Enable fake backend in app.module.ts:

providers: [
  { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] },
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  fakeBackendProvider
]

Then:
npm install
npm start

## 4) Using the app

A) Create account  
B) Login  
C) Forgot password  
D) Profile/Admin areas  

## 5) How authentication works

- Uses JWT access token
- Refresh token stored in cookie
- Auto refresh before expiration

## 6) Authorization

- Protected by AuthGuard
- Admin routes require Role.Admin

## 7) Project structure

- _services/
- _helpers/
- _models/
- account/
- profile/
- admin/

##  Troubleshooting

- Ensure API URL is correct
- Check CORS if backend is separate
