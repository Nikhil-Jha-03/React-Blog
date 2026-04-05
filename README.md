# React-Blog

Full-stack blog platform built with React + Vite (frontend) and Node.js + Express + MongoDB (backend).

## Project Status

This project is now complete for the current scope:
- User auth + blog publishing workflow
- Admin auth + admin dashboard
- Admin blog/user management
- Admin-only featured blog control (max 3)
- Featured blogs shown on home page

## Features

### User Features
- Register, login, logout with JWT auth
- Create, edit, publish, and delete own blogs
- Save drafts and publish later
- Browse blogs, filter by category, and search by title
- Like/unlike blogs
- Comment and like/unlike comments
- Unique view tracking
- AI-generated blog description (credit-limited flow)

### Admin Features
- Separate admin signup/login
- View all blogs and all signed-up users
- Delete any blog
- Delete any user (with related cleanup)
- Mark/unmark blogs as featured
- Enforced max of 3 featured blogs

### Home Page Feature Flow
- Featured blogs are fetched from `GET /api/v1/blog/featured`
- Only published + featured blogs are returned
- Backend limits result to maximum 3 blogs

## Tech Stack

### Frontend
- React 19
- Vite 7
- React Router DOM 7
- Redux Toolkit + React Redux
- Tailwind CSS 4
- React Hook Form
- TinyMCE
- Axios
- React Toastify

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- bcrypt
- Zod
- Multer
- ImageKit
- Nodemailer
- Gemini SDK (`@google/genai`)

## Architecture

Backend routes under `/api/v1`:
- `/user` -> user auth routes
- `/blog` -> mixed routes:
  - public: featured blogs (`/blog/featured`)
  - user-protected: blog CRUD/interaction routes
- `/admin` -> admin auth + admin management routes

Auth headers:
- `Authorization: Bearer <token>`

Local storage keys:
- User token: `Token`
- Admin token: `AdminToken`

## Folder Structure

```text
React-Blog/
|-- backend/
|   |-- api/v1/
|   |   |-- authroute.js
|   |   |-- blogroute.js
|   |   |-- adminRoute.js
|   |   |-- publicBlogRoute.js
|   |   `-- index.js
|   |-- config/
|   |-- middleware/
|   |-- Schema/
|   |-- utils/
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

## Environment Variables

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

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Run backend

```bash
cd ../backend
npm run dev
```

### 3. Run frontend

```bash
cd ../frontend
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:3000`

## API Reference

Base URL: `http://localhost:3000/api/v1`

### User Auth (`/user`)
- `POST /user/register`
- `POST /user/login`
- `GET /user/getCurrentUser` (auth)
- `GET /user/sendVerifyEmail` (auth)
- `POST /user/verifyOtp` (auth)
- `GET /user/logout` (auth)

### Blog Public (`/blog`)
- `GET /blog/featured` (public, max 3)

### Blog User-Protected (`/blog`)
- `GET /blog`
- `GET /blog/getuserblog`
- `GET /blog/getEditBlog/:id`
- `POST /blog/post-blog`
- `PUT /blog/edit/:id`
- `DELETE /blog/delete/:id`
- `PATCH /blog/drafttopublish`
- `GET /blog/getblogbyid/:id`
- `PATCH /blog/likepost`
- `PATCH /blog/postviewed`
- `POST /blog/addcomment`
- `PATCH /blog/comment/like`
- `POST /blog/post-category`
- `GET /blog/get-category`
- `POST /blog/generateAiDescription`

### Admin (`/admin`)
- `POST /admin/signup`
- `POST /admin/login`
- `GET /admin/getCurrentAdmin` (admin auth)
- `GET /admin/profile` (admin auth)
- `POST /admin/logout` (admin auth)
- `GET /admin/blogs` (admin auth)
- `GET /admin/users` (admin auth)
- `DELETE /admin/blogs/:id` (admin auth)
- `DELETE /admin/users/:id` (admin auth)
- `PATCH /admin/blogs/:id/feature` (admin auth)

## Featured Blog Rules

- Only admin can change `feature` status.
- A maximum of 3 featured blogs is allowed.
- Only published blogs can be featured.
- User edit endpoint ignores any incoming `feature` field.

## Scripts

### Backend
- `npm run dev`

### Frontend
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
