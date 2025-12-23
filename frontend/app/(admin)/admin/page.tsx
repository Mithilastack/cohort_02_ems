'use client'

import { useEffect, useState } from 'react'
import { getDashboardStats, type DashboardStats } from '@/lib/adminApi'
import {
    Users,
    Calendar,
    Ticket,
    DollarSign,
    TrendingUp,
    Activity
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await getDashboardStats()
                setStats(response.data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load dashboard')
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-slate-400">Loading dashboard...</div>
            </div>
        )
    }

    if (error || !stats) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-red-400">{error || 'Failed to load dashboard'}</div>
            </div>
        )
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Total Events',
            value: stats.totalEvents,
            icon: Calendar,
            color: 'from-purple-500 to-purple-600',
        },
        {
            title: 'Total Bookings',
            value: stats.totalBookings,
            icon: Ticket,
            color: 'from-green-500 to-green-600',
        },
        {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'from-orange-500 to-orange-600',
        },
    ]

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "success" | "warning" | "destructive"> = {
            confirmed: 'success',
            pending: 'warning',
            cancelled: 'destructive',
        }
        return variants[status] || 'default'
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-slate-400">Overview of your event management system</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title} variant="gradient" className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Bookings by Status */}
            <Card variant="gradient" className="p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Bookings by Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.bookingsByStatus.map((item) => (
                        <div key={item._id} className="bg-slate-800/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-300 capitalize">
                                    {item._id}
                                </span>
                                <Badge variant={getStatusBadge(item._id)}>{item.count}</Badge>
                            </div>
                            <p className="text-2xl font-bold text-white">
                                ₹{item.revenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Revenue</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Recent Bookings */}
            <Card variant="gradient" className="p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Bookings
                </h2>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-slate-300">User</TableHead>
                                <TableHead className="text-slate-300">Event</TableHead>
                                <TableHead className="text-slate-300">Tickets</TableHead>
                                <TableHead className="text-slate-300">Amount</TableHead>
                                <TableHead className="text-slate-300">Status</TableHead>
                                <TableHead className="text-slate-300">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.recentBookings.map((booking) => (
                                <TableRow key={booking._id}>
                                    <TableCell className="text-slate-200">
                                        <div>
                                            <div className="font-medium">{booking.user.name}</div>
                                            <div className="text-sm text-slate-400">{booking.user.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-200">
                                        <div>
                                            <div className="font-medium">{booking.event.title}</div>
                                            <div className="text-sm text-slate-400">{booking.event.venue}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-200">{booking.numberOfTickets}</TableCell>
                                    <TableCell className="text-slate-200 font-semibold">
                                        ₹{booking.totalAmount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadge(booking.status)}>
                                            {booking.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-sm">
                                        {new Date(booking.bookedAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Popular Events */}
            <Card variant="gradient" className="p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Popular Events
                </h2>
                <div className="space-y-4">
                    {stats.popularEvents.map((event, index) => (
                        <div
                            key={event._id}
                            className="flex items-center justify-between bg-slate-800/50 rounded-lg p-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{event.title}</h3>
                                    <p className="text-sm text-slate-400">{event.venue}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-white">{event.bookingCount} bookings</p>
                                <p className="text-sm text-slate-400">₹{event.totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
