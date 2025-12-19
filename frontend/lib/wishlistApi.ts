const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Get authentication token from cookies
const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1]
        return token || null
    }
    return null
}

// Wishlist API Response Types
export interface WishlistEvent {
    _id: string
    title: string
    description: string
    venue: string
    category: string
    bannerUrl: string
    totalSeats: number
    availableSeats: number
    price: number
    date: string
    time: string
    registrationStatus: string
    computedRegistrationStatus?: string
}

export interface WishlistResponse {
    success: boolean
    message: string
    data: {
        wishlist: WishlistEvent[]
    }
}

export interface WishlistActionResponse {
    success: boolean
    message: string
    data?: {
        eventId: string
    }
}

/**
 * Fetch user's wishlist
 */
export const fetchWishlist = async (): Promise<WishlistResponse> => {
    const token = getAuthToken()

    if (!token) {
        throw new Error('Authentication required. Please login to view your wishlist.')
    }

    const response = await fetch(`${apiUrl}/wishlist`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to fetch wishlist')
    }

    return response.json()
}

/**
 * Add event to wishlist
 */
export const addToWishlist = async (eventId: string): Promise<WishlistActionResponse> => {
    const token = getAuthToken()

    if (!token) {
        throw new Error('Authentication required. Please login to add events to wishlist.')
    }

    const response = await fetch(`${apiUrl}/wishlist/${eventId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to add to wishlist')
    }

    return response.json()
}

/**
 * Remove event from wishlist
 */
export const removeFromWishlist = async (eventId: string): Promise<WishlistActionResponse> => {
    const token = getAuthToken()

    if (!token) {
        throw new Error('Authentication required. Please login to manage your wishlist.')
    }

    const response = await fetch(`${apiUrl}/wishlist/${eventId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to remove from wishlist')
    }

    return response.json()
}

/**
 * Check if event is in wishlist
 */
export const isEventInWishlist = (eventId: string, wishlist: WishlistEvent[]): boolean => {
    return wishlist.some(event => event._id === eventId)
}