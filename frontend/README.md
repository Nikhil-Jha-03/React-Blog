# React-Blog Frontend

Frontend app for `React-Blog`, built with React + Vite.

## Run

```bash
npm install
npm run dev
```

Dev server: `http://localhost:5173`

## Build

```bash
npm run build
npm run preview
```

## Notes

- Uses `VITE_BACKEND_URL` for API base URL.
- Uses Redux Toolkit for auth/blog/admin state.
- Admin dashboard supports:
  - Managing all blogs
  - Managing all users
  - Feature/unfeature blogs (max 3, backend enforced)
