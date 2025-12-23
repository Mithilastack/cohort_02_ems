'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Calendar,
    Ticket,
    LogOut,
    Menu,
    ChevronLeft,
    ChevronRight,
    X
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

const sidebarItems = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Events',
        href: '/admin/events',
        icon: Calendar,
    },
    {
        title: 'Bookings',
        href: '/admin/bookings',
        icon: Ticket,
    },
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false)

    const handleLogout = () => {
        // Clear cookies
        document.cookie = 'token=; path=/; max-age=0'
        document.cookie = 'user=; path=/; max-age=0'
        router.push('/login')
        setShowLogoutModal(false)
    }

    const SidebarContent = ({ isDesktop = false }) => (
        <div className="flex h-full flex-col">
            {/* Logo/Header */}
            <div className="px-6 py-5 flex items-center justify-between">
                {!isCollapsed && (
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                        VDHS Admin
                    </h2>
                )}
                {isDesktop && (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-slate-300 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-lg"
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-5 w-5" />
                        ) : (
                            <ChevronLeft className="h-5 w-5" />
                        )}
                    </button>
                )}
            </div>

            <Separator className="bg-slate-700" />

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                                isActive
                                    ? "bg-purple-600 text-white shadow-lg"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white",
                                isCollapsed && "justify-center"
                            )}
                            title={isCollapsed ? item.title : undefined}
                        >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            {!isCollapsed && <span>{item.title}</span>}
                        </Link>
                    )
                })}
            </nav>

            <Separator className="bg-slate-700" />

            {/* Logout Button */}
            <div className="p-4">
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-red-900/50 hover:text-red-400",
                        isCollapsed && "justify-center"
                    )}
                    title={isCollapsed ? "Logout" : undefined}
                >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={cn(
                "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300",
                isCollapsed ? "lg:w-20" : "lg:w-64"
            )}>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-900 border-r border-slate-800">
                    <SidebarContent isDesktop={true} />
                </div>
            </aside>

            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-slate-900 border-b border-slate-800 px-4 py-3">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    VDHS Admin
                </h2>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="text-slate-300 hover:text-white transition-colors"
                >
                    {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={() => setIsMobileOpen(false)}
                    />
                    <aside className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">
                        <div className="flex h-full flex-col bg-slate-900 border-r border-slate-800">
                            <SidebarContent isDesktop={false} />
                        </div>
                    </aside>
                </>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <>
                    <div
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowLogoutModal(false)}
                    />
                    <div className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-6 space-y-6">
                            {/* Header */}
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-white">
                                    Confirm Logout
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    Are you sure you want to logout? You will need to login again to access the admin panel.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
