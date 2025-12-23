'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Users,
    IndianRupee,
    Clock,
    User,
    Building,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Heart
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { fetchWishlist, addToWishlist, removeFromWishlist } from '@/lib/wishlistApi'

interface Event {
    _id: string
    title: string
    description: string
    venue: string
    category: string
    bannerUrl: string
    totalSeats: number
    availableSeats: number
    price: number
    organizer: string
    address: string
    registrationStartDate: string
    registrationEndDate: string
    eventStartDate: string
    eventEndDate: string
    startTime: string
    endTime: string
    registrationStatus: string
    computedRegistrationStatus: string
    guests: string[]
    createdAt: string
    updatedAt: string
}

interface EventResponse {
    success: boolean
    message: string
    data: {
        event: Event
    }
}

export default function EventDetailsPage() {
    const router = useRouter()
    const params = useParams()
    const eventId = params.id as string

    const [event, setEvent] = useState<Event | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [isInWishlist, setIsInWishlist] = useState(false)
    const [wishlistLoading, setWishlistLoading] = useState(false)
    const [showQuantityModal, setShowQuantityModal] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [bookingLoading, setBookingLoading] = useState(false)
    const [bookingError, setBookingError] = useState('')
    const [bookingSuccess, setBookingSuccess] = useState(false)

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setIsLoading(true)
                setError('')

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
                const response = await fetch(`${apiUrl}/events/${eventId}`)

                if (!response.ok) {
                    throw new Error('Failed to fetch event details')
                }

                const data: EventResponse = await response.json()

                if (data.success) {
                    setEvent(data.data.event)
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch event details')
            } finally {
                setIsLoading(false)
            }
        }

        if (eventId) {
            fetchEvent()
        }
    }, [eventId])

    // Check if event is in wishlist
    useEffect(() => {
        const checkWishlist = async () => {
            if (!eventId) return

            try {
                const data = await fetchWishlist()
                if (data.success) {
                    const inWishlist = data.data.wishlist.some(e => e._id === eventId)
                    setIsInWishlist(inWishlist)
                }
            } catch (err) {
                // User might not be logged in, silently fail
                console.log('Could not check wishlist:', err)
            }
        }

        checkWishlist()
    }, [eventId])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formatShortDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getEventStatus = () => {
        if (!event) return { text: 'Unknown', color: 'text-slate-400', icon: AlertCircle }

        const now = new Date()
        const eventStart = new Date(event.eventStartDate)
        const eventEnd = new Date(event.eventEndDate)

        if (now < eventStart) {
            return { text: 'Upcoming', color: 'text-blue-400', icon: Clock }
        } else if (now >= eventStart && now <= eventEnd) {
            return { text: 'Ongoing', color: 'text-green-400', icon: CheckCircle2 }
        } else {
            return { text: 'Ended', color: 'text-slate-500', icon: XCircle }
        }
    }

    const getRegistrationStatusInfo = () => {
        if (!event) return { text: 'Unknown', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' }

        const status = event.computedRegistrationStatus || event.registrationStatus

        const statusMap = {
            open: { text: 'Registration Open', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
            closed: { text: 'Registration Closed', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
            full: { text: 'Event Full', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' }
        }

        return statusMap[status as keyof typeof statusMap] || statusMap.closed
    }

    const canRegister = () => {
        if (!event) return false
        const status = event.computedRegistrationStatus || event.registrationStatus
        return status === 'open' && event.availableSeats > 0
    }

    const handleWishlistToggle = async () => {
        // Check if user is logged in
        const token = typeof window !== 'undefined'
            ? document.cookie
                .split('; ')
                .find(row => row.startsWith('token='))
                ?.split('=')[1]
            : null

        if (!token) {
            router.push(`/login?redirect=/events/${eventId}`)
            return
        }

        // Optimistic update
        setIsInWishlist(prev => !prev)
        setWishlistLoading(true)

        try {
            if (isInWishlist) {
                await removeFromWishlist(eventId)
            } else {
                await addToWishlist(eventId)
            }
        } catch (err) {
            // Rollback on error
            setIsInWishlist(prev => !prev)
            console.error('Wishlist error:', err)
        } finally {
            setWishlistLoading(false)
        }
    }

    const handleRegisterClick = () => {
        // Check if user is logged in
        const token = typeof window !== 'undefined'
            ? document.cookie
                .split('; ')
                .find(row => row.startsWith('token='))
                ?.split('=')[1]
            : null

        if (!token) {
            router.push(`/login?redirect=/events/${eventId}`)
            return
        }

        // Reset states and show modal
        setQuantity(1)
        setBookingError('')
        setBookingSuccess(false)
        setShowQuantityModal(true)
    }

    const handleBooking = async () => {
        setBookingLoading(true)
        setBookingError('')
        setBookingSuccess(false)

        try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('token='))
                ?.split('=')[1]

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
            const response = await fetch(`${apiUrl}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    eventId: eventId,
                    quantity: quantity
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create booking')
            }

            setBookingSuccess(true)
            // Refresh event data to update available seats
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        } catch (err) {
            setBookingError(err instanceof Error ? err.message : 'Failed to create booking')
        } finally {
            setBookingLoading(false)
        }
    }

    const handleCloseModal = () => {
        if (!bookingLoading) {
            setShowQuantityModal(false)
            setQuantity(1)
            setBookingError('')
            setBookingSuccess(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading event details...</p>
                </div>
            </div>
        )
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
                <Card variant="gradient" className="p-8 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                    <h3 className="text-xl font-semibold text-white mb-2">Event Not Found</h3>
                    <p className="text-slate-400 mb-6">{error || 'The event you are looking for does not exist.'}</p>
                    <Link href="/events">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                            Back to Events
                        </Button>
                    </Link>
                </Card>
            </div>
        )
    }

    const eventStatus = getEventStatus()
    const registrationStatus = getRegistrationStatusInfo()
    const StatusIcon = eventStatus.icon

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Breadcrumb & Back Button */}
            <div className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Link href="/" className="hover:text-purple-400 transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/events" className="hover:text-purple-400 transition-colors">
                            Events
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-slate-300 truncate max-w-xs">{event.title}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                        <Link href="/events">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Event Details</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Banner Image */}
                        <Card variant="gradient" className="overflow-hidden">
                            <div className="h-96 relative bg-gradient-to-br from-purple-600 to-purple-900">
                                {event.bannerUrl ? (
                                    <img
                                        src={event.bannerUrl}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Calendar className="w-32 h-32 text-purple-300/30" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                                {/* Wishlist Button */}
                                <button
                                    onClick={handleWishlistToggle}
                                    disabled={wishlistLoading}
                                    className="absolute top-6 right-6 w-14 h-14 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center hover:scale-110 hover:bg-slate-800 transition-all duration-300 z-10 group"
                                >
                                    <Heart
                                        className={`w-6 h-6 transition-all duration-300 ${isInWishlist
                                            ? 'fill-red-500 text-red-500'
                                            : 'text-white group-hover:text-red-400'
                                            }`}
                                    />
                                </button>
                            </div>
                        </Card>

                        {/* Event Title & Category */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-600/20 text-purple-400 border border-purple-500/30">
                                    {event.category}
                                </span>
                                <div className="flex items-center gap-2">
                                    <StatusIcon className={`w-5 h-5 ${eventStatus.color}`} />
                                    <span className={`text-sm font-medium ${eventStatus.color}`}>
                                        {eventStatus.text}
                                    </span>
                                </div>
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-4">{event.title}</h2>
                        </div>

                        {/* Description */}
                        <Card variant="gradient">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-purple-400" />
                                    About This Event
                                </h3>
                                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {event.description}
                                </p>
                            </div>
                        </Card>

                        {/* Event Schedule */}
                        <Card variant="gradient">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-purple-400" />
                                    Event Schedule
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-sm text-slate-400">Event Start</p>
                                        <p className="text-white font-medium">{formatDate(event.eventStartDate)}</p>
                                        <p className="text-purple-400 font-medium">{event.startTime}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-slate-400">Event End</p>
                                        <p className="text-white font-medium">{formatDate(event.eventEndDate)}</p>
                                        <p className="text-purple-400 font-medium">{event.endTime}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Venue & Location */}
                        <Card variant="gradient">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-purple-400" />
                                    Venue & Location
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-slate-400 mb-1">Venue</p>
                                        <p className="text-white font-medium text-lg">{event.venue}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 mb-1">Address</p>
                                        <p className="text-slate-300">{event.address}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Organizer */}
                        <Card variant="gradient">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <Building className="w-5 h-5 text-purple-400" />
                                    Organizer
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-lg">{event.organizer}</p>
                                        <p className="text-sm text-slate-400">Event Organizer</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Guests (if any) */}
                        {event.guests && event.guests.length > 0 && (
                            <Card variant="gradient">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-purple-400" />
                                        Special Guests
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {event.guests.map((guest, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center flex-shrink-0">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                                <p className="text-slate-300 font-medium">{guest}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar - Right Side */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Registration Card */}
                        <Card variant="gradient" className="sticky top-24">
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-white mb-6">Registration</h3>

                                {/* Price */}
                                <div className="mb-6">
                                    <p className="text-sm text-slate-400 mb-2">Event Price</p>
                                    <div className="flex items-center gap-2">
                                        <IndianRupee className="w-8 h-8 text-purple-400" />
                                        <span className="text-4xl font-bold text-white">
                                            {event.price.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>

                                {/* Seats Available */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm text-slate-400">Seats Available</p>
                                        <p className="text-sm font-semibold text-purple-400">
                                            {event.availableSeats} / {event.totalSeats}
                                        </p>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500"
                                            style={{
                                                width: `${((event.totalSeats - event.availableSeats) / event.totalSeats) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {Math.round(((event.totalSeats - event.availableSeats) / event.totalSeats) * 100)}% filled
                                    </p>
                                </div>

                                {/* Registration Status */}
                                <div className="mb-6">
                                    <p className="text-sm text-slate-400 mb-2">Status</p>
                                    <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold border ${registrationStatus.color}`}>
                                        {registrationStatus.text}
                                    </span>
                                </div>

                                {/* Registration Window */}
                                <div className="mb-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                    <p className="text-xs text-slate-400 mb-3">Registration Period</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">Opens:</span>
                                            <span className="text-white font-medium">{formatShortDate(event.registrationStartDate)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">Closes:</span>
                                            <span className="text-white font-medium">{formatShortDate(event.registrationEndDate)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Register Button */}
                                <Button
                                    onClick={handleRegisterClick}
                                    className={`w-full py-6 text-lg font-semibold ${canRegister()
                                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                        }`}
                                    disabled={!canRegister()}
                                >
                                    {canRegister() ? 'Register Now' : registrationStatus.text}
                                </Button>

                                <p className="text-xs text-slate-500 text-center mt-3">
                                    Secure registration • Instant confirmation
                                </p>
                            </div>
                        </Card>

                        {/* Quick Info Card */}
                        <Card variant="gradient">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Quick Info</h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-slate-400 mb-1">Date</p>
                                            <p className="text-white font-medium">{formatShortDate(event.eventStartDate)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-slate-400 mb-1">Time</p>
                                            <p className="text-white font-medium">{event.startTime}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-slate-400 mb-1">Location</p>
                                            <p className="text-white font-medium">{event.venue}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Building className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-slate-400 mb-1">Organized by</p>
                                            <p className="text-white font-medium">{event.organizer}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

            </div>

            {/* Quantity Modal */}
            {showQuantityModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card variant="gradient" className="w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Complete Registration</h3>
                            <p className="text-slate-400 mb-6">How many seats would you like to book?</p>

                            {!bookingSuccess ? (
                                <>
                                    {/* Quantity Selector */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-slate-300 mb-3">
                                            Number of Seats
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <Button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1 || bookingLoading}
                                                className="w-12 h-12 bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"
                                            >
                                                -
                                            </Button>
                                            <div className="flex-1 text-center">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={event?.availableSeats || 1}
                                                    value={quantity}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value) || 1
                                                        setQuantity(Math.min(Math.max(1, val), event?.availableSeats || 1))
                                                    }}
                                                    disabled={bookingLoading}
                                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-center text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>
                                            <Button
                                                onClick={() => setQuantity(Math.min((event?.availableSeats || 1), quantity + 1))}
                                                disabled={quantity >= (event?.availableSeats || 1) || bookingLoading}
                                                className="w-12 h-12 bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"
                                            >
                                                +
                                            </Button>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-2">
                                            Available seats: {event?.availableSeats}
                                        </p>
                                    </div>

                                    {/* Price Summary */}
                                    <div className="mb-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-slate-400">Price per seat:</span>
                                            <div className="flex items-center gap-1">
                                                <IndianRupee className="w-4 h-4 text-slate-400" />
                                                <span className="text-white font-medium">
                                                    {event?.price.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                                            <span className="text-white font-semibold">Total Amount:</span>
                                            <div className="flex items-center gap-1">
                                                <IndianRupee className="w-5 h-5 text-purple-400" />
                                                <span className="text-2xl font-bold text-white">
                                                    {((event?.price || 0) * quantity).toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {bookingError && (
                                        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 flex items-start gap-2">
                                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-red-400">{bookingError}</p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleCloseModal}
                                            disabled={bookingLoading}
                                            variant="outline"
                                            className="flex-1 py-3"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleBooking}
                                            disabled={bookingLoading}
                                            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                                        >
                                            {bookingLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Processing...
                                                </div>
                                            ) : (
                                                'Confirm Booking'
                                            )}
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                /* Success State */
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-white mb-2">Booking Successful!</h4>
                                    <p className="text-slate-400 mb-6">
                                        Your booking for {quantity} seat{quantity > 1 ? 's' : ''} has been confirmed.
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Redirecting...
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
