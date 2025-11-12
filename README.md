# KadamVivah - Marathi Matrimony Platform

A free, modern matrimonial platform for the Marathi-speaking community. This project includes both a React frontend and a Node.js/Express backend, designed for production readiness.

## 🌟 Features

The KadamVivah platform offers a comprehensive set of features across both its frontend client and backend server, designed to provide a robust and user-friendly matrimonial experience.

### Frontend (Client)

The client-side application is built with React, Vite, and Tailwind CSS, focusing on accessibility and a mobile-first approach. It provides a **100% free service** with no registration or subscription fees. Key features include a secure **authentication system** with role-based access, allowing users to manage their profiles. The platform offers **comprehensive matrimonial profiles** with photo support and **advanced filtering** capabilities, enabling users to search for profiles based on criteria such as gender, age, city, and education. The **responsive design** ensures optimal viewing across various devices. A **bilingual interface** supports both Marathi and English, with an integrated language toggle for seamless switching. To maintain privacy, **protected routes** ensure that profiles are only visible to authenticated users. Additionally, an **Admin Import UI** provides a dedicated interface for administrators to upload, preview, and import Excel files containing profile data.

### Backend (Server)

Developed using Node.js and Express, the backend server provides the core logic and data management for the KadamVivah platform. It features **JWT authentication** for secure user access and **role-based access control** to differentiate between `user` and `admin` privileges. The **Profile Management API** supports full CRUD (Create, Read, Update, Delete) operations for profiles, accessible only to administrators. A powerful **Excel Import API** facilitates robust bulk profile import and upsert operations, handling both new entries and updates to existing profiles. This import functionality includes **dynamic column mapping**, allowing for configurable mapping between Excel headers and profile fields, and **import logging** to track the status and results of each import operation. All data is managed through **MongoDB Integration**, utilizing Mongoose for object data modeling to ensure data consistency and integrity.

## 🚀 Quick Start

### Prerequisites

To set up and run the KadamVivah platform, ensure you have Node.js version 18 or higher installed, along with a package manager like npm or pnpm. A MongoDB instance, either locally hosted or a cloud-based solution like MongoDB Atlas, is also required for data storage. Finally, a modern web browser is needed to access the frontend application.

### 1. Backend Setup

Navigate to the `server/` directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `server/` directory based on `.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/kadamvivah # Replace with your MongoDB connection string
JWT_SECRET=your_very_secure_random_secret_key_here # Generate a strong, random secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173 # Frontend URL for CORS
MAX_FILE_SIZE=10485760 # Max file size for Excel upload (10MB)
```

