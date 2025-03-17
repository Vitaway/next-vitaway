import { Suspense } from "react";
import { getServerAuthSession } from '@/config/auth-config'
import { redirect } from 'next/navigation';
import Loading from "../loading";
import SessionProviderWrapper from "./SessionWrapper";
import AdminNavbar from "../components/admin/admin-navbar";
import AdminSidebar from "../components/admin/admin-sidebar";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const session = await getServerAuthSession()

    if (!session || !session.user) {
        redirect('/api/auth/signin')
    }

    return (
        <html lang="en">
            <head>
                <meta name="apple-mobile-web-app-title" content="Art For Memory" />
            </head>
            <body className="antialiased">
                <Suspense fallback={<Loading />}>
                    <SessionProviderWrapper session={session}>
                        <main>
                            <div>
                                <AdminNavbar />
                                <div className="min-h-screen flex bg-gray-100">
                                    <AdminSidebar />
                                    <div className="flex-1 p-6">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </main>
                    </SessionProviderWrapper>
                </Suspense>
            </body>
        </html>
    );
}
