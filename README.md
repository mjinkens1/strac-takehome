# Strac Takehome

A modern Next.js application with Google OAuth + Google Drive integration. Users can sign in, view their Drive files, and upload, download, or delete documents — all from a dark UI loosely inspired by Google Drive.

---

## 📄 Overview

This is a modern file manager built with Next.js and TailwindCSS that integrates with Google Drive. Users can:

- Authenticate via Google
- Browse their Drive files (excluding folders)
- Upload, download, and delete documents
- View upload/download progress indicators
- Includes a responsive UX with optimistic updates and toast notifications for clarity

---

## 🔐 Google OAuth Setup

### 1. Create a Google Cloud Project

Go to the [Google Cloud Console](https://console.cloud.google.com/) and:

- Click the project dropdown in the top nav.
- Click **New Project** and give it a name.
- Click **Create**.

---

### 2. Create OAuth Credentials

- Navigate to: **APIs & Services → Credentials**
- Click **+ Create Credentials → OAuth client ID**
- Choose:
  - **Application type**: Web
  - **Name**: Strac Takehome (or whatever)
- Under **Authorized JavaScript origins**, add:
  ```
  http://localhost:3000
  ```
- Under **Authorized redirect URIs**, add:
  ```
  http://localhost:3000/api/auth/callback/google
  ```
- Click **Create**
- Copy your **Client ID** and **Client Secret**

---

### 3. Enable the Google Drive API

- Go to [Google API Library](https://console.cloud.google.com/apis/library)
- Search for **Google Drive API**
- Click it → Click **Enable**

---

## 🛠️ .env.local Setup

Create a `.env.local` file in the root of the project:

```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
NEXTAUTH_SECRET=any-random-string
NEXTAUTH_URL=http://localhost:3000
```

> ✅ `NEXTAUTH_SECRET` can be generated via `openssl rand -base64 32`

---

## 🚀 Running the App

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and sign in with Google to view your Drive files.

---

## 🧺 Running Tests

This project includes both unit and integration tests using **Jest** and **React Testing Library**.

```bash
npm run test
```

To run tests in watch mode:

```bash
npm run test:watch
```

---

## ⚙️ Design Decisions

- Built using **Next.js App Router** for modern server/client code separation.
- Authentication handled by **NextAuth.js** with Google OAuth.
- **Google Drive API v3** integrated directly via the official `googleapis` SDK.
- Used **Radix UI (Headless UI)** for accessible tooltip components.
- Files are sorted by **last modified date** (both frontend and backend).
- Upload and delete actions implement **optimistic updates** for a smoother experience.
- Upload/download feedback uses **spinners and checkmarks** with toast notifications.
- UI is **dark mode only**, styled with **TailwindCSS** and CSS variables.

---

## 📌 Assumptions

- Users will only upload **non-folder files**, excluding raw binary blobs.
- Download progress requires a known `content-length` — some files may not provide this.
- Upload progress is not streamed from Google Drive due to SDK limitations.

---

## 💻 NPM Scripts

| Script  | Description                   |
| ------- | ----------------------------- |
| `dev`   | Starts the development server |
| `build` | Builds the production app     |
| `start` | Runs the app in production    |
| `test`  | Runs all tests                |

---

## ✍️ Notes

- Code is commented where logic may be non-obvious (e.g., optimistic updates, fallbacks).
- Component design follows SOLID principles and React best practices.

---

## 🤝 Author

Built by Matt Jinkens as part of the Strac Takehome Assignment.
