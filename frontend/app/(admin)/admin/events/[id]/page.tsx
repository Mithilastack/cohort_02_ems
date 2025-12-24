'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getEventWithBookings, type EventWithBookings } from '@/lib/adminApi'
import { ArrowLeft, Calendar, MapPin, Users2, TrendingUp, DollarSign, Ticket, Mail, Phone, User } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import Link from 'next/link'

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [data, setData] = useState<EventWithBookings | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [eventId, setEventId] = useState<string | null>(null)

    useEffect(() => {
        // Unwrap the params promise first
        params.then((resolvedParams) => {
            setEventId(resolvedParams.id)
        })
    }, [params])

    useEffect(() => {
        if (eventId) {
            fetchEventDetails()
        }
    }, [eventId])

    const fetchEventDetails = async () => {
        if (!eventId) return

        try {
            setLoading(true)
            const response = await getEventWithBookings(eventId)
            setData(response.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load event details')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <p className="text-slate-400 mt-6 text-lg">Loading event details...</p>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-4 border border-red-500/20">
                    <Calendar className="h-10 w-10 text-red-400" />
                </div>
                <p className="text-red-400 text-lg font-medium mb-4">{error || 'Event not found'}</p>
                <Button
                    onClick={() => router.push('/admin/events')}
                    className="bg-purple-600 hover:bg-purple-700"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Events
                </Button>
            </div>
        )
    }

    const { event, bookings, summary } = data

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button
                    onClick={() => router.push('/admin/events')}
                    variant="outline"
                    className="border-slate-700 hover:bg-slate-800"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Events
                </Button>
            </div>

            {/* Event Details Card */}
            <Card variant="gradient" className="p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Event Banner */}
                    {event.bannerUrl && (
                        <div className="lg:w-1/3">
                            <img
                                src={event.bannerUrl}
                                alt={event.title}
                                className="w-full h-64 object-cover rounded-xl shadow-lg"
                            />
                        </div>
                    )}

                    {/* Event Info */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold text-white">{event.title}</h1>
                                <Badge
                                    className={`capitalize ${event.registrationStatus === 'open'
                                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                        : event.registrationStatus === 'comingsoon'
                                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                            : 'bg-red-500/20 text-red-300 border-red-500/30'
                                        }`}
                                >
                                    {event.registrationStatus || 'open'}
                                </Badge>
                            </div>
                            <Badge variant="secondary" className="capitalize">
                                {event.category}
                            </Badge>
                        </div>

                        <p className="text-slate-300 text-lg">{event.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <div className="flex items-center gap-3 text-slate-300">
                                <Calendar className="h-5 w-5 text-purple-400" />
                                <div>
                                    <p className="text-xs text-slate-500">Date & Time</p>
                                    <p className="font-semibold">
                                        {new Date(event.date).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                        {event.time && ` • ${event.time}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-300">
                                <MapPin className="h-5 w-5 text-purple-400" />
                                <div>
                                    <p className="text-xs text-slate-500">Venue</p>
                                    <p className="font-semibold">{event.venue}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-300">
                                <DollarSign className="h-5 w-5 text-purple-400" />
                                <div>
                                    <p className="text-xs text-slate-500">Price</p>
                                    <p className="font-semibold">₹{event.price?.toLocaleString() || 0}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-300">
                                <Ticket className="h-5 w-5 text-purple-400" />
                                <div>
                                    <p className="text-xs text-slate-500">Seats</p>
                                    <p className="font-semibold">
                                        {event.availableSeats} / {event.totalSeats} Available
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card variant="gradient" className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <Users2 className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Total Bookings</p>
                            <p className="text-2xl font-bold text-white">{summary.totalBookings}</p>
                        </div>
                    </div>
                </Card>

                <Card variant="gradient" className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-xl">
                            <Ticket className="h-6 w-6 text-green-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Seats Booked</p>
                            <p className="text-2xl font-bold text-white">{summary.totalSeatsBooked}</p>
                        </div>
                    </div>
                </Card>

                <Card variant="gradient" className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <TrendingUp className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Confirmed</p>
                            <p className="text-2xl font-bold text-white">{summary.confirmedBookings}</p>
                        </div>
                    </div>
                </Card>

                <Card variant="gradient" className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/20 rounded-xl">
                            <DollarSign className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Total Revenue</p>
                            <p className="text-2xl font-bold text-white">₹{summary.totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Bookings Table */}
            <Card variant="gradient" className="overflow-hidden">
                <div className="p-6 border-b border-slate-700/50">
                    <h2 className="text-2xl font-bold text-white">User Bookings</h2>
                    <p className="text-slate-400 mt-1">All users who have booked this event</p>
                </div>

                {bookings.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-purple-600/10 mb-6 border border-purple-500/20">
                            <Users2 className="h-10 w-10 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No bookings yet</h3>
                        <p className="text-slate-400">This event hasn't been booked by anyone yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gradient-to-r from-slate-900/80 to-slate-900/40 hover:from-slate-900/80 hover:to-slate-900/40 border-slate-700/50">
                                    <TableHead className="text-slate-200 font-semibold">USER</TableHead>
                                    <TableHead className="text-slate-200 font-semibold">CONTACT</TableHead>
                                    <TableHead className="text-slate-200 font-semibold">TICKETS</TableHead>
                                    <TableHead className="text-slate-200 font-semibold">AMOUNT</TableHead>
                                    <TableHead className="text-slate-200 font-semibold">STATUS</TableHead>
                                    <TableHead className="text-slate-200 font-semibold">BOOKED ON</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.map((booking, index) => (
                                    <TableRow
                                        key={booking._id}
                                        className="border-slate-700/30 hover:bg-slate-800/40 transition-all duration-200 group"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <TableCell>
                                            <Link href={`/admin/users/${booking.user._id}`}>
                                                <div className="flex items-center gap-3 cursor-pointer hover:text-purple-400 transition-colors">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                        {booking.user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-100">{booking.user.name}</p>
                                                        <p className="text-xs text-slate-500">
                                                            Joined {new Date(booking.user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                                    <Mail className="h-3.5 w-3.5 text-slate-500" />
                                                    <span>{booking.user.email}</span>
                                                </div>
                                                {booking.user.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                                        <Phone className="h-3.5 w-3.5 text-slate-500" />
                                                        <span>{booking.user.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Ticket className="h-4 w-4 text-purple-400" />
                                                <span className="font-semibold text-slate-100">{booking.quantity}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-emerald-400">
                                                ₹{booking.totalAmount.toLocaleString()}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`capitalize ${booking.status === 'confirmed'
                                                    ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                                    : booking.status === 'pending'
                                                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                                        : 'bg-red-500/20 text-red-300 border-red-500/30'
                                                    }`}
                                            >
                                                {booking.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-300">
                                            {new Date(booking.bookedAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </Card>
        </div>
    )
}
