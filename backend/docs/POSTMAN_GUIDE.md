# EMS API Postman Collection Guide

## 📦 Import the Collection

1. Open Postman
2. Click **Import** button
3. Select `EMS_API_Complete.postman_collection.json`
4. Collection will appear with 24 endpoints in 6 folders

## 🔧 Setup

The collection uses variables for easy testing:

- **`{{baseUrl}}`** - Default: `http://localhost:5000/api`
- **`{{token}}`** - Auto-saved after user login
- **`{{adminToken}}`** - Auto-saved after admin login

### Change Base URL (Optional)
1. Click on collection name
2. Go to **Variables** tab
3. Update `baseUrl` value

## 🎯 Quick Start Testing Flow

### 1. Health Check
- Run: **Health Check**
- Verify server is running

### 2. Create Admin User
Run in terminal:
```bash
npm run seed:admin
```

### 3. Admin Login
- Run: **Admin Login** (in Authentication folder)
- Token automatically saved to `{{adminToken}}`

### 4. User Signup & Login
- Run: **Signup** to create a user
- Run: **Login** to get user token (auto-saved to `{{token}}`)

### 5. Test User Features
- **Profile Management**: Get/Update Profile, Change Password
- **Events**: Browse events (public)
- **Bookings**: Create booking, view my bookings
- **Wishlist**: Add/remove events

### 6. Test Admin Features
- **User Management**: Get all users, block/unblock
- **Event Management**: Create/update/delete events
- **Booking Management**: View all bookings, update status
- **Dashboard**: Get comprehensive stats

## 📚 Collection Structure

### 1️⃣ Authentication (5 endpoints)
- ✅ Signup
- ✅ Login (auto-saves `{{token}}`)
- ✅ Admin Login (auto-saves `{{adminToken}}`)
- ✅ Forgot Password
- ✅ Reset Password

### 2️⃣ Profile Management (3 endpoints)
- ✅ Get Profile
- ✅ Update Profile (with avatar upload)
- ✅ Change Password

### 3️⃣ Events (5 endpoints)
- ✅ Get All Events (public, with filters)
- ✅ Get Event By ID (public)
- ✅ Create Event (admin, with banner upload)
- ✅ Update Event (admin)
- ✅ Delete Event (admin)

### 4️⃣ Bookings (4 endpoints)
- ✅ Create Booking
- ✅ Get My Bookings
- ✅ Get All Bookings (admin, with filters)
- ✅ Update Booking Status (admin)

### 5️⃣ Wishlist (3 endpoints)
- ✅ Get Wishlist
- ✅ Add to Wishlist
- ✅ Remove from Wishlist

### 6️⃣ Admin (3 endpoints)
- ✅ Get All Users (with search & filters)
- ✅ Block/Unblock User
- ✅ Get Dashboard Stats

### Health Check (1 endpoint)
- ✅ Server status check

## 🔑 Authentication Notes

### User Endpoints
Use: `Authorization: Bearer {{token}}`
- All Profile endpoints
- All Wishlist endpoints
- Create Booking
- Get My Bookings

### Admin Endpoints
Use: `Authorization: Bearer {{adminToken}}`
- Create/Update/Delete Events
- Get All Bookings
- Update Booking Status
- All Admin endpoints

### Public Endpoints (No Auth)
- Health Check
- Get All Events
- Get Event By ID
- All Authentication endpoints

## 📝 Request Examples

### File Uploads
For endpoints with file uploads (Update Profile, Create Event):
1. Select **Body** tab
2. Choose **form-data**
3. Add file field and select file
4. Add other fields as text

### Query Parameters
Pre-configured with examples:
- Pagination: `page=1&limit=10`
- Search: `search=keyword`
- Filters: `category=Technology`, `status=booked`, `isBlocked=true`

## 🧪 Testing Scenarios

### Scenario 1: Complete User Flow
1. Signup → Login
2. Browse Events
3. Add to Wishlist
4. Create Booking
5. Check My Bookings
6. Update Profile with Avatar

### Scenario 2: Admin Flow
1. Admin Login
2. Create Event with Banner
3. View All Users
4. Block User
5. View Dashboard Stats
6. Manage Bookings

### Scenario 3: Password Reset
1. Forgot Password (get OTP via email)
2. Reset Password with OTP
3. Login with new password

## 🚀 Tips

- **Auto Token Save**: Login endpoints automatically save tokens
- **Path Variables**: Replace `:id` placeholders with actual IDs
- **File Size**: Max upload size is 5MB
- **OTP Expiry**: OTPs expire in 10 minutes
- **Seat Management**: Watch availableSeats decrease on booking
- **Email Testing**: Check console logs if email service not configured

## 📧 Environment Variables Required

Ensure `.env` is configured:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ems_db
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## ✅ Ready to Test!

Import the collection and start testing your EMS Backend API! 🎉
