# React-Blog

A full-stack blog platform built with React + Vite on the frontend and Node.js + Express + MongoDB on the backend.

This project supports:
- User authentication (signup/login/logout with JWT)
- Admin authentication (separate admin login/signup flow)
- Blog creation with rich text editor and image upload
- Draft and publish workflow
- Like, comment, and unique view tracking
- AI-assisted blog description generation (Gemini)

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Run Commands](#run-commands)
- [API Reference](#api-reference)
- [Authentication Notes](#authentication-notes)
- [Known Limitations](#known-limitations)
- [Roadmap Ideas](#roadmap-ideas)

## Project Overview

`React-Blog` is a MERN-style blogging app where authenticated users can create and manage blog posts, while admins have a separate authentication flow and dashboard.

The backend exposes REST APIs under `/api/v1`, and the frontend consumes those APIs using Axios with Redux Toolkit for state management.

## Tech Stack

### Frontend
- React 19
- Vite 7
- React Router DOM 7
- Redux Toolkit + React Redux
- Tailwind CSS 4
- React Hook Form
- TinyMCE Editor
- Axios
- React Toastify
- Lucide React icons

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- bcrypt
- Zod
- Multer (memory storage for uploads)
- ImageKit (image hosting/transformations)
- Nodemailer (SMTP)
- Google GenAI SDK (`@google/genai`) for AI description generation

## Architecture

- `frontend` (React app) handles UI, routing, state, and API requests.
- `backend` (Express app) handles auth, blog CRUD, category management, comments, likes, views, and AI content generation.
- JWT tokens are passed via `Authorization: Bearer <token>`.
- Backend router mounts:
  - `/api/v1/user`
  - `/api/v1/blog` (protected by user auth middleware)
  - `/api/v1/admin`

## Folder Structure

```text
React-Blog/
|-- backend/
|   |-- api/v1/
|   |   |-- authroute.js
|   |   |-- blogroute.js
|   |   |-- adminRoute.js
|   |   `-- index.js
|   |-- config/
|   |   |-- db.js
|   |   |-- GeminiAI.js
|   |   |-- multer.js
|   |   `-- nodemailer.js
|   |-- middleware/
|   |   |-- isLoggedin.js
|   |   `-- isAdminLoggedin.js
|   |-- Schema/
|   |   |-- UserSchema.js
|   |   |-- PostSchema.js
|   |   |-- CommentSchema.js
|   |   |-- BlogCategorySchema.js
|   |   `-- AdminSchema.js
|   |-- utils/
|   |   `-- imagekit.js
|   `-- index.js
|
`-- frontend/
    |-- src/
    |   |-- pages/
    |   |-- components/
    |   |-- features/
    |   |-- hooks/
    |   |-- api/
    |   `-- app/
    |-- vite.config.js
    `-- package.json
```

## Features

### User Features
- Register and login with JWT-based auth
- Fetch current logged-in user
- Email verification flow endpoints (`sendVerifyEmail`, `verifyOtp`)
- Browse all published blogs
- Filter blogs by category and search by title
- Pagination on blog listing page
- Create blog with:
  - Featured image upload
  - Rich text content (TinyMCE)
  - Category selection
  - Publish or save as draft
- Edit and delete own blog posts
- Publish drafts from "My Blogs"
- Like/unlike blogs
- Add comments and like/unlike comments
- Track unique views per user
- Generate blog description using Gemini AI with daily credit logic

### Admin Features
- Separate admin signup/login
- Protected admin profile endpoint
- Admin dashboard with current admin details

## Environment Variables

Create `.env` files in both `backend` and `frontend`.

### `backend/.env`

```env
DATABASE_URL=mongodb://127.0.0.1:27017/react_blog
JWT_SECRET=your_super_secret_key

SENDER_EMAIL=your_email@gmail.com
GOOGLE_PASS=your_app_password

GEMINI_API_KEY=your_gemini_api_key

IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key
IMAGE_KIT_URL_END_POINT=https://ik.imagekit.io/your_id

FRONTEND_URL=http://localhost:5173
```

### `frontend/.env`

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_TINY_MCE_KEY=your_tinymce_api_key
```

## Getting Started

### Prerequisites
- Node.js 18+ (recommended)
- npm
- MongoDB (local or cloud)
- ImageKit account (for image uploads)
- Gemini API key (for AI description)
- TinyMCE API key (for editor)

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 3. Run Backend

```bash
cd ../backend
npm run dev
```

Backend runs on `http://localhost:3000`.

### 4. Run Frontend

```bash
cd ../frontend
npm run dev
```

Frontend runs on `http://localhost:5173` (default Vite port).

## Run Commands

### Backend (`backend/package.json`)
- `npm run dev` - starts backend with nodemon
- `npm test` - placeholder script

### Frontend (`frontend/package.json`)
- `npm run dev` - starts Vite development server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## API Reference

Base URL: `http://localhost:3000/api/v1`

### User Auth (`/user`)

- `POST /user/register` - register user
- `POST /user/login` - login user
- `GET /user/getCurrentUser` - get current user (auth required)
- `GET /user/sendVerifyEmail` - send OTP for verification (auth required)
- `POST /user/verifyOtp` - verify OTP (auth required)
- `GET /user/logout` - logout response endpoint (auth required)

### Blog (`/blog`) - User Auth Required

- `GET /blog` - get all published blogs
- `GET /blog/getuserblog` - get blogs by current user
- `GET /blog/getEditBlog/:id` - get single blog for edit form
- `POST /blog/post-blog` - create blog (`multipart/form-data`, includes image)
- `PUT /blog/edit/:id` - edit blog (`multipart/form-data`, image optional)
- `DELETE /blog/delete/:id` - delete blog
- `PATCH /blog/drafttopublish` - publish a draft (`{ id }`)
- `GET /blog/getblogbyid/:id` - get blog details with comments and author
- `PATCH /blog/likepost` - toggle blog like (`{ blogId }`)
- `PATCH /blog/postviewed` - add unique view (`{ blogId }`)
- `POST /blog/addcomment` - add comment (`{ blogId, comment }`)
- `PATCH /blog/comment/like` - toggle comment like (`{ blogId, commentId }`)
- `POST /blog/post-category` - create category (`{ category }`)
- `GET /blog/get-category` - list categories
- `POST /blog/generateAiDescription` - generate AI description (`{ title }`)

### Admin (`/admin`)

- `POST /admin/signup` - register admin
- `POST /admin/login` - login admin
- `GET /admin/getCurrentAdmin` - get current admin (admin auth required)
- `GET /admin/profile` - protected profile route (admin auth required)
- `POST /admin/logout` - logout response endpoint (admin auth required)

## Authentication Notes

- User token key in `localStorage`: `Token`
- Admin token key in `localStorage`: `AdminToken`
- Both frontend and backend use `Authorization: Bearer <token>` format.
- User and admin auth flows are separated with different Redux slices and routes.