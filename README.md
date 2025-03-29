# Strac Takehome

A modern Next.js application with Google OAuth + Google Drive integration. This README covers how to set up OAuth, enable APIs, configure `.env` variables, and run the app locally.

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
