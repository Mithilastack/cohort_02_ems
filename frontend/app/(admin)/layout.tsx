import { ReactNode } from 'react'
import { Sidebar } from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-950">
            <Sidebar />

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Mobile header spacer */}
                <div className="h-14 lg:hidden" />

                <main className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}