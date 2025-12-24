const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper function to get token from cookies
function getToken(): string | null {
    if (typeof document === 'undefined') return null;
    const cookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    return cookie ? cookie.split('=')[1] : null;
}

// ========== Admin Dashboard Stats ==========
export interface DashboardStats {
    totalUsers: number;
    totalEvents: number;
    totalBookings: number;
    totalRevenue: number;
    bookingsByStatus: Array<{
        _id: string;
        count: number;
        revenue: number;
    }>;
    recentBookings: Array<{
        _id: string;
        user: {
            _id: string;
            name: string;
            email: string;
        };
        event: {
            _id: string;
            title: string;
            date: string;
            venue: string;
        };
        numberOfTickets: number;
        totalAmount: number;
        status: string;
        bookedAt: string;
    }>;
    popularEvents: Array<{
        _id: string;
        bookingCount: number;
        totalRevenue: number;
        title: string;
        date: string;
        venue: string;
    }>;
}

export async function getDashboardStats(): Promise<{ success: boolean; data: DashboardStats }> {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${url}/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch dashboard stats');
    }

    return await response.json();
}

// ========== User Management ==========
export interface AdminUser {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    isBlocked: boolean;
    createdAt: string;
}

export interface UsersResponse {
    users: AdminUser[];
    pagination: {
        total: number;
        page: number;
        pages: number;
        limit: number;
    };
}

export async function getAllUsers(params?: {
    search?: string;
    isBlocked?: string;
    page?: number;
    limit?: number;
}): Promise<{ success: boolean; data: UsersResponse }> {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.isBlocked) queryParams.append('isBlocked', params.isBlocked);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${url}/admin/users?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch users');
    }

    return await response.json();
}

export async function updateUserStatus(
    userId: string,
    isBlocked: boolean
): Promise<{ success: boolean; message: string }> {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${url}/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isBlocked }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user status');
    }

    return await response.json();
}


export interface UserDetails {
    user: AdminUser & {
        wishlist: Array<{
            _id: string;
            title: string;
            date: string;
            venue: string;
            category: string;
            price: number;
            bannerUrl?: string;
        }>;
    };
    bookings: Array<{
        _id: string;
        event: {
            _id: string;
            title: string;
            date: string;
            venue: string;
            bannerUrl?: string;
        };
        numberOfTickets: number;
        totalAmount: number;
        status: 'pending' | 'confirmed' | 'cancelled';
        bookedAt: string;
    }>;
}

export async function getUserDetails(userId: string): Promise<{ success: boolean; data: UserDetails }> {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${url}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch user details');
    }

    return await response.json();
}

// ========== Event Management ==========

export interface AdminEvent {
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    category: string;
    price: number;
    totalSeats: number;
    availableSeats: number;
    organizer: string;
    bannerUrl?: string;
    address?: string;
    registrationStartDate?: string;
    registrationEndDate?: string;
    eventStartDate?: string;
    eventEndDate?: string;
    startTime?: string;
    endTime?: string;
    guests?: Array<{
        name: string;
        role: string;
        bio?: string;
        imageUrl?: string;
    }>;
    registrationStatus?: 'comingsoon' | 'open' | 'closed';
    createdAt: string;
}

export async function getAllEventsAdmin(): Promise<{ success: boolean; data: { events: AdminEvent[] } }> {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${url}/events`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch events');
    }

    return await response.json();
}

export async function getEventById(eventId: string): Promise<{ success: boolean; data: { event: AdminEvent } }> {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${url}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch event');
    }

    return await response.json();
}

// Get event details with bookings and user information
export interface EventWithBookings {
    event: AdminEvent;
    bookings: Array<{
        _id: string;
        user: {
            _id: string;
            name: string;
            email: string;
            phone?: string;
            createdAt: string;
        };
        quantity: number;
        totalAmount: number;
        status: 'pending' | 'confirmed' | 'cancelled';
        bookedAt: string;
    }>;
    summary: {
        totalBookings: number;
        confirmedBookings: number;
        pendingBookings: number;
        cancelledBookings: number;
        totalRevenue: number;
        totalSeatsBooked: number;
    };
}

export async function getEventWithBookings(eventId: string): Promise<{ success: boolean; data: EventWithBookings }> {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${url}/events/${eventId}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch event details');
    }

    return await response.json();
}


export async function createEvent(formData: FormData): Promise<{ success: boolean; message: string }> {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${url}/events`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create event');
    }

    return await response.json();
}

export async function updateEvent(eventId: string, formData: FormData): Promise<{ success: boolean; message: string }> {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${url}/events/${eventId}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update event');
    }

    return await response.json();
}

export async function deleteEvent(eventId: string): Promise<{ success: boolean; message: string }> {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${url}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete event');
    }

    return await response.json();
}

export async function updateEventStatus(
    eventId: string,
    registrationStatus: 'comingsoon' | 'open' | 'closed'
): Promise<{ success: boolean; message: string; data: { event: AdminEvent } }> {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${url}/events/${eventId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ registrationStatus }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update event status');
    }

    return await response.json();
}

// ========== Booking Management ==========
export interface AdminBooking {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    event: {
        _id: string;
        title: string;
        date: string;
        venue: string;
    };
    numberOfTickets: number;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    bookedAt: string;
}

export interface BookingsResponse {
    bookings: AdminBooking[];
    pagination?: {
        total: number;
        page: number;
        pages: number;
    };
}

export async function getAllBookings(): Promise<{ success: boolean; data: BookingsResponse }> {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${url}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch bookings');
    }

    return await response.json();
}

export async function updateBookingStatus(
    bookingId: string,
    status: 'pending' | 'confirmed' | 'cancelled'
): Promise<{ success: boolean; message: string }> {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${url}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update booking status');
    }

    return await response.json();
}
