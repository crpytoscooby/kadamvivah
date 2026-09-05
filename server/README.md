# KadamVivah API (PHP + MySQL)

A dependency-free PHP REST API for the KadamVivah frontend, designed to run on
**Hostinger Premium** shared hosting (PHP 8 + MySQL/MariaDB). No Composer, no
Node.js, no MongoDB required.

It implements exactly the contract the frontend's `src/lib/api.js` expects.

---

## Endpoints

| Method | Path                     | Access | Description |
|--------|--------------------------|--------|-------------|
| POST   | `/auth/register`         | public | Create account + profile → `{ token, user }` |
| POST   | `/auth/login`            | public | Log in → `{ token, user }` |
| POST   | `/auth/change-password`  | auth   | Change password → `{ token, user }` |
| GET    | `/profiles`              | auth   | List with filters + pagination → `{ profiles, total, page, totalPages }` |
| GET    | `/profiles/{id}`         | auth   | Single profile → `{ profile }` |
| POST   | `/profiles`              | admin  | Create profile → `{ profile }` |
| PUT    | `/profiles/{id}`         | admin  | Update profile → `{ profile }` |
| DELETE | `/profiles/{id}`         | admin  | Delete → `{ success: true }` |
| POST   | `/profiles/import`       | admin  | Bulk import `{ profiles: [...] }` → `{ success, imported }` |

`GET /profiles` query params: `gender`, `city`, `education`, `dobFrom`,
`dobTo`, `page`, `limit`.

Auth is a JWT (HS256) returned by login/register and sent as
`Authorization: Bearer <token>`.

---

## Deploy to Hostinger (step by step)

1. **Create a MySQL database** in hPanel → *Databases → MySQL Databases*.
   Note the database name, username, password and host.

2. **Upload the `server/` folder** to your hosting via *File Manager* or FTP.
   A common layout is to put it in `public_html/api/` so the API lives at
   `https://your-domain.com/api`.

3. **Create `config.local.php`** (copy `config.example.php`) and fill in:
   - your DB credentials,
   - a long random `jwt_secret` (e.g. `openssl rand -hex 32`),
   - a random `install_token`,
   - `cors_origins` = your frontend URL (e.g. `['https://your-domain.com']`).

4. **Run the installer once** in your browser:
   `https://your-domain.com/api/install.php?token=YOUR_INSTALL_TOKEN`
   It creates the tables and an admin user
   (`admin@kadamvivah.in` / `admin123`). **Then delete `install.php`** and log
   in and change the admin password.

   *(Alternative: import `sql/schema.sql` via phpMyAdmin and create the admin
   row manually — see the note at the bottom of that file.)*

5. **Point the frontend at the API.** In the frontend project create a `.env`:
   ```
   VITE_API_URL=https://your-domain.com/api
   ```
   Then rebuild (`npm run build`) and upload `dist/` to `public_html`.

6. **Test:** `https://your-domain.com/api/` should return
   `{"name":"KadamVivah API","status":"ok"}`.

---

## Notes

- **PHP version:** set 8.0+ in hPanel → *Advanced → PHP Configuration*.
- **HTTPS:** enable SSL (free with Hostinger) so tokens aren't sent in clear.
- **CORS:** if the frontend is on the same domain as the API you can leave
  `cors_origins` restrictive; only widen it for cross-origin setups.
- **Security:** `config.local.php`, `*.sql` and `*.md` are blocked by
  `.htaccess`. Keep `jwt_secret` and `install_token` private.
- The frontend still ships with a localStorage mock mode; setting
  `VITE_API_URL` and switching `AuthContext`/pages to `api.*` calls moves it
  onto this backend.
