const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export interface Event {
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
    isInWishlist?: boolean
}

export interface EventsResponse {
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

export interface FetchEventsParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
}

export const fetchEvents = async ({ page = 1, limit = 9, search = '', category = '' }: FetchEventsParams = {}): Promise<EventsResponse> => {


    // Build query parameters
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: search,
        category: category === 'All Categories' ? '' : category
    })

    const response = await fetch(`${apiUrl}/events?${params.toString()}`)

    if (!response.ok) {
        throw new Error('Failed to fetch events')
    }

    return response.json()
}