**Important:** Replace `MONGO_URI` and `JWT_SECRET` with your actual values. For `MONGO_URI`, it is highly recommended to use MongoDB Atlas for production (see [Database Hosting Guidance](#-database-hosting-guidance)).

**Seed Admin User (Optional, for initial setup/testing):**

To create an admin user for testing the admin dashboard and import functionality, run:

```bash
npm run seed:admin
```

This will create an admin user with email `admin@kadamvivah.in` and password `admin123`. You can customize these by setting `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_FIRST_NAME`, `ADMIN_LAST_NAME` environment variables before running the script.

Start the backend development server:

```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`.

### 2. Frontend Setup

Navigate to the `client/` directory:

```bash
cd ../client
```

Install dependencies:

```bash
pnpm install
```

Create a `.env.local` file in the `client/` directory based on `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api # Must match your backend API URL
```

Start the frontend development server:

```bash
pnpm run dev
```

The frontend application will be available at `http://localhost:5173`.

### Build for Production

To create an optimized production build for the frontend:

```bash
cd client
pnpm run build
```

The build output will be in the `dist/` directory.

## 📁 Project Structure

```
kadamvivah/
├── client/              # React Frontend
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── assets/     # Images and media files
│   │   ├── components/ # React components (Navbar, Footer, LanguageToggle, etc.)
│   │   ├── contexts/   # AuthContext
│   │   ├── data/       # Mock data (mock-profiles.json, mock-users.json, mock-excel-sample.xlsx)
│   │   ├── lib/        # API wrapper, mock data initializer
│   │   ├── pages/      # Page components (Home, Login, Register, Profiles, Admin, AdminImport, etc.)
│   │   ├── i18n.js     # i18next configuration and translations
│   │   ├── App.jsx     # Main app with routing
│   │   ├── App.css     # Global styles and design tokens
│   │   ├── main.jsx    # Entry point
│   │   └── index.css   # Base CSS
│   ├── .env.example    # Client environment variables example
│   ├── package.json
│   └── vite.config.js
├── server/              # Node.js/Express Backend
│   ├── config/          # Database connection
│   │   └── db.js
│   ├── controllers/     # Business logic for routes
│   │   └── importController.js
│   ├── middleware/      # Authentication and authorization middleware
│   │   ├── auth.js
│   │   └── requireAdmin.js
│   ├── models/          # Mongoose schemas
│   │   ├── User.js
│   │   ├── Profile.js
│   │   └── ImportLog.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   ├── profiles.js
│   │   └── admin.js
│   ├── scripts/         # Utility scripts
│   │   └── seedAdmin.js
│   ├── utils/           # Helper utilities
│   │   └── excelMapper.js
│   ├── .env.example     # Server environment variables example
│   ├── package.json
│   └── server.js        # Main server entry point
├── README.md            # This file
└── PROJECT_SUMMARY.md   # Project overview
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

### Frontend Mock Authentication (Development)

The frontend uses localStorage-based mock authentication for development when `VITE_API_URL` is not set or the backend is not running. This allows testing the UI independently.

**Default Test Accounts:**

- **Admin Account**
  - Email: `admin@kadamvivah.in`
  - Password: `admin123`
  - Role: `admin` (can access admin dashboard and import features)

- **User Account**
  - Email: `test@example.com`
  - Password: `test123`
  - Role: `user`

**Creating New Accounts:**
- Use the registration form to create new accounts. All new accounts have the `user` role by default.

### Backend Authentication (Production)

The backend implements JWT-based authentication. Upon successful login, a JWT token is issued, which must be included in the `Authorization` header (`Bearer <token>`) for all protected routes.

**Auth Endpoints:**
- `POST /api/auth/register`: Register a new user and create a profile.
  - Body: `{ firstName, lastName, email, phone, password, dob, gender, city, state, pincode, caste, education, occupation, ... }`
  - Response: `{ token, user: { id, email, firstName, lastName, role } }`
- `POST /api/auth/login`: Authenticate user and return JWT token.
  - Body: `{ email, password }`
  - Response: `{ token, user: { id, email, firstName, lastName, role } }`

### Integrating Real Authentication (Frontend)

To switch from mock authentication to the real backend:

1.  **Configure `VITE_API_URL`**: Ensure `client/.env.local` has `VITE_API_URL` pointing to your running backend (e.g., `http://localhost:5000/api` or your deployed API URL).
2.  **Update `AuthContext`**: In `client/src/contexts/AuthContext.jsx`, replace mock login/register logic with actual `api.post` calls to `/api/auth/login` and `/api/auth/register`.
3.  **Update Profile Pages**: In `client/src/pages/Profiles.jsx` and `client/src/pages/ProfileDetail.jsx`, uncomment the actual `api.get` calls to `/api/profiles`.
4.  **Remove Mock Data Initialization**: In `client/src/main.jsx`, remove or comment out `initMockData();`.

## 📊 Excel Import Functionality

Admins can import profiles in bulk using Excel files via the `/admin/import` page.

### Backend API Endpoints

-   `POST /api/admin/import-excel` (Admin Only)
    -   **Description**: Uploads an Excel file (`.xlsx` or `.xls`) to import or update matrimonial profiles.
    -   **Headers**: `Authorization: Bearer <admin_jwt_token>`, `Content-Type: multipart/form-data`
    -   **Body**: `file` (multipart form data) - the Excel file.
    -   **Query Parameters**:
        -   `preview=true`: (Optional) Parses the file and returns a report without saving to the database.
        -   `mapping={JSON}`: (Optional) Custom JSON object to override default column mapping. See `server/utils/excelMapper.js` for structure.
        -   `sheetName=string`: (Optional) Name of the sheet to import (defaults to the first sheet).
    -   **Response**: JSON object with import statistics (inserted, updated, skipped, errors) and detailed row-level diagnostics.
-   `GET /api/admin/import-mapping` (Admin Only)
    -   **Description**: Retrieves the default column mapping used by the Excel importer.
    -   **Response**: `{ success: true, mapping: { ... } }`
-   `GET /api/admin/import-history` (Admin Only)
    -   **Description**: Retrieves a paginated list of past import operations.
    -   **Query Parameters**: `page`, `limit`
    -   **Response**: `{ success: true, imports: [...], pagination: { ... } }`

### Excel Column Mapping

The `server/utils/excelMapper.js` file defines a default mapping from common Excel column headers to `Profile` model fields. This mapping is flexible and case-insensitive. You can customize this mapping by providing a JSON object in the `mapping` query parameter during upload.

**Default Mapping Example (Partial):**

| Profile Field | Possible Excel Headers (Case-Insensitive)                                     |
| :------------ | :---------------------------------------------------------------------------- |
| `firstName`   | `first name`, `firstname`, `first`, `name`                                    |
| `lastName`    | `last name`, `lastname`, `last`, `surname`                                    |
| `email`       | `email`, `e-mail`, `mail`                                                     |
| `phone`       | `phone`, `mobile`, `contact`, `contact no`, `phone number`, `mobile number` |
| `dob`         | `dob`, `date of birth`, `birth date`, `dateofbirth`                         |
| `gender`      | `gender`, `sex`                                                               |
| `city`        | `city`, `town`                                                                |
| `education`   | `education`, `qualification`, `degree`                                        |
| `occupation`  | `occupation`, `profession`, `job`, `work`                                     |
| `bio`         | `bio`, `about`, `description`, `details`                                      |

**Customizing Mapping:**
If your Excel file uses different headers, you can provide a custom mapping JSON. For example, if your Excel has a column named `Candidate Email` for email, your custom mapping would be:

```json
{
  "email": ["candidate email", "email"]
}
```

### Excel Import Behavior

-   Accepts `.xlsx` or `.xls` files via `multipart/form-data`.
-   Parses the first sheet by default, or a specified `sheetName`.
-   **Upsert Logic**: For each row, it attempts to find an existing profile by:
    1.  `email`
    2.  `phone`
    3.  Combination of `firstName`, `lastName`, and `dob`
    If a match is found, the existing profile is updated; otherwise, a new profile is created.
-   **Validation**: Performs server-side validation for required fields, age (>=18 years), email format, and phone number format. Row-level errors are collected.
-   **Import Report**: Returns a detailed JSON report with counts of inserted, updated, skipped, and errored rows, along with messages for each processed row.

### Sample Excel File

A sample Excel file, `client/src/data/mock-excel-sample.xlsx`, is provided for testing the import functionality. It includes valid data, data for updates, and rows designed to trigger validation errors.

## 🌐 Language Switching (i18n)

The frontend supports bilingual content in English and Marathi. A language toggle is available in the Navbar to switch between languages. The selected language preference is persisted in `localStorage`.

-   **Configuration**: `client/src/i18n.js` defines translation resources and i18next setup.
-   **Usage**: The `useTranslation` hook from `react-i18next` is used across components to fetch translated strings.
-   **Dynamic Content**: The `Profile` model supports `bio_en` and `bio_mr` fields for bilingual bios. The frontend will display the appropriate language based on the current selection.

## 🔒 Access Control

### Public Pages
-   Home
-   About
-   Contact
-   Privacy Policy
-   Terms of Service
-   Login
-   Register

### Protected Pages (Require Login)
-   Profiles listing
-   Profile detail view

### Admin-Only Pages
-   Admin dashboard (`/admin`)
-   Admin Import (`/admin/import`)
-   Profile CRUD operations via API

## ☁️ Deployment

### Environment Variables

For production deployment, ensure your `.env` (server) and `.env.local` (client) files are correctly configured:

**Client (`client/.env.local`):**

```env
VITE_API_URL=https://api.yourdomain.com/api # Your deployed backend API URL
```

**Server (`server/.env`):**

```env
PORT=80
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection_string # From MongoDB Atlas
JWT_SECRET=your_very_secure_random_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=https://www.yourdomain.com # Your deployed frontend URL for CORS
MAX_FILE_SIZE=10485760
# CLOUDINARY_CLOUD_NAME=your_cloud_name # Optional, for image uploads
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
```

### Deployment Platforms

For the **Frontend (Client)**, static site hosting platforms such as Vercel or Netlify are highly recommended due to their ease of use and optimization for React applications. To deploy with Vercel, you can install their CLI globally (`npm i -g vercel`) and then simply run `vercel` from your project directory. Similarly, for Netlify, install the CLI (`npm i -g netlify-cli`) and use `netlify deploy --prod`.

For the **Backend (Server)**, a Platform as a Service (PaaS) solution like Render, Heroku, or Railway is advisable. These platforms are specifically designed for deploying web services, offering features such as easy deployment, automatic scaling, and robust environment variable management, which are crucial for a Node.js/Express application.

### 🗄️ Database Hosting Guidance (Hostinger Premium)

**It is crucial to understand that Hostinger Premium shared web hosting is generally NOT suitable for hosting a production MongoDB database or long-running Node.js/Express backend processes reliably.** Shared hosting environments are optimized for static websites or PHP applications and lack the dedicated resources and flexibility required for a robust Node.js application with a database.

Here are the recommended options:

1.  **Use MongoDB Atlas (Recommended)**:
    -   **What it is**: MongoDB Atlas is a fully managed cloud database service by MongoDB. It offers a generous free tier that is sufficient for many small to medium-sized projects.
    -   **Why it's recommended**: It's managed, secure, scalable, and globally accessible. You don't have to worry about database administration.
    -   **Steps**: 
        1.  Create an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
        2.  Set up a free tier cluster.
        3.  Obtain your connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/kadamvivah?retryWrites=true&w=majority`).
        4.  Configure this string as your `MONGO_URI` in the `server/.env` file.
        5.  Set up IP Whitelisting in Atlas to allow connections from your backend server's IP address (or `0.0.0.0/0` for development/testing, but restrict in production).
        6.  Host your frontend on Hostinger Premium (as a static site) and your backend on a separate PaaS (like Render, Heroku, Railway) or a Hostinger VPS/Cloud plan.

2.  **Hostinger VPS or Cloud Plan (If you prefer Hostinger)**:
    -   **What it is**: These plans provide a virtual private server or cloud resources, giving you full control over the environment.
    -   **Why it's an option**: You can install MongoDB and Node.js directly on your VPS/Cloud server.
    -   **Considerations**: Requires more technical expertise for server setup, maintenance, and security compared to managed services.

3.  **Alternative PaaS for Backend + MongoDB Atlas**: 
    -   Host your Node.js/Express backend on a modern PaaS (e.g., [Render](https://render.com/), [Heroku](https://www.heroku.com/), [Railway](https://railway.app/)). These platforms are designed for deploying web services and often integrate well with MongoDB Atlas.
    -   This is often the easiest path to production for Node.js applications.

**In summary, for Hostinger Premium shared hosting, you should only host the static frontend files. For the backend and database, use MongoDB Atlas combined with a suitable backend hosting solution (PaaS or VPS).**

## 🧪 Testing

#### Manual Testing Checklist

To ensure the application functions correctly, a comprehensive manual testing checklist is provided. Begin by registering a new user account through the frontend and then log in with both this new user and the seeded admin user (`admin@kadamvivah.in` / `admin123`). Verify that profiles are only visible to logged-in users and test the profile filtering functionality by gender, city, and education. Navigate to various profile detail pages to confirm correct information display. As an administrator, access the Admin dashboard (`/admin`) and the Admin Import page (`/admin/import`). On the Admin Import page, upload the provided sample Excel file (`client/src/data/mock-excel-sample.xlsx`). Utilize the "Preview" button to review the import report without committing changes to the database, then proceed with the "Upload & Import" button to commit the profiles. After import, verify the results, including inserted, updated, skipped, and errored records, and confirm that newly imported or updated profiles appear correctly in the main Profiles listing. Additionally, test the language switching functionality between English and Marathi, verify all navigation links and static pages (About, Contact, Privacy, Terms), and ensure the responsive layout functions correctly across various screen sizes..

## 📱 Browser Support

-   Chrome/Edge (latest)
-   Firefox (latest)
-   Safari (latest)
-   Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility

-   Semantic HTML structure
-   ARIA labels on interactive elements
-   Keyboard navigation support
-   Color contrast compliance (WCAG AA)
-   Screen reader friendly

## 🤝 Contributing

This is a community service project. Contributions are welcome!

## 📄 License

This project is open source and available for community use.

## 🙏 Acknowledgments

Special thanks to **Nitin Kadam**, a dedicated social worker based in Pune, for his inspiration and community service in the Parvati area.

---

**Contact:** contact@kadamvivah.in

**Website:** kadamvivah.in

