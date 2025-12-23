import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

interface JWTPayload {
    userId: string
    role: string
    email: string
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // // Check if the route is an admin route
    // if (pathname.startsWith('/admin')) {
    //     // Get token from cookies
    //     const token = request.cookies.get('token')?.value

    //     if (!token) {
    //         // No token, redirect to login
    //         return NextResponse.redirect(new URL('/login', request.url))
    //     }

    //     try {
    //         // Verify the JWT token
    //         const secret = new TextEncoder().encode(
    //             process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
    //         )

    //         const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload }

    //         // Check if user is admin
    //         if (payload.role !== 'admin') {
    //             // User is not admin, redirect to home
    //             return NextResponse.redirect(new URL('/', request.url))
    //         }

    //         // User is admin, allow access
    //         return NextResponse.next()
    //     } catch (error) {
    //         // Invalid token, redirect to login
    //         console.error('JWT verification failed:', error)
    //         return NextResponse.redirect(new URL('/login', request.url))
    //     }
    // }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
