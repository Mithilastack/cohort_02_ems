'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getUserDetails, type UserDetails } from '@/lib/adminApi'
import {
    User, Mail, Phone, Calendar, Shield, MapPin,
    Ticket, Heart, ArrowLeft, Clock, CreditCard
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function UserDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [data, setData] = useState<UserDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState<'profile' | 'wishlist' | 'bookings'>('profile')

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true)
                const response = await getUserDetails(params.id as string)
                setData(response.data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load user details')
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchDetails()
        }
    }, [params.id])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400">Loading user details...</p>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="p-4 bg-red-500/10 rounded-full mb-4">
                    <User className="h-8 w-8 text-red-400" />
                </div>
                <p className="text-red-400 text-lg mb-4">{error || 'User not found'}</p>
                <Button onClick={() => router.back()} variant="outline">
                    Go Back
                </Button>
            </div>
        )
    }

    const { user, bookings } = data

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4 text-slate-400 hover:text-white pl-0"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Users
                </Button>
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-transparent border border-purple-500/20 p-8">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-purple-500/20 flex items-center justify-center">
                            <span className="text-3xl font-bold text-purple-400">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                            <div className="flex flex-wrap gap-3">
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                    {user.role}
                                </Badge>
                                <Badge variant={user.isBlocked ? 'destructive' : 'success'}>
                                    {user.isBlocked ? 'Blocked' : 'Active'}
                                </Badge>
                                <span className="text-slate-400 text-sm flex items-center bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
                                    <Clock className="h-3 w-3 mr-2" />
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg w-fit border border-slate-700">
                {(['profile', 'wishlist', 'bookings'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                            px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize
                            ${activeTab === tab
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                            }
                        `}
                    >
                        {tab}
                        {tab === 'wishlist' && (
                            <span className="ml-2 bg-slate-900/50 px-1.5 py-0.5 rounded-full text-xs">
                                {user.wishlist.length}
                            </span>
                        )}
                        {tab === 'bookings' && (
                            <span className="ml-2 bg-slate-900/50 px-1.5 py-0.5 rounded-full text-xs">
                                {bookings.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card variant="gradient" className="p-6">
                            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                <User className="h-5 w-5 text-purple-400" />
                                Personal Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                                    <Mail className="h-5 w-5 text-slate-400 mr-4" />
                                    <div>
                                        <p className="text-sm text-slate-500">Email Address</p>
                                        <p className="text-slate-200">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                                    <Phone className="h-5 w-5 text-slate-400 mr-4" />
                                    <div>
                                        <p className="text-sm text-slate-500">Phone Number</p>
                                        <p className="text-slate-200">{user.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                                    <Shield className="h-5 w-5 text-slate-400 mr-4" />
                                    <div>
                                        <p className="text-sm text-slate-500">Account Role</p>
                                        <p className="text-slate-200 capitalize">{user.role}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card variant="gradient" className="p-6">
                            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-purple-400" />
                                Activity Summary
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                                    <p className="text-2xl font-bold text-white mb-1">{bookings.length}</p>
                                    <p className="text-sm text-slate-400">Total Bookings</p>
                                </div>
                                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                                    <p className="text-2xl font-bold text-white mb-1">{user.wishlist.length}</p>
                                    <p className="text-sm text-slate-400">Wishlist Items</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Wishlist Tab */}
                {activeTab === 'wishlist' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {user.wishlist.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-slate-400 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                                <Heart className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>No items in wishlist</p>
                            </div>
                        ) : (
                            user.wishlist.map((event) => (
                                <Card key={event._id} className="overflow-hidden group hover:border-purple-500/50 transition-all">
                                    <div className="aspect-video relative bg-slate-800">
                                        {event.bannerUrl ? (
                                            <img
                                                src={event.bannerUrl}
                                                alt={event.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2">
                                            <Badge className="bg-slate-900/80 backdrop-blur-sm border-0">
                                                {event.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-semibold text-white mb-2 line-clamp-1">{event.title}</h4>
                                        <div className="flex items-center text-sm text-slate-400 mb-2">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {new Date(event.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center text-sm text-slate-400">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            {event.venue}
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                    <Card variant="gradient" className="overflow-hidden">
                        {bookings.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <Ticket className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>No booking history</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-900/50 hover:bg-slate-900/50 border-slate-800">
                                            <TableHead className="text-slate-300">Event</TableHead>
                                            <TableHead className="text-slate-300">Date</TableHead>
                                            <TableHead className="text-slate-300">Tickets</TableHead>
                                            <TableHead className="text-slate-300">Total Price</TableHead>
                                            <TableHead className="text-slate-300">Status</TableHead>
                                            <TableHead className="text-slate-300">Booked On</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {bookings.map((booking) => (
                                            <TableRow
                                                key={booking._id}
                                                className="border-slate-800 hover:bg-slate-800/30 cursor-pointer"
                                                onClick={() => router.push('/admin/bookings')}
                                            >
                                                <TableCell className="font-medium text-slate-200">
                                                    {booking.event.title}
                                                </TableCell>
                                                <TableCell className="text-slate-400">
                                                    {new Date(booking.event.date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-slate-400">
                                                    {booking.numberOfTickets}
                                                </TableCell>
                                                <TableCell className="text-slate-200">
                                                    ₹{booking.totalAmount}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            booking.status === 'confirmed' ? 'success' :
                                                                booking.status === 'cancelled' ? 'destructive' : 'secondary'
                                                        }
                                                        className="capitalize"
                                                    >
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
                        )}
                    </Card>
                )}
            </div>
        </div>
    )
}
