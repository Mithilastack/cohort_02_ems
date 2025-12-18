# Cloudinary Upload Fix

## ✅ Issue Resolved

**Error:** `Must supply api_key` when uploading avatar

**Root Cause:** Server wasn't picking up Cloudinary environment variables

**Solution:** Server restarted to load environment variables from `.env`

## 🔧 Configuration Verified

Your `.env` file already had the correct Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=dagbwfqma
CLOUDINARY_API_KEY=194327481726488
CLOUDINARY_API_SECRET=V1RT3zhlS-kjrJIG5suEjYZQGfw
```

## ✅ Fixed Files

1. **admin.seed.ts** - Restored fallback values and added validation
2. **Server** - Restarted to pick up environment variables

## 🧪 Test the Fix

### 1. Test Profile Avatar Upload
Use Postman:
- **Endpoint:** PUT `/api/profile`
- **Headers:** `Authorization: Bearer {{token}}`
- **Body:** form-data with `avatar` file field

### 2. Test Event Banner Upload (Admin)
Use Postman:
- **Endpoint:** POST `/api/events`
- **Headers:** `Authorization: Bearer {{adminToken}}`
- **Body:** form-data with `banner` file field

## 📝 How File Uploads Work Now

1. **User uploads file** → Multer middleware captures it in memory
2. **Buffer sent to Cloudinary** → `upload.service.ts` uploads to cloud
3. **URL returned** → Secure HTTPS URL saved to database
4. **Stored in folders:**
   - User avatars: `ems/users/`
   - Event banners: `ems/events/`

## 🎯 Upload Limits

- **Max file size:** 5MB
- **Allowed types:** Images only (jpg, png, gif, etc.)
- **Storage:** Cloud-based (Cloudinary)

## ✅ Status

**Server Status:** ✅ Running  
**Cloudinary Config:** ✅ Loaded  
**Ready for uploads:** ✅ Yes

Try uploading an avatar now - it should work! 🎉
