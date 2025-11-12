# KadamVivah - Maratha Matrimony Website

A free, modern matrimonial platform for the Maratha-speaking community. Built with React, Vite, and Tailwind CSS.

## 🌟 Features

- **100% Free Service** - No registration or subscription fees
- **Authentication System** - Secure login and registration with role-based access
- **Profile Management** - Comprehensive matrimonial profiles with photos
- **Advanced Filtering** - Filter profiles by gender, age, city, education, and more
- **Admin Dashboard** - Full CRUD operations for profile management (admin only)
- **Responsive Design** - Mobile-first, accessible UI with Tailwind CSS
- **Bilingual Interface** - Maratha and English content throughout
- **Protected Routes** - Profiles visible only to authenticated users

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm installed
- Modern web browser

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
pnpm run build

# Preview production build locally
pnpm run preview
```

## 📁 Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images and media files
│   ├── components/     # React components
│   │   ├── ui/        # shadcn/ui components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProfileCard.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Toast.jsx
│   ├── contexts/       # React contexts
│   │   └── AuthContext.jsx
│   ├── data/          # Mock data (JSON)
│   │   ├── mock-profiles.json
│   │   └── mock-users.json
│   ├── lib/           # Utilities and helpers
│   │   ├── api.js     # Axios API wrapper
│   │   └── initMockData.js
│   ├── pages/         # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profiles.jsx
│   │   ├── ProfileDetail.jsx
│   │   ├── Admin.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Privacy.jsx
│   │   └── Terms.jsx
│   ├── App.jsx        # Main app with routing
│   ├── App.css        # Global styles and design tokens
│   ├── main.jsx       # Entry point
│   └── index.css      # Base CSS
├── package.json
└── vite.config.js
```

## 🎨 Design System

### Colors

- **Primary**: Deep Red (`#C8102E`) - Brand color for CTAs and accents
- **Background**: Off-white (`#FCFCFC`) - Clean, minimal background
- **Muted**: Light gray - Secondary backgrounds and borders
- **Foreground**: Dark gray - Primary text color

### Typography

- **Primary Font**: Inter (sans-serif)
- **Devanagari Font**: Noto Sans Devanagari
- **Font Sizes**: Responsive scale from 0.875rem to 3rem

### Spacing

- Consistent spacing scale using Tailwind's default spacing (4px base unit)
- Container max-width: 1280px (7xl)

## 🔐 Authentication

### Mock Authentication (Development)

The app uses localStorage-based mock authentication for development:

**Default Test Accounts:**

- **Admin Account**
  - Email: `admin@kadamvivah.in`
  - Password: `admin123`
  - Role: admin (can access admin dashboard)

- **User Account**
  - Email: `test@example.com`
  - Password: `test123`
  - Role: user

**Creating New Accounts:**
- Use the registration form to create new accounts
- All new accounts have 'user' role by default

### Integrating Real Authentication

To replace mock auth with a real backend:

1. **Update Environment Variables**
   
   Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

2. **Backend API Requirements**

   Your backend should implement these endpoints:

   **Auth Endpoints:**
   ```
   POST /api/auth/register
   Body: { firstName, lastName, email, password, ...profileData }
   Response: { token: "jwt-token", user: { id, email, firstName, lastName, role } }

   POST /api/auth/login
   Body: { email, password }
   Response: { token: "jwt-token", user: { id, email, firstName, lastName, role } }
   ```

   **Profile Endpoints:**
   ```
   GET /api/profiles?gender=&city=&page=1&limit=12
   Response: { profiles: [...], total: 100, page: 1, totalPages: 9 }

   GET /api/profiles/:id
   Response: { profile: {...} }

   POST /api/profiles (admin only)
   Body: { ...profileData }
   Response: { profile: {...} }

   PUT /api/profiles/:id (admin only)
   Body: { ...profileData }
   Response: { profile: {...} }

   DELETE /api/profiles/:id (admin only)
   Response: { success: true }
   ```

3. **Update AuthContext**

   In `src/contexts/AuthContext.jsx`, replace mock implementations:
   
   ```javascript
   // Replace this:
   const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
   
   // With actual API call:
   const response = await api.post('/auth/login', { email, password });
   const { token, user } = response.data;
   ```

4. **Update Profile Pages**

   In `src/pages/Profiles.jsx` and `src/pages/ProfileDetail.jsx`, uncomment the actual API calls:
   
   ```javascript
   // Uncomment this:
   const response = await api.get('/profiles', { params: filters });
   ```

5. **Remove Mock Data Initialization**

   In `src/main.jsx`, remove or comment out:
   ```javascript
   // initMockData();
   ```

## 📊 Mock Data

The application includes sample profiles in `src/data/mock-profiles.json`:

- 6 sample profiles with diverse backgrounds
- Realistic Maratha names and locations
- Various education levels and occupations
- Family details and bios

To add more mock profiles, edit `mock-profiles.json` following the existing structure.

## 🛠️ Excel Import Script (Placeholder)

A placeholder script for importing profiles from Excel is provided:

**Location:** `tools/importExcelToMongo.js`

**Usage:**
```bash
# Install dependencies
npm install xlsx mongodb

# Run import script
node tools/importExcelToMongo.js path/to/profiles.xlsx
```

**Excel Column Mapping:**
- Column A: First Name → firstName
- Column B: Last Name → lastName
- Column C: Email → email
- Column D: Phone → phone
- Column E: DOB (YYYY-MM-DD) → dob
- Column F: Gender → gender
- Column G: City → city
- Column H: State → state
- Column I: Pincode → pincode
- Column J: Caste → caste
- Column K: Education → education
- Column L: Occupation → occupation

## 🔒 Access Control

### Public Pages
- Home
- About
- Contact
- Privacy Policy
- Terms of Service
- Login
- Register

### Protected Pages (Require Login)
- Profiles listing
- Profile detail view

### Admin-Only Pages
- Admin dashboard
- Add/Edit/Delete profiles

## 🌐 Deployment

### Environment Variables

For production deployment, set:

```env
VITE_API_URL=https://api.kadamvivah.in/api
```

### Deployment Platforms

**Vercel (Recommended):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Netlify:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**Build Output:**
- Build directory: `dist`
- Build command: `pnpm run build`

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Screen reader friendly

## 🧪 Testing

### Manual Testing Checklist

- [ ] Register new account
- [ ] Login with credentials
- [ ] View profiles (should be blocked when logged out)
- [ ] Filter profiles by gender, city, education
- [ ] View profile details
- [ ] Admin login and access admin dashboard
- [ ] Add/edit/delete profile (admin only)
- [ ] Test responsive layout on mobile
- [ ] Test all navigation links

## 📝 Integration Checklist

When connecting to a real backend:

- [ ] Set up backend API with required endpoints
- [ ] Configure VITE_API_URL in .env
- [ ] Update AuthContext with real API calls
- [ ] Update Profiles page with real API calls
- [ ] Update Admin page with real API calls
- [ ] Implement image upload to cloud storage
- [ ] Set up email notifications (optional)
- [ ] Configure CORS on backend
- [ ] Test authentication flow end-to-end
- [ ] Test profile CRUD operations
- [ ] Deploy frontend and backend

## 🤝 Contributing

This is a community service project. Contributions are welcome!

## 📄 License

This project is open source and available for community use.

## 🙏 Acknowledgments

Special thanks to **Nitin Kadam**, a dedicated social worker based in Pune, for his inspiration and community service in the Parvati area.

---

**Contact:** contact@kadamvivah.in

**Website:** kadamvivah.in
