# KadamVivah — PHP REST API (Backend Foundation)

This is the lightweight, zero-paid-dependency PHP backend for KadamVivah, optimized for **Hostinger Premium Web Hosting** (MySQL/MariaDB + PHP 8.x).

---

## 1. Directory Structure

```
api/
├── .htaccess                 # Apache rewrite rules for Hostinger
├── .env.example              # Environment variable template
├── config/
│   └── database.php          # PDO connection & environment loader
├── helpers/
│   └── response.php          # Unified JSON response helper
├── middleware/
│   └── cors.php              # CORS & Security headers
├── routes/
│   └── health.php            # GET /api/health endpoint
├── schema/
│   └── schema.sql            # MySQL table schemas (users, profiles, photos, interests)
├── index.php                 # Master API entry point & router
└── README.md                 # Configuration & testing guide
```

---

## 2. Database Setup & Configuration

### A. Create Database in Hostinger hPanel
1. Log in to your Hostinger hPanel.
2. Navigate to **Databases** → **MySQL Databases**.
3. Create a new database (e.g. `u123456_kadamvivah`), username (e.g. `u123456_admin`), and a strong password.
4. Note down the **DB Name**, **DB User**, and **DB Password** (Host is usually `localhost`).

### B. Configure Environment Variables
Copy `.env.example` to `.env` in the `api/` directory (or workspace root):

```ini
APP_ENV=production
APP_DEBUG=false

# Database Credentials
DB_HOST=localhost
DB_PORT=3306
DB_NAME=u123456_kadamvivah
DB_USER=u123456_admin
DB_PASS=your_strong_db_password

# Allowed CORS Frontend URL
CORS_ORIGIN=https://kadamvivah.in
```

---

## 3. Importing the SQL Schema

### Option 1: Via phpMyAdmin (Recommended for Hostinger)
1. In Hostinger hPanel, go to **Databases** → **phpMyAdmin** and click **Enter phpMyAdmin** next to your database.
2. Select your database from the left sidebar.
3. Click the **Import** tab in the top menu.
4. Click **Choose File** and select [`api/schema/schema.sql`](file:///c:/Users/admin/OneDrive/Kadam/api/schema/schema.sql).
5. Click **Go** (or **Import**) at the bottom.
6. Verify that the 4 tables are created:
   - `users`
   - `profiles`
   - `profile_photos`
   - `interests`

### Option 2: Via MySQL Command Line
```bash
mysql -u u123456_admin -p u123456_kadamvivah < api/schema/schema.sql
```

---

## 4. Running and Testing the API Locally

### Starting the Local PHP Built-in Server
From your project directory, start PHP's built-in web server:

```bash
# Point the server directly to the api folder:
php -S localhost:5000 -t api
```

### Testing the Health Endpoint
Open your browser or run curl:

```bash
curl -i http://localhost:5000/health
# or
curl -i http://localhost:5000/api/health
```

#### Expected JSON Response (When Database is Connected):
```json
{
  "success": true,
  "message": "KadamVivah API is operational and connected to database",
  "timestamp": "2026-09-11T14:00:00+05:30",
  "data": {
    "status": "healthy",
    "environment": "development",
    "php_version": "8.2.12",
    "database": {
      "status": "connected",
      "version": "10.11.6-MariaDB",
      "error": null
    },
    "server_time": "2026-09-11 14:00:00 IST"
  }
}
```

---

## 5. Hostinger Production Deployment

1. Build your React frontend (`npm run build`).
2. Upload the frontend build files from `dist/` into Hostinger's `public_html/`.
3. Upload the `api/` folder into `public_html/api/`.
4. Ensure `public_html/api/.env` is configured with your Hostinger MySQL credentials.
5. Access `https://yourdomain.com/api/health` to confirm the production backend is operational.
