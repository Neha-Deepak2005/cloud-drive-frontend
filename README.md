# CloudDrive — Frontend (React + Vite + Tailwind)

The web UI for the CloudDrive file storage & sharing service — a Google-Drive-style app: folders, drag-and-drop upload, sharing, public links, search, starred files and trash.

Live app: `<ADD_YOUR_VERCEL_URL_HERE>`
Backend repo: `<ADD_LINK_TO_BACKEND_REPO_HERE>`

## Tech stack

React 19 · Vite · Tailwind CSS · React Router · TanStack (React) Query · Axios · React Dropzone

## Features

- Email/password + Google sign-in
- Sidebar layout: My Drive, Shared with me, Starred, Trash
- Folder navigation with breadcrumbs, nested folder creation
- Drag-and-drop upload with a live progress bar (works from anywhere in the current folder)
- Grid/list view toggle, sort by name/date/size
- Per-item menu: rename, move (folder picker), share, star, download, delete
- Share modal: invite by email with Viewer/Editor role, or create a public link with optional expiry and password
- Public link landing page (`/share/:token`) for recipients who don't have an account
- Search, Trash with restore/permanent-delete/empty-trash

## Running locally

Requires Node 18+.

```bash
npm install
cp .env.example .env      # VITE_API_URL should point at your backend, default http://localhost:8000
npm run dev
```

Opens at `http://localhost:5173`. Make sure the backend is running and its `FRONTEND_URL` env var matches this origin (CORS).

## Building for production

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Deploying (Vercel)

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com): New Project → import this repo. Framework preset: Vite (auto-detected).
3. Set the environment variable `VITE_API_URL` to your deployed backend's URL (e.g. `https://your-backend.onrender.com`).
4. Deploy.

After deploying, update the backend's `FRONTEND_URL` env var (on Render) to this Vercel URL and redeploy the backend, so CORS and the refresh-token cookie work correctly.

## Project structure

```
src/
├── main.jsx / App.jsx     # routes, providers (React Query, Auth)
├── components/            # Sidebar, Topbar, FileExplorer, modals, ProtectedRoute...
├── pages/                 # Login, Signup, Drive, Shared, Starred, Trash, Search, PublicShare
├── services/               api.js (axios + auth refresh interceptor), drive.js (all API calls)
├── hooks/                  useAuth (auth context), useInvalidateDrive
└── utils/                   formatting helpers
```
