# JobHunter — Full-Stack Job Board with Firebase Auth

A polished, full-featured job board built with React, Redux Toolkit, and Firebase — featuring real authentication (email/password + Google), live job listings stored in Firestore, a job posting system, saved jobs, and a user profile dashboard, all wrapped in a professional Material UI + Tailwind CSS interface.

> **Live demo:** _add your deployed Vercel URL here_
> **Repo:** _add your GitHub URL here_

---

## What is this project?

JobHunter is a production-grade job board application that goes well beyond a static UI mockup. It uses **Firebase Authentication** for real user sign-in (including Google OAuth), **Firestore** as a live NoSQL database for storing and retrieving job listings, and **Redux Toolkit** for managing global state across the entire app — auth state, job listings, filters, and saved jobs.

It was built as a portfolio project to demonstrate:
- Real authentication flow (sign up, log in, Google OAuth, protected routes)
- Live database integration (Firestore read/write/delete operations)
- Redux Toolkit state management across multiple slices (auth, jobs, saved)
- Multi-page React application with React Router v7
- Professional UI with Material UI v9 + Tailwind CSS v4
- Component architecture, code organization, and separation of concerns

## Why build this?

Most beginner React projects use local state only and never touch a real backend. JobHunter was intentionally scoped further — real auth, real database, real protected routes, and real CRUD operations — so it reads like a working product rather than a tutorial exercise. This is the pattern most real React codebases follow, and the combination of Redux + Firebase appears constantly in React job interviews.

## How it works (architecture overview)

1. **Auth listener:** On app load, `onAuthStateChanged` fires and syncs Firebase's auth state into Redux — so every component across the app can read `state.auth.user` without prop drilling.
2. **Job listings:** On homepage load, `JobsGrid` fetches all jobs from Firestore (ordered by creation date), merges them with mock seed data, and dispatches everything into `state.jobs.allJobs` via Redux.
3. **Search + filter:** User interactions (search input, filter pills) dispatch Redux actions (`setSearchQuery`, `setActiveFilter`, `applyFilters`) that derive `state.jobs.filteredJobs` from `allJobs` without re-fetching from Firestore.
4. **Posting a job:** Authenticated users fill out the Post a Job form. On submit, the job is written to Firestore, then `JobsGrid` re-fetches automatically on next mount — so the new job appears immediately and persists across refreshes.
5. **Saving jobs:** The heart button on any job card dispatches `addSavedJob` / `removeSavedJob` to Redux. The badge count in the navbar updates live via `state.saved.savedJobs.length`.
6. **Protected routes:** Pages like Post a Job, Saved Jobs, and Profile check `state.auth.user` via `useEffect` and redirect to `/login` if not authenticated — no dedicated `PrivateRoute` wrapper needed.
7. **Profile + delete:** The Profile page queries Firestore for jobs where `postedBy === user.uid`, displays them, and allows deletion (`deleteDoc`) which also removes the job from Redux state immediately.

## Tech stack, libraries & tools needed

