'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, Bookmark, Settings, LogOut, Clock, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
}

interface Booking {
  _id: string
  eventId: string
  eventName: string
  eventDate: string
  eventLocation: string
  ticketCount: number
  totalPrice: number
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
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
          setUser(data.data.user)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0'
    document.cookie = 'user=; path=/; max-age=0'
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-50">Welcome, {user?.name}!</h1>
              <p className="text-slate-400 mt-1">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card variant="gradient" className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Active Bookings</p>
                <p className="text-3xl font-bold text-slate-50">
                  {bookings.filter(b => b.status === 'active').length}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-purple-500/30" />
            </div>
          </Card>

          <Card variant="gradient" className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Total Spent</p>
                <p className="text-3xl font-bold text-slate-50">
                  ₹{bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)}
                </p>
              </div>
              <Bookmark className="w-10 h-10 text-pink-500/30" />
            </div>
          </Card>

          <Card variant="gradient" className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Member Since</p>
                <p className="text-lg font-bold text-slate-50">
                  {new Date().getFullYear()}
                </p>
              </div>
              <Users className="w-10 h-10 text-blue-500/30" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-50 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/events">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Browse Events
              </Button>
            </Link>
            <Link href="/user/bookings">
              <Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-50 border border-slate-700">
                <Calendar className="w-4 h-4 mr-2" />
                My Bookings
              </Button>
            </Link>
            <Link href="/user/profile">
              <Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-50 border border-slate-700">
                <Settings className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Link href="/user/settings">
              <Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-50 border border-slate-700">
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Bookings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-50">Recent Bookings</h2>
            <Link href="/user/bookings" className="text-purple-400 hover:text-purple-300 text-sm">
              View All →
            </Link>
          </div>

          {bookings.length === 0 ? (
            <Card variant="gradient" className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-500" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No Bookings Yet</h3>
              <p className="text-slate-400 mb-6">
                Start booking your favorite events today!
              </p>
              <Link href="/events">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Browse Events
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.slice(0, 4).map(booking => (
                <Card key={booking._id} variant="gradient" className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-50">
                        {booking.eventName}
                      </h3>
                      <p className="text-sm text-slate-400">{booking.eventName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(booking.eventDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {booking.eventLocation}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {booking.ticketCount} tickets
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
                    <span className="text-slate-400">Total:</span>
                    <span className="text-lg font-bold text-purple-400">₹{booking.totalPrice}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
