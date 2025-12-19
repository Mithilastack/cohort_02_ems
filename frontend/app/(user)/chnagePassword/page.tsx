'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lock, Bell, Trash2, LogOut, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { FormField, FormFieldError } from '@/components/ui/FormField'
import { Card } from '@/components/ui/Card'

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'password' | 'notifications' | 'privacy' | 'account'>('password')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Password state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Notification state
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
  })

  // Privacy state
  const [privacy, setPrivacy] = useState({
    profilePublic: false,
    showEmail: false,
    showPhoneNumber: false,
  })

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setSuccess('')
    setIsLoading(true)

    // Validation
    const newErrors: Record<string, string> = {}
    if (!passwordData.oldPassword) newErrors.oldPassword = 'Current password is required'
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required'
    if (passwordData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters'
    if (!passwordData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    if (passwordData.newPassword !== passwordData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch(`${apiUrl}/profile/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password')
      }

      setSuccess('Password changed successfully!')
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to change password' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationChange = () => {
    // TODO: Save notification preferences
    setSuccess('Notification preferences updated!')
  }

  const handlePrivacyChange = () => {
    // TODO: Save privacy settings
    setSuccess('Privacy settings updated!')
  }

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Implement account deletion
      alert('Account deletion feature coming soon')
    }
  }

  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0'
    document.cookie = 'user=; path=/; max-age=0'
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      {/* Main Content */}
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
            {success}
          </div>
        )}

        {/* Password Form */}
        <Card variant="gradient" className="p-8">
          <h2 className="text-2xl font-bold text-slate-50 mb-6">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-6">
            {errors.submit && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {errors.submit}
              </div>
            )}

            <FormField>
              <Label htmlFor="oldPassword" className="text-slate-200">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, oldPassword: e.target.value })
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <FormFieldError message={errors.oldPassword} />
            </FormField>

            <FormField>
              <Label htmlFor="newPassword" className="text-slate-200">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <FormFieldError message={errors.newPassword} />
            </FormField>

            <FormField>
              <Label htmlFor="confirmPassword" className="text-slate-200">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <FormFieldError message={errors.confirmPassword} />
            </FormField>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
