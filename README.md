# MEET. Portfolio Platform

A modern creative portfolio platform built with Next.js 16, TailwindCSS v4, Framer Motion, and dual storage support:
- MongoDB for production and Vercel deployments
- `data.json` local fallback for quick offline development

## Features
- Cinematic premium UI with glassmorphism and dark luxury aesthetic.
- GSAP/Framer Motion powered before/after transformation sliders.
- Full Admin CMS to manage portfolio items, transformations, and site text.
- Cloudinary integration for seamless media upload.
- JWT secured authentication.

## Setup Instructions

1. **Environment Variables**
   Copy `.env.example` to `.env.local` and fill in your credentials.
   ```bash
   cp .env.example .env.local
   ```
   You will need:
   - A MongoDB connection string for production or Vercel deployments.
   - A Cloudinary account for production media uploads.
   - A secure JWT secret string.
   - Admin username and password values.

2. **Installation**
   ```bash
   npm install
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Authentication**
   Admin login is controlled by environment variables:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`

5. **Storage Behavior**
   - If `MONGODB_URI` is set, content reads and admin edits use MongoDB.
   - If `MONGODB_URI` is missing, the app falls back to `data.json` for local development.
   - On Vercel, configure Cloudinary for uploads. Local filesystem upload fallback is disabled in production.

## Vercel Deployment

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. In the environment variables section on Vercel, add all the variables from your `.env.local`.
4. Make sure `MONGODB_URI` and Cloudinary variables are set before using the admin CMS in production.
5. Click Deploy. Vercel will automatically detect Next.js and build it.
