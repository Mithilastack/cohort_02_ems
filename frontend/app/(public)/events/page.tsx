'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Calendar, MapPin, Users, IndianRupee, Filter, ChevronLeft, ChevronRight, Sparkles, Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'


import { fetchEvents, Event, EventsResponse } from '@/lib/eventApi'
import { fetchWishlist, addToWishlist, removeFromWishlist, WishlistEvent } from '@/lib/wishlistApi'

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

function EventsContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const categoriesRef = useRef<HTMLDivElement>(null)

    const [events, setEvents] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    // Wishlist
    const [wishlistEventIds, setWishlistEventIds] = useState<Set<string>>(new Set())
    const [wishlistLoading, setWishlistLoading] = useState<Record<string, boolean>>({})

    // Pagination & Filters
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalEvents, setTotalEvents] = useState(0)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All Categories')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    // Fetch wishlist on mount
    useEffect(() => {
        const loadWishlist = async () => {
            try {
                const data = await fetchWishlist()
                if (data.success) {
                    const ids = new Set(data.data.wishlist.map(event => event._id))
                    setWishlistEventIds(ids)
                }
            } catch (err) {
                // User might not be logged in, silently fail
                console.log('Could not fetch wishlist:', err)
            }
        }

        loadWishlist()
    }, [])

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
        const loadEvents = async () => {
            try {
                setIsLoading(true)
                setError('')

                const data = await fetchEvents({
                    page: currentPage,
                    limit: 9,
                    search: debouncedSearch,
                    category: selectedCategory
                })

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

        loadEvents()
    }, [currentPage, debouncedSearch, selectedCategory])

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category)
        setCurrentPage(1) // Reset to page 1 on filter change
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleWishlistToggle = async (eventId: string, e: React.MouseEvent) => {
        e.stopPropagation() // Prevent navigation to event details

        // Check if user is logged in
        const token = typeof window !== 'undefined'
            ? document.cookie
                .split('; ')
                .find(row => row.startsWith('token='))
                ?.split('=')[1]
            : null

        if (!token) {
            router.push('/login?redirect=/events')
            return
        }

        const isInWishlist = wishlistEventIds.has(eventId)

        // Optimistic update
        setWishlistEventIds(prev => {
            const newSet = new Set(prev)
            if (isInWishlist) {
                newSet.delete(eventId)
            } else {
                newSet.add(eventId)
            }
            return newSet
        })

        setWishlistLoading(prev => ({ ...prev, [eventId]: true }))

        try {
            if (isInWishlist) {
                await removeFromWishlist(eventId)
            } else {
                await addToWishlist(eventId)
            }
        } catch (err) {
            // Rollback on error
            setWishlistEventIds(prev => {
                const newSet = new Set(prev)
                if (isInWishlist) {
                    newSet.add(eventId)
                } else {
                    newSet.delete(eventId)
                }
                return newSet
            })
            console.error('Wishlist error:', err)
        } finally {
            setWishlistLoading(prev => ({ ...prev, [eventId]: false }))
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getStatusStyle = (status: string) => {
        const styles = {
            open: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
            closed: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
            full: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }
        return styles[status as keyof typeof styles] || styles.closed
    }

    // Scroll active category into center
    useEffect(() => {
        if (categoriesRef.current) {
            const activeCategory = categoriesRef.current.querySelector('[data-active="true"]')
            if (activeCategory) {
                activeCategory.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
            }
        }
    }, [selectedCategory])

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30">

            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
                <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-indigo-500/5 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col min-h-screen mt-20">

                {/* Header Section */}
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-sm">
                        Discover <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Events</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Explore and join extraordinary experiences happening around you.
                    </p>
                </div>

                {/* Filters & Search Container */}
                <div className="sticky top-4 z-20 mb-10 space-y-4">
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-2xl p-4 shadow-2xl ring-1 ring-white/5">
                        <div className="flex flex-col md:flex-row gap-6 items-center">

                            {/* Search */}
                            <div className="relative w-full md:w-96 group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                                <div className="relative flex items-center bg-slate-800/80 rounded-xl overflow-hidden border border-white/10 focus-within:border-purple-500/50 transition-colors">
                                    <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search events..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-4 text-xs text-slate-500 hover:text-white transition-colors"
                                        >
                                            CLEAR
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Divider (Desktop) */}
                            <div className="hidden md:block h-8 w-px bg-white/10"></div>

                            {/* Categories */}
                            <div className="w-full overflow-hidden relative">
                                <div
                                    ref={categoriesRef}
                                    className="flex w-full overflow-x-auto gap-2 pb-2 md:pb-0 scrollbars-hidden mask-linear-fade"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    {CATEGORIES.map(category => (
                                        <button
                                            key={category}
                                            data-active={selectedCategory === category}
                                            onClick={() => handleCategoryChange(category)}
                                            className={`
                                                whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                                                border flex-shrink-0
                                                ${selectedCategory === category
                                                    ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] scale-105'
                                                    : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-white/10'
                                                }
                                            `}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                                {/* Fade indicators for scroll */}
                                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-slate-900/60 to-transparent pointer-events-none md:hidden"></div>
                                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-900/60 to-transparent pointer-events-none md:hidden"></div>
                            </div>

                        </div>
                    </div>

                    {/* Results Status */}
                    <div className="flex justify-between items-center px-2">
                        <div className="text-sm font-medium text-slate-400">
                            Showing <span className="text-purple-400">{events.length}</span> results
                            {totalEvents > 0 && <span className="text-slate-600"> of {totalEvents}</span>}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {error && (
                        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-300 text-center backdrop-blur-sm">
                            <p className="font-semibold">Unable to load events</p>
                            <p className="text-sm opacity-80 mt-1">{error}</p>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="h-[420px] rounded-3xl bg-slate-800/40 animate-pulse border border-white/5"></div>
                            ))}
                        </div>
                    ) : events.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10">
                                <Sparkles className="w-10 h-10 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-300 mb-2">No events found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto mb-8">
                                We couldn't find any events matching your current filters. Try changing categories or search terms.
                            </p>
                            <Button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedCategory('All Categories')
                                }}
                                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8"
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                            {events.map(event => (
                                <div
                                    key={event._id}
                                    className="group relative bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/20 flex flex-col text-left"
                                    onClick={() => router.push(`/events/${event._id}`)}
                                >

                                    {/* Image Container */}
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

                                        {/* Wishlist Button */}
                                        <button
                                            onClick={(e) => handleWishlistToggle(event._id, e)}
                                            disabled={wishlistLoading[event._id]}
                                            className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center hover:scale-110 hover:bg-slate-800 transition-all duration-300 z-10"
                                        >
                                            <Heart
                                                className={`w-5 h-5 transition-all duration-300 ${wishlistEventIds.has(event._id)
                                                    ? 'fill-red-500 text-red-500'
                                                    : 'text-white hover:text-red-400'
                                                    }`}
                                            />
                                        </button>

                                        {/* Floating Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/10 text-white shadow-lg">
                                                {event.category}
                                            </span>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="absolute top-4 right-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border ${getStatusStyle(event.computedRegistrationStatus || event.registrationStatus)}`}>
                                                {(event.computedRegistrationStatus || event.registrationStatus).toUpperCase()}
                                            </span>
                                        </div>
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
                                                <span>{event.time}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6 flex-grow">
                                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                                <MapPin className="w-4 h-4 text-purple-500/70" />
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
                                            <Button
                                                size="sm"
                                                className="rounded-full px-6 bg-white text-slate-900 font-semibold hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                            >
                                                Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center pb-12">
                        <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-full p-2 flex gap-2 shadow-xl">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="rounded-full w-10 h-10 hover:bg-white/5 text-slate-400 disabled:opacity-30"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>

                            <div className="flex items-center px-4 gap-2">
                                <span className="text-sm text-slate-400">Page</span>
                                <span className="text-white font-bold">{currentPage}</span>
                                <span className="text-sm text-slate-600">of {totalPages}</span>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="rounded-full w-10 h-10 hover:bg-white/5 text-slate-400 disabled:opacity-30"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function EventsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30">
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
                    <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-indigo-500/5 rounded-full blur-[80px]" />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col min-h-screen mt-20">
                    <div className="text-center mb-12 space-y-4">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-sm">
                            Discover <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Events</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                            Loading events...
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-[420px] rounded-3xl bg-slate-800/40 animate-pulse border border-white/5"></div>
                        ))}
                    </div>
                </div>
            </div>
        }>
            <EventsContent />
        </Suspense>
    )
}