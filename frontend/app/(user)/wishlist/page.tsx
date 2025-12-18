'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart, MapPin, Calendar, Users, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface WishlistEvent {
  _id: string
  name: string
  date: string
  location: string
  price: number
  image?: string
  category?: string
  availableTickets?: number
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

        // TODO: Update endpoint when wishlist API is ready
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
      <div className="border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <Link href="/user/dashboard">
              <Button variant="outline" size="icon" className="text-slate-400">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-50">My Wishlist</h1>
              <p className="text-slate-400 mt-1">Your favorite events saved for later</p>
            </div>
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

        {wishlist.length === 0 ? (
          <Card variant="gradient" className="p-12 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-slate-500" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Your wishlist is empty</h3>
            <p className="text-slate-400 mb-6">
              Add events to your wishlist to keep track of events you're interested in.
            </p>
            <Link href="/events">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Browse Events
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map(event => (
              <Card key={event._id} variant="gradient" className="overflow-hidden hover:border-purple-500/50 transition-colors">
                {/* Event Image */}
                <div className="h-48 bg-gradient-to-br from-purple-600 to-purple-900 relative overflow-hidden">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="w-16 h-16 text-purple-300/30" />
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveFromWishlist(event._id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>

                {/* Event Details */}
                <div className="p-6">
                  {event.category && (
                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-purple-600/20 text-purple-400 mb-2">
                      {event.category}
                    </span>
                  )}

                  <h3 className="text-lg font-bold text-slate-50 mb-3 line-clamp-2">
                    {event.name}
                  </h3>

                  <div className="space-y-2 text-sm text-slate-400 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    {event.availableTickets !== undefined && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        {event.availableTickets} tickets available
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-700 pt-4 mb-4">
                    <p className="text-lg font-bold text-purple-400">
                      ₹{event.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/events/${event._id}`} className="flex-1">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                        View Details
                      </Button>
                    </Link>
                    <button
                      onClick={() => handleRemoveFromWishlist(event._id)}
                      className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
