'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getAllEventsAdmin, deleteEvent, updateEventStatus, type AdminEvent } from '@/lib/adminApi'
import { Plus, Pencil, Trash2, Calendar, TrendingUp, Users2, Ticket, Eye } from 'lucide-react'
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

export default function EventsManagement() {
    const router = useRouter()
    const [events, setEvents] = useState<AdminEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
    const [statusUpdating, setStatusUpdating] = useState<string | null>(null)

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            setLoading(true)
            const response = await getAllEventsAdmin()
            setEvents(response.data.events)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load events')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (eventId: string, newStatus: 'comingsoon' | 'open' | 'closed') => {
        try {
            setStatusUpdating(eventId)
            const response = await updateEventStatus(eventId, newStatus)

            // Update the event in the local state optimistically
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event._id === eventId
                        ? { ...event, registrationStatus: newStatus }
                        : event
                )
            )
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update status')
            // Refresh to get the correct state
            await fetchEvents()
        } finally {
            setStatusUpdating(null)
        }
    }

    const handleDelete = async (eventId: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return

        try {
            setDeleteLoading(eventId)
            await deleteEvent(eventId)
            await fetchEvents()
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete event')
        } finally {
            setDeleteLoading(null)
        }
    }

    // Calculate stats
    const stats = useMemo(() => {
        const totalEvents = events.length
        const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).length
        const totalSeats = events.reduce((sum, e) => sum + e.totalSeats, 0)
        const bookedSeats = events.reduce((sum, e) => sum + (e.totalSeats - e.availableSeats), 0)

        return { totalEvents, upcomingEvents, totalSeats, bookedSeats }
    }, [events])

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-transparent border border-purple-500/20 p-8">
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
                                Events Management
                            </h1>
                            <p className="text-slate-300">Create and manage all events</p>
                        </div>
                        <Button
                            onClick={() => router.push('/admin/events/create')}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-purple-600/30 transition-all duration-200"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Create Event
                        </Button>
                    </div>


                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Main Content Card */}
            <Card variant="gradient" className="overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                        </div>
                        <p className="text-slate-400 mt-6 text-lg">Loading events...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-4 border border-red-500/20">
                            <Calendar className="h-10 w-10 text-red-400" />
                        </div>
                        <p className="text-red-400 text-lg font-medium">{error}</p>
                        <Button
                            onClick={fetchEvents}
                            className="mt-4 bg-red-600 hover:bg-red-700"
                        >
                            Try Again
                        </Button>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-purple-600/10 mb-6 border border-purple-500/20">
                            <Calendar className="h-10 w-10 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No events yet</h3>
                        <p className="text-slate-400 mb-6">Get started by creating your first event</p>
                        <Button
                            onClick={() => router.push('/admin/events/create')}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create First Event
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gradient-to-r from-slate-900/80 to-slate-900/40 hover:from-slate-900/80 hover:to-slate-900/40 border-slate-700/50">
                                    <TableHead className="text-slate-200 font-semibold text-sm">EVENT</TableHead>
                                    <TableHead className="text-slate-200 font-semibold text-sm">DATE</TableHead>
                                    <TableHead className="text-slate-200 font-semibold text-sm">VENUE</TableHead>
                                    <TableHead className="text-slate-200 font-semibold text-sm">CATEGORY</TableHead>
                                    <TableHead className="text-slate-200 font-semibold text-sm">PRICE</TableHead>
                                    <TableHead className="text-slate-200 font-semibold text-sm">SEATS</TableHead>
                                    <TableHead className="text-slate-200 font-semibold text-sm">STATUS</TableHead>
                                    <TableHead className="text-slate-200 font-semibold text-sm text-right">ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.map((event, index) => (
                                    <TableRow
                                        key={event._id}
                                        className="border-slate-700/30 hover:bg-slate-800/40 transition-all duration-200 group"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <span className="text-slate-100">{event.title}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-slate-500" />
                                                <span className="text-sm">
                                                    {new Date(event.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-300 text-sm">{event.venue}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className="capitalize bg-slate-700/50 text-slate-200 border border-slate-600/50 hover:bg-slate-700"
                                            >
                                                {event.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-100 font-semibold">
                                            ₹{event.price?.toLocaleString() || 0}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1">
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-sm font-bold text-emerald-400">
                                                            {event.availableSeats}
                                                        </span>
                                                        <span className="text-xs text-slate-500">/</span>
                                                        <span className="text-xs text-slate-400">{event.totalSeats}</span>
                                                    </div>
                                                    <div className="w-full bg-slate-700/50 rounded-full h-1 mt-1">
                                                        <div
                                                            className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-1 rounded-full transition-all"
                                                            style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <select
                                                value={event.registrationStatus || 'open'}
                                                onChange={(e) => handleStatusUpdate(event._id, e.target.value as 'comingsoon' | 'open' | 'closed')}
                                                disabled={statusUpdating === event._id}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer transition-all shadow-sm ${statusUpdating === event._id
                                                    ? 'opacity-50 cursor-wait'
                                                    : event.registrationStatus === 'open'
                                                        ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-black focus:ring-green-500 shadow-green-500/20'
                                                        : event.registrationStatus === 'comingsoon'
                                                            ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black focus:ring-yellow-500 shadow-yellow-500/20'
                                                            : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-black focus:ring-red-500 shadow-red-500/20'
                                                    }`}
                                            >
                                                <option value="comingsoon">Coming Soon</option>
                                                <option value="open">Open</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    onClick={() => router.push(`/admin/events/${event._id}`)}
                                                    className="bg-purple-600/90 hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-600/30 text-xs px-3 py-2 transition-all duration-200"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    onClick={() => router.push(`/admin/events/${event._id}/edit`)}
                                                    className="bg-blue-600/90 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/30 text-xs px-3 py-2 transition-all duration-200"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(event._id)}
                                                    disabled={deleteLoading === event._id}
                                                    className="bg-red-600/90 hover:bg-red-600 hover:shadow-lg hover:shadow-red-600/30 text-xs px-3 py-2 transition-all duration-200 disabled:opacity-50"
                                                >
                                                    {deleteLoading === event._id ? (
                                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    )}
                                                </Button>
                                            </div>
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