| Tool / Library | Purpose | Version used |
|---|---|---|
| [Node.js](https://nodejs.org) | JavaScript runtime | v24.x (LTS) |
| [Vite](https://vitejs.dev) | Build tool (React template) | ^8.1.x |
| [React](https://react.dev) | UI library | ^19.2.x |
| [React Router DOM](https://reactrouter.com) | Multi-page client-side routing | ^7.18.x |
| [Redux Toolkit](https://redux-toolkit.js.org) | State management | ^2.12.x |
| [React Redux](https://react-redux.js.org) | React bindings for Redux | ^9.3.x |
| [Firebase](https://firebase.google.com) | Auth (email + Google) + Firestore database | ^12.x |
| [Material UI](https://mui.com) | Component library (AppBar, Drawer, Avatar, Menu, etc.) | ^9.2.x |
| [@mui/icons-material](https://mui.com/material-ui/material-icons/) | Icon set | ^9.2.x |
| [@emotion/react + @emotion/styled](https://emotion.sh) | MUI styling engine | ^11.14.x |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS for layout and spacing | ^4.3.x |
| [@tailwindcss/vite](https://tailwindcss.com/docs/installation/using-vite) | Vite plugin for Tailwind v4 | ^4.3.x |
| [Lucide React](https://lucide.dev) | Additional icon set | ^1.26.x |
| Google Fonts | Inter typeface | — |
| Git & GitHub | Version control | — |
| Vercel | Deployment/hosting | — |

## Firebase services used

| Service | Purpose |
|---|---|
| **Firebase Authentication** | Email/password sign-up and login, Google OAuth sign-in |
| **Firestore (NoSQL database)** | Storing job postings, querying by user, ordering by date |

No Firebase Storage, Functions, or Hosting is used — the app deploys to Vercel as a static site with Firestore as its only backend.

## How to run this project locally

**1. Prerequisites:**
```bash
node -v   # confirm Node v24.x or later
npm -v
git --version
```

**2. Clone and install:**
```bash
git clone https://github.com/<your-username>/jobhunter.git
cd jobhunter
npm install
```

**3. Firebase setup** (required):
- Go to [console.firebase.google.com](https://console.firebase.google.com)
- Create a new project, add a web app, and copy the `firebaseConfig` object
- Enable **Authentication** → Email/Password and Google providers
- Create a **Firestore database** in test mode

**4. Environment variables:**

Create a `.env` file in the project root:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**5. Firestore security rules:**

In Firebase Console → Firestore → Rules, set:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /jobs/{jobId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**6. Run the dev server:**
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

**7. Build for production:**
```bash
npm run build
```

## Project structure

```
src/
├── app/
│   └── store.js              # Redux store (auth + jobs + saved slices)
├── components/
│   ├── AuthLayout.jsx        # Shared two-panel layout for Login/Signup
│   ├── FilterBar.jsx         # Sticky filter pills + sort + job count
│   ├── Footer.jsx            # Dark footer with links and social icons
│   ├── Hero.jsx              # Homepage hero with search + stats
│   ├── JobCard.jsx           # Reusable job card (grid + saved jobs)
│   ├── JobsGrid.jsx          # Grid with Firestore fetch + load more
│   └── Navbar.jsx            # Sticky navbar + mobile drawer
├── data/
│   └── mockJobs.js           # 12 seed job listings
├── features/
│   ├── auth/authSlice.js     # User state (user, loading)
│   ├── jobs/jobsSlice.js     # Jobs state (all, filtered, search, filter)
│   └── saved/savedSlice.js   # Saved jobs array
├── firebase/
│   └── config.js             # Firebase app init + auth + db exports
├── pages/
│   ├── Home.jsx              # Hero + FilterBar + JobsGrid
│   ├── JobDetail.jsx         # Full job page + apply + similar jobs
│   ├── Login.jsx             # Email/password + Google login
│   ├── PostJob.jsx           # Job posting form + live preview + Firestore write
│   ├── Profile.jsx           # User profile + posted jobs + delete
│   ├── SavedJobs.jsx         # Saved jobs grid
│   └── Signup.jsx            # Email/password + Google signup
└── App.jsx                   # Router + auth listener + layout wrapper
```

## End-to-end feature list

### Authentication
- Email and password sign-up with display name saved via `updateProfile`
- Email and password login
- Google OAuth sign-in via popup
- Persistent session — Firebase remembers the user across page refreshes
- Auto-logout from any page via the navbar avatar dropdown or profile page
- Auth state synced to Redux via `onAuthStateChanged` listener
- Human-readable error messages for all common auth failures (wrong password, already in use, too many attempts, etc.)

### Homepage
- Animated hero section with gradient headline and dot-grid background
- Unified search box (job title + location) with keyboard Enter support
- Popular search chips that auto-fill and trigger search
- Stats bar (50k+ jobs, 2k+ companies, 100k+ hired)
- Sticky filter bar with scrollable pills (All, Full-time, Part-time, Remote, Internship, Contract)
- Job count display and sort selector
- Job card grid: 3 columns desktop, 2 tablet, 1 mobile
- "Load More" button showing remaining count
- Empty state when no jobs match search/filter
- Real-time search and filter applied client-side via Redux

### Job cards
- Company avatar with brand color initial
- Job type chip with color-coded badge per type
- Location and salary row
- Skill tag chips (up to 3 shown)
- "NEW" badge on jobs posted within the last 24 hours
- Time-ago label (Just now, 3h ago, 2 days ago)
- Heart/save button — fills red when saved, redirects to login if not authenticated
- Hover: lifts with violet border glow + shadow
- Click anywhere on card navigates to job detail page

### Job detail page
- Full two-column layout (job info left, apply sidebar right)
- Company avatar, title, full meta row (location, salary, type, posted time)
- All skill tags displayed
- Save + Share buttons (Share copies URL to clipboard with snackbar)
- About this role section with full description
- Requirements as checkmark list
- Skills and technologies chips
- Apply card (sticky on desktop) with structured meta breakdown
- Apply Now button — turns green with "✓ Applied!" state on click
- About the company card with industry, size, location
- Similar jobs sidebar (same type, up to 3)
- Snackbar notifications for save, apply, share actions
- Mobile: columns stack, apply card on top

### Post a Job (authenticated)
- Redirects to login if not authenticated
- Real-time live preview card updates as you type
- Fields: title, company, job type (dropdown), location, salary, description, requirements, tags
- Tags input — type and press Enter or click Add, remove with × chip
- Max 6 tags enforced
- Validation: required fields, description minimum 50 characters
- Writes to Firestore on submit
- Tips sidebar with best practices
- Success alert with "View Jobs" link after posting
- Newly posted job appears at top of grid on next homepage load and persists across refreshes

### Saved Jobs (authenticated)
- Redirects to login if not authenticated
- Grid of all saved job cards (same component as homepage)
- Saved count displayed in header
- Empty state with Browse Jobs CTA when no saved jobs

### Profile (authenticated)
- Redirects to login if not authenticated
- Large avatar (Google photo or initials fallback)
- Display name, email, member since date
- Stats cards: saved jobs count, posted jobs count
- Quick action buttons: Post a Job, View Saved Jobs, Logout
- Posted jobs list fetched from Firestore (filtered by current user's UID)
- Each posted job shows title, company, location, salary, type, tags
- Delete button removes job from Firestore and Redux instantly
- Loading spinner while fetching posted jobs

### Navigation
- Sticky navbar with backdrop blur effect
- Desktop: logo, nav links with active underline, right-side action buttons
- Logged-in state: heart icon with saved count badge, Post a Job outlined button, avatar dropdown
- Logged-out state: Login text button, Sign Up contained button
- Avatar dropdown: Profile, Saved Jobs, divider, Logout (in red)
- Mobile: hamburger icon opens right-side drawer with all nav items
- Drawer: all links + auth buttons, logged-in or logged-out variants

### Footer
- Dark background (`#0F0A27`) with violet gradient top accent line
- Logo + tagline + social icon buttons (X, LinkedIn)
- Three link columns: Quick Links, For Job Seekers, For Employers
- Bottom bar: copyright left, Privacy Policy + Terms of Service right
- Fully responsive (4 columns → 2 → 1)
- Sticks to bottom of short pages via flex layout

---

## Known limitations

- Saved jobs are stored in Redux memory only — they reset on page refresh (a future improvement would sync them to Firestore per user).
- Job applications are simulated (button state only) — no real application tracking or notification system.
- The "Companies" nav link is a placeholder — a full companies directory page was out of scope for this version.
- Mock job listings are seeded client-side and always appear alongside real Firestore jobs.

## License

This project is open for personal/portfolio use.
