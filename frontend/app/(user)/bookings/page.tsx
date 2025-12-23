'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Users, Clock, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface Booking {
  _id: string
  event: {
    _id: string
    title: string
    description: string
    date: string
    time: string
    venue: string
    category: string
    bannerUrl: string
  }
  quantity: number
  totalAmount: number
  status: string
  bookedAt: string
  createdAt: string
  updatedAt: string
}

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'cancelled' | 'completed'>('all')

  useEffect(() => {
    const fetchBookings = async () => {
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

        // TODO: Update endpoint when booking API is ready
        const response = await fetch(`${apiUrl}/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch bookings')
        }

        const data = await response.json()
        if (data.success) {
          setBookings(data.data?.bookings || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [router])

  const getFilteredBookings = () => {
    if (filter === 'all') return bookings
    return bookings.filter(b => b.status === filter)
  }

  const filteredBookings = getFilteredBookings()

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      if (!token) return

      const response = await fetch(`${apiUrl}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error('Failed to cancel booking')
      }

      setBookings(bookings.filter(b => b._id !== bookingId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/user">
              <Button variant="outline" size="icon" className="text-slate-400">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-50">My Bookings</h1>
              <p className="text-slate-400 mt-1">View and manage your event bookings</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'active', 'completed', 'cancelled'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
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

        {filteredBookings.length === 0 ? (
          <Card variant="gradient" className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-500" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              No {filter !== 'all' ? filter : ''} bookings
            </h3>
            <p className="text-slate-400 mb-6">
              {filter === 'all'
                ? 'You haven\'t booked any events yet. Start exploring!'
                : `You don't have any ${filter} bookings.`}
            </p>
            <Link href="/events">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Browse Events
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBookings.map(booking => (
              <Card key={booking._id} variant="gradient" className="p-6 hover:border-purple-500/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-50">
                      {booking.event.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Booking ID: {booking._id.slice(-8)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4 ${booking.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : booking.status === 'completed'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-3 mb-6 text-sm text-slate-400">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{new Date(booking.event.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{booking.event.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    {booking.event.venue}
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    {booking.quantity} {booking.quantity === 1 ? 'ticket' : 'tickets'}
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4 mb-4 flex items-center justify-between">
                  <span className="text-slate-400">Total Amount:</span>
                  <span className="text-lg font-bold text-purple-400">₹{booking.totalAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex gap-2">
                  <Link href={`/events/${booking.event._id}`} className="flex-1">
                    <Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-50 border border-slate-700">
                      <Eye className="w-4 h-4 mr-2" />
                      View Event
                    </Button>
                  </Link>
                  {booking.status === 'active' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="flex-1 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
