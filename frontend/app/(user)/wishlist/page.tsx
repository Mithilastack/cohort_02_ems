'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart, MapPin, Calendar, Users, Trash2, IndianRupee, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface WishlistEvent {
  _id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  category: string
  bannerUrl: string
  totalSeats: number
  availableSeats: number
  price: number
  organizer: string
}

export default function WishlistPage() {
  const router = useRouter()
  const [wishlist, setWishlist] = useState<WishlistEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchWishlist = async () => {
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

        const response = await fetch(`${apiUrl}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch wishlist')
        }

        const data = await response.json()
        if (data.success) {
          setWishlist(data.data?.wishlist || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch wishlist')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWishlist()
  }, [router])

  const handleRemoveFromWishlist = async (eventId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      if (!token) return

      const response = await fetch(`${apiUrl}/wishlist/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error('Failed to remove from wishlist')
      }

      setWishlist(wishlist.filter(e => e._id !== eventId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from wishlist')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                My Wishlist
              </h1>
              <p className="text-slate-400 mt-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-purple-400 fill-purple-400" />
                {wishlist.length} {wishlist.length === 1 ? 'event' : 'events'} saved for later
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 backdrop-blur-sm">
            {error}
          </div>
        )}

        {wishlist.length === 0 ? (
          <Card variant="gradient" className="p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-800/50 flex items-center justify-center ring-1 ring-white/10">
              <Heart className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-300 mb-3">Your wishlist is empty</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Add events to your wishlist to keep track of events you're interested in and access them quickly.
            </p>
            <Link href="/events">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-6 text-lg">
                Browse Events
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map(event => (
              <div
                key={event._id}
                className="group relative bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/20 flex flex-col"
              >
                {/* Event Image */}
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-800">
                  {event.bannerUrl ? (
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                      <Calendar className="w-16 h-16 text-slate-600/50" />
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/10 text-white shadow-lg">
                      {event.category}
                    </span>
                  </div>

                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(event._id)}
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/30 flex items-center justify-center hover:scale-110 hover:bg-red-500/30 transition-all duration-300 z-10 group/btn"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500 group-hover/btn:animate-pulse" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-purple-400 transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span>{formatDate(event.date)}</span>
                      <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span>{event.time}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <MapPin className="w-4 h-4 text-purple-500/70 flex-shrink-0" />
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <Users className="w-4 h-4 text-purple-500/70" />
                      <span>{event.availableSeats} <span className="text-slate-600">/</span> {event.totalSeats} seats left</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-500"
                        style={{ width: `${Math.max(5, ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <div className="flex items-baseline gap-1">
                      <IndianRupee className="w-4 h-4 text-slate-400 self-center" />
                      <span className="text-2xl font-bold text-white tracking-tight">
                        {event.price > 0 ? event.price.toLocaleString('en-IN') : 'Free'}
                      </span>
                    </div>
                    <Link href={`/events/${event._id}`}>
                      <Button
                        size="sm"
                        className="rounded-full px-6 bg-white text-slate-900 font-semibold hover:bg-purple-50 hover:text-purple-700 transition-colors"
                      >
                        Details
                      </Button>
                    </Link>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(event._id)}
                    className="mt-4 w-full py-2.5 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300 border border-red-500/20 hover:border-red-500/30 flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
