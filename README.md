# KadamVivah — कदमविवाह

A **free, modern matrimony platform for the Marathi-speaking community**, built with React + Vite + Tailwind CSS. The app is fully functional today running on **mock data (localStorage)** — no backend required to run or demo it. It is structured so a real backend can be dropped in later behind a thin API layer.

> This free initiative is inspired by **Nitin Kadam**, a social worker based in Pune (Parvati area). See the "Behind the Initiative" section on the home page.

---

## ✨ Features

- **100% free** matrimony service — no fees, no subscriptions.
- **Bilingual UI** (English + Marathi) with a one-click language toggle (i18next).
- **Authentication** with role-based access (`user` / `admin`) — mock auth backed by localStorage.
- **Registration** that creates both an account and a matrimonial profile.
- **Profiles listing** with filters (gender, age, city, education) and pagination — protected (login required).
- **Profile detail** pages with full information and photo carousel support.
- **Admin dashboard** — create, edit and delete profiles.
- **Admin bulk import** — paste a JSON array of profiles to add them in bulk.
- **Change password** flow (also supports forced first-login change).
- **Responsive, mobile-first** design with a deep-red brand theme and Devanagari typography.

---

## 🧰 Tech Stack

| Area | Choice |
|------|--------|
| Framework | React 19 |
| Build tool | Vite 7 |
| Styling | Tailwind CSS 4 (+ shadcn-style UI primitives) |
| Routing | React Router 7 |
| i18n | i18next / react-i18next |
| HTTP client | Axios (ready for a real backend) |
| Dates | Day.js |
| Icons | lucide-react |

---

## 🚀 Quick Start

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev

# 3. Production build / preview
npm run build
npm run preview
```

That's it — the app seeds sample profiles and users into your browser's localStorage on first load.

---

## 🔐 Demo Accounts

The login page shows these and lets you auto-fill with one click:

| Role  | Email                    | Password   |
|-------|--------------------------|------------|
| Admin | `admin@kadamvivah.in`    | `admin123` |
| User  | `test@example.com`       | `test123`  |

> Tip: to reset the demo data, clear this site's localStorage in your browser and reload.

---

## 📁 Project Structure

```
kadamvivah/
├── index.html
├── vite.config.js
├── postcss.config.js
├── public/
│   └── images/              # hero + section imagery (see "Images" below)
├── src/
│   ├── main.jsx             # app entry; seeds mock data, inits i18n
│   ├── App.jsx              # routes
│   ├── i18n.js              # English/Marathi strings
│   ├── App.css / index.css  # Tailwind theme + globals
│   ├── components/
│   │   ├── Navbar.jsx  Footer.jsx  ProfileCard.jsx
│   │   ├── ProtectedRoute.jsx  Toast.jsx  LanguageToggle.jsx
│   │   └── ui/              # shadcn-style Button, Card, Input, Label, Textarea
│   ├── contexts/
│   │   └── AuthContext.jsx  # mock login/register/changePassword
│   ├── lib/
│   │   ├── api.js           # axios wrapper (documents the future API contract)
│   │   ├── initMockData.js  # seeds localStorage from src/data
│   │   └── utils.js         # cn() classname helper
│   ├── data/
│   │   ├── mock-profiles.json
│   │   └── mock-users.json
│   └── pages/
│       ├── Home.jsx  Login.jsx  Register.jsx  ChangePassword.jsx
│       ├── Profiles.jsx  ProfileDetail.jsx
│       ├── Admin.jsx  AdminImport.jsx
│       └── About.jsx  Contact.jsx  Privacy.jsx  Terms.jsx
```

---

## 🖼️ Images

Home-page imagery lives in `public/images/`:

- `hero-main.jpg`, `matrimony-2.jpg`, `matrimony-3.jpg` — Indian-wedding photos used in the hero.
- `nitin-kadam.jpg` — **optional**: drop a photo here to show it in the "Behind the Initiative" section. Until it exists, a tasteful initials avatar (नि.क) is shown automatically. Use only an image you have permission to publish.

---

## 🗄️ How the mock backend works

- On first load, `initMockData.js` copies `src/data/mock-profiles.json` and `mock-users.json` into localStorage.
- `AuthContext.jsx` implements `login`, `register` and `changePassword` against those localStorage collections (passwords are stripped from the user object exposed to the app).
- Pages read/write the `mockProfiles` / `mockUsers` localStorage keys directly.

### Connecting a real backend later

`src/lib/api.js` already documents the intended REST contract (`/auth/login`, `/auth/register`, `/profiles`, …) and attaches the auth token. To go live, replace the localStorage bodies in `AuthContext.jsx` and the pages with the corresponding `api.*` calls, and set `VITE_API_URL` in a `.env` file.

---

## 📜 Available Scripts

| Script            | Description                       |
|-------------------|-----------------------------------|
| `npm run dev`     | Start the Vite dev server         |
| `npm run build`   | Production build to `dist/`        |
| `npm run preview` | Preview the production build       |

---

## 📄 License

ISC. Built for and gifted to the Marathi community — free, always.
