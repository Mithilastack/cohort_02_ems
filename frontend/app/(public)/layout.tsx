import { ReactNode } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            <div className="mx-auto">

                {children}
            </div>
            <Footer />
        </>
    )
}