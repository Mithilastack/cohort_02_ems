'use client'

import { useEffect, useState, useMemo } from 'react'
import { getAllBookings, updateBookingStatus, type AdminBooking } from '@/lib/adminApi'
import { Ticket, Filter, Users, DollarSign, CheckCircle2, Clock, XCircle } from 'lucide-react'
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

export default function BookingsManagement() {
    const [bookings, setBookings] = useState<AdminBooking[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [updateLoading, setUpdateLoading] = useState<string | null>(null)

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            setLoading(true)
            const response = await getAllBookings()
            setBookings(response.data.bookings)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load bookings')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (
        bookingId: string,
        newStatus: 'pending' | 'confirmed' | 'cancelled'
    ) => {
        try {
            setUpdateLoading(bookingId)
            await updateBookingStatus(bookingId, newStatus)
            // Optimistic update
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking._id === bookingId
                        ? { ...booking, status: newStatus }
                        : booking
                )
            )
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update booking status')
            await fetchBookings()
        } finally {
            setUpdateLoading(null)
        }
    }

    // Calculate stats
    const stats = useMemo(() => {
        const totalBookings = bookings.length
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
        const pendingBookings = bookings.filter(b => b.status === 'pending').length
        const totalRevenue = bookings
            .filter(b => b.status === 'confirmed')
            .reduce((sum, b) => sum + b.totalAmount, 0)

        return { totalBookings, confirmedBookings, pendingBookings, totalRevenue }
    }, [bookings])

    const filteredBookings = statusFilter === 'all'
        ? bookings
        : bookings.filter((b) => b.status === statusFilter)

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-transparent border border-blue-500/20 p-8">
                <div className="relative z-10">
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                            Bookings Management
                        </h1>
                        <p className="text-slate-300">Manage all event bookings and reservations</p>
                    </div>

                    {/* Stats Cards */}
                    {!loading && !error && bookings.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-400 text-sm">Total Bookings</span>
                                    <Ticket className="h-5 w-5 text-blue-400" />
                                </div>
                                <p className="text-3xl font-bold text-white">{stats.totalBookings}</p>
                            </div>

                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-400 text-sm">Confirmed</span>
                                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                                </div>
                                <p className="text-3xl font-bold text-white">{stats.confirmedBookings}</p>
                            </div>

                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-400 text-sm">Pending</span>
                                    <Clock className="h-5 w-5 text-yellow-400" />
                                </div>
                                <p className="text-3xl font-bold text-white">{stats.pendingBookings}</p>
                            </div>

                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-400 text-sm">Revenue</span>
                                    <DollarSign className="h-5 w-5 text-emerald-400" />
                                </div>
                                <p className="text-3xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Main Content Card */}
            <Card variant="gradient" className="overflow-hidden">
                {/* Filter */}
                <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-900/50 to-slate-900/20">
                    <div className="flex items-center gap-4">
                        <Filter className="h-5 w-5 text-slate-400" />
                        <div className="flex gap-2 flex-wrap">
                            {[
                                { value: 'all', label: 'All Bookings', icon: Ticket },
                                { value: 'pending', label: 'Pending', icon: Clock },
                                { value: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
                                { value: 'cancelled', label: 'Cancelled', icon: XCircle },
                            ].map(({ value, label, icon: Icon }) => (
                                <Button
                                    key={value}
                                    onClick={() => setStatusFilter(value)}
                                    className={`text-sm transition-all duration-200 ${statusFilter === value
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/30'
                                        : 'bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50'
                                        }`}
                                >
                                    <Icon className="h-4 w-4 mr-2" />
                                    {label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                        </div>
                        <p className="text-slate-400 mt-6 text-lg">Loading bookings...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-4 border border-red-500/20">
                            <XCircle className="h-10 w-10 text-red-400" />
                        </div>
                        <p className="text-red-400 text-lg font-medium">{error}</p>
                        <Button
                            onClick={fetchBookings}
                            className="mt-4 bg-red-600 hover:bg-red-700"
                        >
                            Try Again
                        </Button>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 mb-6 border border-blue-500/20">
                            <Ticket className="h-10 w-10 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No bookings found</h3>
                        <p className="text-slate-400">
                            {statusFilter === 'all'
                                ? 'No bookings have been made yet'
                                : `No ${statusFilter} bookings at the moment`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gradient-to-r from-slate-900/80 to-slate-900/40 hover:from-slate-900/80 hover:to-slate-900/40 border-slate-700/50">
                                    <TableHead className="text-slate-200 font-semibold text-sm">USER</TableHead>
                                    <TableHead className="text-slate-200 font-semibold text-sm">EVENT</TableHead>
                                    <TableHead className="text-slate-200 font-semibold text-sm">TICKETS</TableHead>
                                    <TableHead className="text-slate-200 font-semibold text-sm">AMOUNT</TableHead>
                                    <TableHead className="text-slate-200 font-semibold text-sm">STATUS</TableHead>
                                    <TableHead className="text-slate-200 font-semibold text-sm">BOOKED ON</TableHead>
                                    <TableHead className="text-slate-200 font-semibold text-sm text-right">ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBookings.map((booking, index) => (
                                    <TableRow
                                        key={booking._id}
                                        className="border-slate-700/30 hover:bg-slate-800/40 transition-all duration-200 group"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div>
                                                    <div className="text-slate-100 font-medium">{booking.user.name}</div>
                                                    <div className="text-xs text-slate-400">{booking.user.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="text-slate-100 font-medium">{booking.event.title}</div>
                                                <div className="text-xs text-slate-400">
                                                    {booking.event.venue} • {new Date(booking.event.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="bg-blue-500/10 p-1.5 rounded-md">
                                                    <Ticket className="h-4 w-4 text-blue-400" />
                                                </div>
                                                <span className="text-slate-100 font-semibold">{booking.numberOfTickets}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-100 font-bold">
                                            ₹{booking.totalAmount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    booking.status === 'confirmed' ? 'default' :
                                                        booking.status === 'pending' ? 'secondary' :
                                                            'destructive'
                                                }
                                                className={
                                                    booking.status === 'confirmed'
                                                        ? 'bg-green-600 hover:bg-green-700 border-green-500/50'
                                                        : booking.status === 'pending'
                                                            ? 'bg-yellow-600 hover:bg-yellow-700 border-yellow-500/50'
                                                            : 'bg-red-600 hover:bg-red-700 border-red-500/50'
                                                }
                                            >
                                                {booking.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-300 text-sm">
                                            {new Date(booking.bookedAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end">
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => handleStatusChange(
                                                        booking._id,
                                                        e.target.value as 'pending' | 'confirmed' | 'cancelled'
                                                    )}
                                                    disabled={updateLoading === booking._id}
                                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer
                                                        ${updateLoading === booking._id
                                                            ? 'opacity-50 cursor-not-allowed'
                                                            : 'hover:shadow-lg'
                                                        }
                                                        ${booking.status === 'confirmed'
                                                            ? 'bg-green-600/20 text-green-300 border-green-500/30 hover:bg-green-600/30 hover:shadow-green-600/30'
                                                            : booking.status === 'pending'
                                                                ? 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-600/30 hover:shadow-yellow-600/30'
                                                                : 'bg-red-600/20 text-red-300 border-red-500/30 hover:bg-red-600/30 hover:shadow-red-600/30'
                                                        }
                                                        focus:outline-none focus:ring-2 focus:ring-blue-500/50
                                                    `}
                                                >
                                                    <option value="pending" className="bg-slate-800 text-yellow-300">
                                                        ⏱ Pending
                                                    </option>
                                                    <option value="confirmed" className="bg-slate-800 text-green-300">
                                                        ✓ Confirmed
                                                    </option>
                                                    <option value="cancelled" className="bg-slate-800 text-red-300">
                                                        ✕ Cancelled
                                                    </option>
                                                </select>
                                                {updateLoading === booking._id && (
                                                    <div className="ml-2 w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                                                )}
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
