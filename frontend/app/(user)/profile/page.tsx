'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, Mail, Phone, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { FormField, FormFieldError } from '@/components/ui/FormField'
import { Card } from '@/components/ui/Card'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
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

        const response = await fetch(`${apiUrl}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }

        const data = await response.json()
        if (data.success && data.data.user) {
          const user = data.data.user
          setProfile(user)
          setFormData({
            name: user.name || '',
            phone: user.phone || '',
          })
          if (user.avatar) {
            setAvatarPreview(user.avatar)
          }
        }
      } catch (err) {
        console.error(err)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setSuccess(false)
    setIsSaving(true)

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

      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('phone', formData.phone)
      if (selectedFile) {
        formDataToSend.append('avatar', selectedFile)
      }

      const response = await fetch(`${apiUrl}/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile')
      }

      if (data.success) {
        setProfile(data.data.user)
        setSelectedFile(null)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to update profile',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <Link href="/user/dashboard">
              <Button variant="outline" size="icon" className="text-slate-400">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-50">Edit Profile</h1>
              <p className="text-slate-400 mt-1">Update your personal information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
            Profile updated successfully!
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {errors.submit}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="md:col-span-1">
            <Card variant="gradient" className="p-6 text-center">
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16" />
                  )}
                </div>
              </div>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  Change Avatar
                </Button>
              </label>

              <p className="text-xs text-slate-400 mt-4">
                JPG, PNG or GIF (max. 5MB)
              </p>
            </Card>
          </div>

          {/* Form Section */}
          <div className="md:col-span-2">
            <Card variant="gradient" className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <FormField>
                  <Label htmlFor="name" className="text-slate-200">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isSaving}
                      className="pl-10"
                    />
                  </div>
                  <FormFieldError message={errors.name} />
                </FormField>

                {/* Email Field (Read-only) */}
                <FormField>
                  <Label htmlFor="email" className="text-slate-200">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={profile?.email || ''}
                      disabled
                      className="pl-10 bg-slate-900/50"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Email cannot be changed
                  </p>
                </FormField>

                {/* Phone Field */}
                <FormField>
                  <Label htmlFor="phone" className="text-slate-200">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isSaving}
                      className="pl-10"
                    />
                  </div>
                  <FormFieldError message={errors.phone} />
                </FormField>

                {/* Role (Read-only) */}
                <FormField>
                  <Label htmlFor="role" className="text-slate-200">
                    Account Type
                  </Label>
                  <Input
                    id="role"
                    type="text"
                    value={profile?.role || 'User'}
                    disabled
                    className="bg-slate-900/50 capitalize"
                  />
                </FormField>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Link href="/user/dashboard" className="flex-1">
                    <Button
                      type="button"
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-50 border border-slate-700"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </Card>

            {/* Additional Actions */}
            <div className="mt-6">
              <Link href="/user/settings">
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-50 border border-slate-700">
                  More Settings & Security
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
