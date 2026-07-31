# The Corkboard — a job portal with AI-drafted postings

A full-stack job portal built as a "digital corkboard": job listings look like
pinned index cards, employers can auto-draft postings with Gemini AI, and there
are three separate experiences — job seekers, employers, and admins.

**Stack:** React (Vite) + Node/Express + MongoDB Atlas + Google Gemini API

---

## 1. What's inside

```
job-portal/
├── backend/          Node/Express API
│   ├── models/        User, Job, Application (Mongoose)
│   ├── routes/        auth, jobs, applications, ai, admin
│   ├── middleware/     JWT auth + role guards
│   ├── createAdmin.js  one-time script to create your admin account
│   └── server.js
└── frontend/          React app (Vite)
    └── src/
        ├── pages/       Home, Jobs, JobDetail, Login, Register,
        │                 SeekerDashboard, EmployerDashboard, PostJob, AdminDashboard
        ├── components/  Navbar, Footer, JobCard, ProtectedRoute, Loader
        ├── context/     AuthContext (login state)
        └── styles/      index.css — the "Corkboard" design system
```

### Unique features
- **AI Job Description Generator** — on the "Pin a New Job" page, an employer
  types a title + a few keywords + picks a tone, and Gemini drafts the full
  posting (About the role / What you'll do / What we're looking for). It's
  fully editable before publishing.
- **Corkboard visual identity** — listings render as pinned, slightly tilted
  index cards with a torn paper edge and a push-pin (red = urgent, navy =
  regular), instead of a generic card grid.
- **Three real dashboards** — job seekers track applications and status
  (Submitted → Reviewed → Shortlisted → Rejected/Hired), employers manage
  postings and applicants inline, admins get board-wide stats and moderation
  (deactivate users, flag/remove listings).

---

## 2. Set up MongoDB Atlas (you said you already have this)

1. In Atlas, go to your cluster → **Connect** → **Drivers** → copy the
   connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
2. Add a database name to it, e.g. `.../corkboard?retryWrites=true...`
3. In Atlas → **Network Access**, make sure your current IP (or `0.0.0.0/0`
   for testing) is allowed, or the backend won't be able to connect.

## 3. Set up your Gemini API key (you said you already have this)

Keep it handy — you'll paste it into `backend/.env` in the next section.

---

## 4. Open the project in VS Code

1. Download the zip below and **extract it** somewhere on your computer.
2. Open **VS Code** → `File` → `Open Folder…` → select the extracted
   `job-portal` folder (the one containing both `backend/` and `frontend/`).
3. Open a terminal in VS Code: `Terminal` → `New Terminal`.

You need **Node.js 18+** installed. Check with:
```bash
node -v
```
If that fails, install Node.js from https://nodejs.org first.

### 4a. Backend setup

```bash
cd backend
npm install
```

Now create your real environment file:
```bash
cp .env.example .env      # on Windows: copy .env.example .env
```
Open the new `backend/.env` in VS Code and fill in:
```
MONGO_URI=<your Atlas connection string>
JWT_SECRET=<any long random string, e.g. mash your keyboard>
GEMINI_API_KEY=<your Gemini API key>
PORT=5000
CLIENT_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
```
You should see `MongoDB connected: ...` and `Server running on port 5000`.
Leave this terminal running.

Create your admin account (open a **second** terminal, still inside `backend/`):
```bash
node createAdmin.js "Your Name" "you@example.com" "yourPassword123"
```
You'll log in with this email/password later and see the Admin Desk.

### 4b. Frontend setup

Open a **new terminal** (`Terminal` → `New Terminal`) so the backend keeps running:
```bash
cd frontend
npm install
cp .env.example .env      # on Windows: copy .env.example .env
npm run dev
```
Vite will print a local URL, usually `http://localhost:5173`. Open that in
your browser — the site should load with the backend already connected.

### 4c. Try it out
- Register as an **employer**, go to **My Postings → Pin a New Job**, fill
  in a title + keywords, click **Generate Description**, edit if you like,
  and post it.
- Register a second account as a **job seeker** (use a different browser or
  an incognito window) and apply to that job.
- Log in with the admin account you created to see stats and moderation.

---

## 5. Push it to GitHub

Still in VS Code's terminal, from the **root** `job-portal` folder (not
inside backend or frontend):

```bash
git init
git add .
git commit -m "Initial commit: The Corkboard job portal"
```

The `.gitignore` files already in `backend/` and `frontend/` make sure
`node_modules/` and your real `.env` files (with your secrets) are never
committed — only `.env.example` is.

Create a new **empty** repository on GitHub (no README/gitignore) at
https://github.com/new, then:

```bash
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

If prompted, sign in with your GitHub credentials (or a personal access
token if password auth is disabled).

**Double-check before pushing:** run `git status` — you should NOT see
`backend/.env` or `frontend/.env` listed. If you do see them, stop and tell
me before pushing, since that would expose your Mongo string and Gemini key.

---

## 6. Deploying (optional, later)

This README covers local setup + GitHub. When you're ready to put it online
(e.g. backend on Render/Railway, frontend on Vercel/Netlify), come back and
I'll walk you through it — the same `.env` variables get set in whichever
host's dashboard instead of a local file.
