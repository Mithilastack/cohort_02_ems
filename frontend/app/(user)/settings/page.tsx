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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <Link href="/user/dashboard">
              <Button variant="outline" size="icon" className="text-slate-400">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-50">Settings</h1>
              <p className="text-slate-400 mt-1">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="space-y-2">
              {[
                { id: 'password', label: 'Password', icon: Lock },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'privacy', label: 'Privacy', icon: Trash2 },
                { id: 'account', label: 'Account', icon: LogOut },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-600/20 text-purple-400 border border-purple-600/30'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
                {success}
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
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
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card variant="gradient" className="p-8">
                <h2 className="text-2xl font-bold text-slate-50 mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                    { key: 'sms', label: 'SMS Notifications', desc: 'Receive updates via SMS' },
                    { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                    { key: 'marketing', label: 'Marketing Emails', desc: 'Receive promotional offers' },
                  ].map(pref => (
                    <div key={pref.key} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-50">{pref.label}</p>
                        <p className="text-sm text-slate-400">{pref.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications[pref.key as keyof typeof notifications]}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            [pref.key]: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded text-purple-600"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleNotificationChange}
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800"
                >
                  Save Preferences
                </Button>
              </Card>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <Card variant="gradient" className="p-8">
                <h2 className="text-2xl font-bold text-slate-50 mb-6">Privacy Settings</h2>
                <div className="space-y-4">
                  {[
                    { key: 'profilePublic', label: 'Public Profile', desc: 'Make your profile visible to others' },
                    { key: 'showEmail', label: 'Show Email', desc: 'Display your email address' },
                    { key: 'showPhoneNumber', label: 'Show Phone', desc: 'Display your phone number' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-50">{item.label}</p>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy[item.key as keyof typeof privacy]}
                        onChange={(e) =>
                          setPrivacy({
                            ...privacy,
                            [item.key]: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded text-purple-600"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handlePrivacyChange}
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800"
                >
                  Save Settings
                </Button>
              </Card>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <Card variant="gradient" className="p-8">
                  <h2 className="text-2xl font-bold text-slate-50 mb-6">Account Actions</h2>
                  <div className="space-y-4">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                    >
                      <span className="font-medium">Logout from All Devices</span>
                      <LogOut className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <span className="font-medium">Delete Account</span>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
