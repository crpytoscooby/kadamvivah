# KadamVivah - Full-Stack Setup Guide

## Project Overview

KadamVivah is a secure, production-ready matrimonial platform built with React (frontend) and Node.js/Express (backend), featuring admin-driven user creation, forced password changes, and comprehensive image upload handling.

## Architecture

```
client/
├── src/                    # React frontend
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── contexts/         # React contexts (AuthContext)
│   ├── lib/              # Utilities (API client)
│   ├── data/             # Mock data
│   └── App.jsx           # Main app component
├── server/               # Node.js/Express backend
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── utils/            # Utilities (password, image upload)
│   ├── controllers/      # Business logic
│   └── server.js         # Express server
```

## Backend Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- npm or pnpm

### Installation

```bash
cd server
npm install
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/kadamvivah
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kadamvivah

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d

# Image Upload (Optional - for Cloudinary)
# CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Database Setup

#### Option 1: Local MongoDB

```bash
# Install MongoDB locally (macOS with Homebrew)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

#### Option 2: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

### Seed Admin User

```bash
npm run seed
```

This creates an admin user with:
- Email: `admin@kadamvivah.in`
- Password: `Admin@123456`

### Start Backend Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## Frontend Setup

### Installation

```bash
cd client
pnpm install
# or
npm install
```

### Environment Variables

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Start Development Server

```bash
pnpm run dev
# or
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Documentation

### Authentication Routes

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password@123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "mustChangePassword": false
  }
}
```

#### Change Password
```bash
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "OldPassword@123",
  "newPassword": "NewPassword@456",
  "confirmPassword": "NewPassword@456"
}
```

### Profile Routes (Authenticated)

#### Get Profiles with Filters
```bash
GET /api/profiles?gender=male&city=Pune&ageFrom=25&ageTo=35&page=1&limit=20
Authorization: Bearer <token>

Query Parameters:
- gender: male/female/other
- ageFrom: minimum age
- ageTo: maximum age
- dobFrom: date from (YYYY-MM-DD)
- dobTo: date to (YYYY-MM-DD)
- caste: caste name
- city: city name
- education: education level
- occupation: occupation
- page: page number
- limit: results per page
```

#### Get Single Profile
```bash
GET /api/profiles/:id
Authorization: Bearer <token>
```

### Admin Routes (Admin Only)

#### Create Profile
```bash
POST /api/admin/profiles
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Fields:
- firstName, lastName, email, phone (required)
- dob, gender, city, state, pincode (required)
- caste, education, occupation (required)
- middleName, subCaste, annualIncome, bio (optional)
- familyDetails (JSON string)
- photos (files, max 10, max 4MB each)
- createUserAccount (true/false)

Response includes:
- profile: created profile
- userAccount: user account (if created)
  - generatedPassword: auto-generated password (display only)
```

#### Get All Profiles (Admin)
```bash
GET /api/admin/profiles?page=1&limit=20&search=name
Authorization: Bearer <admin_token>
```

#### Update Profile
```bash
PUT /api/admin/profiles/:id
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Fields: (same as create, all optional)
- removePhotos: array of photo URLs to remove
```

#### Delete Profile
```bash
DELETE /api/admin/profiles/:id
Authorization: Bearer <admin_token>
```

## Password Requirements

All passwords must meet these requirements:
- Minimum 9 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 digit (0-9)
- At least 1 special character (!@#$%^&*()_+-=[]{}|;:,.<>?)

## Image Upload

### Client-Side Validation
- Allowed formats: PNG, JPG/JPEG
- Maximum file size: 4 MB
- Minimum recommended size: 20 KB

### Server-Side Validation
- Same format and size restrictions
- Supports local storage (default) or Cloudinary

### Local Storage
Images are saved to `server/uploads/` directory. For production, configure Cloudinary.

### Cloudinary Setup
1. Create Cloudinary account
2. Set `CLOUDINARY_URL` in `.env`
3. Uncomment Cloudinary code in `server/utils/imageUpload.js`

## Testing

### Test Admin Flow

1. **Login as Admin**
   - Email: `admin@kadamvivah.in`
   - Password: `Admin@123456`

2. **Create a Profile**
   - Navigate to `/admin/add-profile`
   - Fill in all required fields
   - Check "Create User Account" to auto-generate credentials
   - Copy and save the generated password

3. **Login as New User**
   - Use the email and generated password
   - System forces password change
   - Change password to a strong password
   - Access profiles listing

4. **Test Filters**
   - Filter by age, gender, city, education
   - Verify pagination works
   - Click profile cards to view details

## Deployment

### Frontend Deployment (Vercel)

```bash
npm i -g vercel
cd client
vercel
```

### Backend Deployment (Render/Railway)

1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)

1. Create cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGO_URI` in backend `.env`
4. Whitelist IP addresses in Atlas

## Troubleshooting

### "Cannot connect to MongoDB"
- Verify MongoDB is running
- Check `MONGO_URI` in `.env`
- For Atlas, ensure IP is whitelisted

### "CORS error"
- Update `CORS_ORIGIN` in backend `.env`
- Ensure frontend URL matches

### "Image upload fails"
- Check file size (max 4MB)
- Verify file format (PNG, JPG/JPEG)
- Check `server/uploads/` directory permissions

### "Password change fails"
- Verify password meets all requirements
- Check that old password is correct
- Ensure `mustChangePassword` flag is set

## Security Notes

- Always use HTTPS in production
- Store JWT secret securely (use environment variables)
- Implement rate limiting on auth endpoints
- Validate all inputs on both client and server
- Use strong database passwords
- Regularly backup MongoDB

## Support & Documentation

For detailed API documentation, see the code comments in:
- `server/routes/auth.js`
- `server/routes/profiles.js`
- `server/routes/admin.js`

For frontend components, see:
- `src/pages/Login.jsx`
- `src/pages/ChangePassword.jsx`
- `src/pages/AdminAddProfile.jsx`

