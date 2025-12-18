'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Calendar, MapPin, Users, IndianRupee, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface Event {
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
    registrationStatus: string
    computedRegistrationStatus: string
}

interface EventsResponse {
    success: boolean
    message: string
    data: {
        events: Event[]
        pagination: {
            page: number
            limit: number
            total: number
            pages: number
        }
    }
}

const CATEGORIES = [
    'All Categories',
    'Technology',
    'Business',
    'Music',
    'Sports',
    'Fashion',
    'E Sports',
    'Education',
    'Art & Culture',
    'Food & Drink',
    'Health & Wellness',
    'Entertainment'
]

export default function EventsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [events, setEvents] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    // Pagination & Filters
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalEvents, setTotalEvents] = useState(0)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All Categories')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
            setCurrentPage(1) // Reset to page 1 on search
        }, 500)

        return () => clearTimeout(timer)
    }, [searchQuery])

    // Fetch events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true)
                setError('')

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

                // Build query parameters
                const params = new URLSearchParams({
                    page: currentPage.toString(),
                    limit: '9', // 3x3 grid
                    search: debouncedSearch,
                    category: selectedCategory === 'All Categories' ? '' : selectedCategory
                })

                const response = await fetch(`${apiUrl}/events?${params.toString()}`)

                if (!response.ok) {
                    throw new Error('Failed to fetch events')
                }

                const data: EventsResponse = await response.json()

                if (data.success) {
                    setEvents(data.data.events)
                    setTotalPages(data.data.pagination.pages)
                    setTotalEvents(data.data.pagination.total)
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch events')
            } finally {
                setIsLoading(false)
            }
        }

        fetchEvents()
    }, [currentPage, debouncedSearch, selectedCategory])

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category)
        setCurrentPage(1) // Reset to page 1 on filter change
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getStatusBadge = (status: string) => {
        const badges = {
            open: 'bg-green-500/20 text-green-400 border-green-500/30',
            closed: 'bg-red-500/20 text-red-400 border-red-500/30',
            full: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
        }
        return badges[status as keyof typeof badges] || badges.closed
    }

    if (isLoading && events.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading events...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Header */}
            <div className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Discover <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Amazing Events</span>
                        </h1>
                        <p className="text-slate-400">Browse and register for upcoming events</p>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="sm:w-64 relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer"
                            >
                                {CATEGORIES.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    {!isLoading && (
                        <div className="mt-4 text-sm text-slate-400">
                            Found <span className="text-purple-400 font-semibold">{totalEvents}</span> events
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                        {error}
                    </div>
                )}

                {events.length === 0 && !isLoading ? (
                    <Card variant="gradient" className="p-12 text-center">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                        <h3 className="text-xl font-semibold text-slate-300 mb-2">No events found</h3>
                        <p className="text-slate-400 mb-6">
                            {searchQuery || selectedCategory !== 'All Categories'
                                ? 'Try adjusting your search or filters'
                                : 'Check back soon for upcoming events'}
                        </p>
                        {(searchQuery || selectedCategory !== 'All Categories') && (
                            <Button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedCategory('All Categories')
                                }}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                Clear Filters
                            </Button>
                        )}
                    </Card>
                ) : (
                    <>
                        {/* Events Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {events.map(event => (
                                <Card
                                    key={event._id}
                                    variant="gradient"
                                    className="overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                                    onClick={() => router.push(`/events/${event._id}`)}
                                >
                                    {/* Event Banner */}
                                    <div className="h-56 relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-900">
                                        {event.bannerUrl ? (
                                            <img
                                                src={event.bannerUrl}
                                                alt={event.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Calendar className="w-20 h-20 text-purple-300/30" />
                                            </div>
                                        )}

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

                                        {/* Category Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-600/90 text-white backdrop-blur-sm border border-purple-400/30">
                                                {event.category}
                                            </span>
                                        </div>

                                        {/* Registration Status Badge */}
                                        <div className="absolute top-3 right-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${getStatusBadge(event.computedRegistrationStatus || event.registrationStatus)}`}>
                                                {(event.computedRegistrationStatus || event.registrationStatus).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Event Details */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors">
                                            {event.title}
                                        </h3>

                                        <div className="space-y-2 text-sm text-slate-400 mb-4">
                                            {/* Date & Time */}
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 flex-shrink-0 text-purple-400" />
                                                <span>{formatDate(event.date)} • {event.time}</span>
                                            </div>

                                            {/* Venue */}
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 flex-shrink-0 text-purple-400" />
                                                <span className="line-clamp-1">{event.venue}</span>
                                            </div>

                                            {/* Seats */}
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 flex-shrink-0 text-purple-400" />
                                                <span>
                                                    {event.availableSeats} / {event.totalSeats} seats available
                                                </span>
                                            </div>
                                        </div>

                                        {/* Seats Progress Bar */}
                                        <div className="mb-4">
                                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500"
                                                    style={{
                                                        width: `${((event.totalSeats - event.availableSeats) / event.totalSeats) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="border-t border-slate-700 pt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <IndianRupee className="w-5 h-5 text-purple-400" />
                                                <span className="text-2xl font-bold text-purple-400">
                                                    {event.price.toLocaleString('en-IN')}
                                                </span>
                                            </div>

                                            <Button
                                                size="sm"
                                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    router.push(`/events/${event._id}`)
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>

                                <div className="flex gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                        // Show first page, last page, current page, and pages around current
                                        const showPage =
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)

                                        if (!showPage) {
                                            // Show ellipsis
                                            if (page === currentPage - 2 || page === currentPage + 2) {
                                                return (
                                                    <span key={page} className="px-3 py-2 text-slate-500">
                                                        ...
                                                    </span>
                                                )
                                            }
                                            return null
                                        }

                                        return (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? 'default' : 'outline'}
                                                onClick={() => handlePageChange(page)}
                                                className={
                                                    currentPage === page
                                                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                                        : ''
                                                }
                                            >
                                                {page}
                                            </Button>
                                        )
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}