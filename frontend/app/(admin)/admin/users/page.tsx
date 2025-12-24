'use client'

import { useEffect, useState, useMemo } from 'react'
import { getAllUsers, updateUserStatus, type AdminUser } from '@/lib/adminApi'
import Link from 'next/link'
import { Search, Shield, ShieldOff, Users, UserCheck, UserX, Eye } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

export default function UsersManagement() {
    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500) // 500ms delay

        return () => clearTimeout(timer)
    }, [search])

    // Fetch users when debounced search changes
    useEffect(() => {
        fetchUsers()
    }, [debouncedSearch])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await getAllUsers({ search: debouncedSearch || undefined })
            setUsers(response.data.users)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users')
        } finally {
            setLoading(false)
        }
    }

    const handleToggleBlock = async (userId: string, currentStatus: boolean) => {
        try {
            setActionLoading(userId)
            await updateUserStatus(userId, !currentStatus)
            // Refresh users list
            await fetchUsers()
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update user status')
        } finally {
            setActionLoading(null)
        }
    }

    // Calculate stats
    const stats = useMemo(() => {
        const totalUsers = users.length
        const activeUsers = users.filter(u => !u.isBlocked).length
        const blockedUsers = users.filter(u => u.isBlocked).length

        return { totalUsers, activeUsers, blockedUsers }
    }, [users])

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-transparent border border-purple-500/20 p-8">
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
                        Users Management
                    </h1>
                    <p className="text-slate-300">Manage and monitor all registered users</p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card variant="gradient" className="p-6 hover:border-purple-500/50 transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <Users className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Total Users</p>
                            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                        </div>
                    </div>
                </Card>

                <Card variant="gradient" className="p-6 hover:border-green-500/50 transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-xl">
                            <UserCheck className="h-6 w-6 text-green-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Active Users</p>
                            <p className="text-3xl font-bold text-white">{stats.activeUsers}</p>
                        </div>
                    </div>
                </Card>

                <Card variant="gradient" className="p-6 hover:border-red-500/50 transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/20 rounded-xl">
                            <UserX className="h-6 w-6 text-red-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Blocked Users</p>
                            <p className="text-3xl font-bold text-white">{stats.blockedUsers}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content Card */}
            <Card variant="gradient" className="p-6">
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                        <Input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 h-12 bg-slate-800/50 border-slate-700 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-12 h-12 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400">Loading users...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                            <UserX className="h-8 w-8 text-red-400" />
                        </div>
                        <p className="text-red-400 text-lg">{error}</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                            <Users className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-slate-400 text-lg">No users found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-slate-800">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-900/50 hover:bg-slate-900/50 border-slate-800">
                                    <TableHead className="text-slate-300 font-semibold">Name</TableHead>
                                    <TableHead className="text-slate-300 font-semibold">Email</TableHead>
                                    <TableHead className="text-slate-300 font-semibold">Phone</TableHead>
                                    <TableHead className="text-slate-300 font-semibold">Role</TableHead>
                                    <TableHead className="text-slate-300 font-semibold">Status</TableHead>
                                    <TableHead className="text-slate-300 font-semibold">Joined</TableHead>
                                    <TableHead className="text-slate-300 font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow
                                        key={user._id}
                                        className="border-slate-800 hover:bg-slate-800/30 transition-colors"
                                    >
                                        <TableCell className="text-slate-200 font-medium">
                                            {user.name}
                                        </TableCell>
                                        <TableCell className="text-slate-300">{user.email}</TableCell>
                                        <TableCell className="text-slate-300">
                                            {user.phone || <span className="text-slate-500 italic">N/A</span>}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={user.role === 'admin' ? 'default' : 'secondary'}
                                                className="capitalize"
                                            >
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={user.isBlocked ? 'destructive' : 'success'}
                                                className="min-w-[80px] justify-center"
                                            >
                                                {user.isBlocked ? 'Blocked' : 'Active'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-400 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/admin/users/${user._id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {user.role !== 'admin' && (
                                                    <Button
                                                        onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                                                        disabled={actionLoading === user._id}
                                                        className={`text-xs transition-all duration-200 ${user.isBlocked
                                                            ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/30'
                                                            : 'bg-red-600 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30'
                                                            }`}
                                                    >
                                                        {actionLoading === user._id ? (
                                                            <span className="flex items-center gap-2">
                                                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                                Loading...
                                                            </span>
                                                        ) : user.isBlocked ? (
                                                            <>
                                                                <Shield className="h-4 w-4 mr-1" />
                                                                Unblock
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ShieldOff className="h-4 w-4 mr-1" />
                                                                Block
                                                            </>
                                                        )}
                                                    </Button>
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
