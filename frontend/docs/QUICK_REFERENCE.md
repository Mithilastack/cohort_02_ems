# Quick Reference - EMS Frontend Pages

## Login Flow
1. User visits `/login` → Enters credentials → Redirects to `/user/dashboard`
2. Or user goes to `/register` → Creates account → Redirects to `/login`
3. Forgot password: `/forgot-password` → Enter email → Receive OTP → `/reset-password` → Redirects to `/login`

## User Dashboard - `/user/dashboard`
Main hub after login with:
- Quick stats (Active Bookings, Total Spent, Member Since)
- Quick action buttons
- Recent bookings preview

### Navigation from Dashboard
- **Browse Events** → `/events`
- **My Bookings** → `/user/bookings`
- **Edit Profile** → `/user/profile`
- **Settings** → `/user/settings`
- **My Wishlist** → `/user/wishlist`

## Page Details

### `/user/profile`
Edit personal information:
- Avatar upload
- Full name
- Phone number
- Email (read-only)

### `/user/bookings`
View all bookings:
- Filter by status (All, Active, Completed, Cancelled)
- View booking details
- Cancel active bookings
- View full event details

### `/user/settings`
Account management:
1. **Password** - Change password with current password verification
2. **Notifications** - Email, SMS, Push, Marketing email preferences
3. **Privacy** - Public profile, show email, show phone
4. **Account** - Logout all devices, delete account

### `/user/wishlist`
Saved events:
- Grid view of saved events
- Event card with details and price
- Remove from wishlist
- Quick view event details

### `/forgot-password`
Password recovery:
- Enter email
- Verify email sent
- Receive OTP via email

### `/reset-password`
Complete password reset:
- Enter OTP from email
- Enter new password
- Confirm password change

## Component Usage

All pages use these UI components:
```
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { FormField, FormFieldError } from '@/components/ui/FormField'
import { Card } from '@/components/ui/Card'
```

## Icons (from lucide-react)
```
Heart, Eye, EyeOff, Calendar, MapPin, Users, Clock, Trash2,
LogOut, Settings, Bookmark, User, Mail, Phone, Upload,
ArrowLeft, CheckCircle, Bell, Lock
```

## Authentication
Token is stored in cookies:
```javascript
document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
```

All protected endpoints require:
```
Authorization: Bearer {token}
```

## API Response Format
All responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": { /* specific data */ }
}
```

## Error Handling
- Invalid credentials: 401
- User not found: 404
- Validation errors: 400
- Server errors: 500
- Redirects to `/login` if no token found

## Form Validation
- Email: RFC standard email format
- Password: Minimum 6 characters
- Phone: Any format (backend validates)
- OTP: 6 numeric digits only

## Responsive Breakpoints
- Mobile: < 768px (single column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (3-4 columns)

## Color Scheme

### Backgrounds
- Primary: `bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950`
- Secondary: `bg-slate-900/50`
- Card: `bg-slate-800`

### Text
- Primary: `text-slate-50`
- Secondary: `text-slate-400`
- Tertiary: `text-slate-500`

### Accent Colors
- Purple: `text-purple-400/600`
- Green: `text-green-400` (success)
- Red: `text-red-400` (error)
- Yellow: `text-yellow-400` (warning)
- Blue: `text-blue-400` (info)

## Empty States
All pages with lists have empty states showing:
- Icon
- Heading
- Description
- CTA Button

## Status Badges
```
Active     → bg-green-500/20 text-green-400
Completed  → bg-blue-500/20 text-blue-400
Cancelled  → bg-red-500/20 text-red-400
```

## Loading States
- Spinner animation while loading
- Disabled form inputs during submission
- Button text changes (e.g., "Saving..." → "Save Changes")

## Cookie Keys
- `token` - Authentication token (7 days expiry)
- `user` - User data (optional, also 7 days)

## Environment Variables Needed
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Common Patterns

### Protected Page Check
```typescript
const token = document.cookie
  .split('; ')
  .find(row => row.startsWith('token='))
  ?.split('=')[1]

if (!token) {
  router.push('/login')
}
```

### API Call with Auth
```typescript
const response = await fetch(`${apiUrl}/endpoint`, {
  method: 'GET',
  headers: { Authorization: `Bearer ${token}` },
})
```

### Form Submit
```typescript
const handleSubmit = async (e) => {
  e.preventDefault()
  setErrors({})
  setIsLoading(true)
  
  // Validate
  // Make API call
  // Handle response
  // Show success/error
  // Redirect if needed
}
```

## File Structure
```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── forgot-password/page.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── reset-password/page.tsx
│   └── (user)/
│       ├── bookings/page.tsx
│       ├── dashboard/page.tsx
│       ├── profile/page.tsx
│       ├── settings/page.tsx
│       └── wishlist/page.tsx
├── components/
│   ├── home/ (existing)
│   ├── layout/ (existing)
│   └── ui/ (existing Button, Card, Input, Label, FormField)
├── lib/
│   ├── authApi.ts (UPDATED)
│   └── utils.ts (existing)
└── PAGES_IMPLEMENTATION.md
```

## Testing Checklist

- [ ] User can register with valid data
- [ ] User cannot register with invalid email
- [ ] User can login with correct credentials
- [ ] User gets error on wrong credentials
- [ ] User can reset password with OTP
- [ ] User can update profile
- [ ] User can upload avatar
- [ ] User can view all bookings
- [ ] User can filter bookings by status
- [ ] User can cancel active booking
- [ ] User can update password
- [ ] User can toggle notifications
- [ ] User can access all dashboard pages
- [ ] User is redirected to login when token expires
- [ ] Logout clears cookies and redirects to login

## Notes
- All pages are fully responsive
- Dark mode theme throughout
- Token expires after 7 days
- Forms validate on both client and server
- All API calls use async/await
- Error messages are user-friendly
- Loading states prevent double submissions
