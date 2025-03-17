import Link from 'next/link'
import React from 'react'

function AdminSidebar() {
    return (
        <aside className="w-16 bg-white border-r border-gray-100 p-4 flex flex-col space-y-6 items-center">
            <div className="w-8 h-8 bg-black rounded-full"></div>

            <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                <Link href="/admin/manage-blogs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m21.68 16.96-3.13-7.31c-1.06-2.48-3.01-2.58-4.32-.22l-1.89 3.41c-.96 1.73-2.75 1.88-3.99.33l-.22-.28c-1.29-1.62-3.11-1.42-4.04.43l-1.72 3.45C1.16 19.17 2.91 22 5.59 22h12.76c2.6 0 4.35-2.65 3.33-5.04Z" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M6.969 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </Link>
            </div>
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                <Link href="/admin/manage-contacts">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12.53 20.418H6.21c-3.16 0-4.21-2.1-4.21-4.21v-8.42c0-3.16 1.05-4.21 4.21-4.21h6.32c3.16 0 4.21 1.05 4.21 4.21v8.42c0 3.16-1.06 4.21-4.21 4.21Z" stroke="#d9e3f0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="m19.518 17.1-2.78-1.95V8.84l2.78-1.95c1.36-.95 2.48-.37 2.48 1.3v7.62c0 1.67-1.12 2.25-2.48 1.29ZM11.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" stroke="#d9e3f0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </Link>
            </div>
            <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                <Link href="/admin/manage-subscribers">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16.42 7.951a6.253 6.253 0 0 1 0 8.84 6.253 6.253 0 0 1-8.84 0 6.253 6.253 0 0 1 0-8.84 6.253 6.253 0 0 1 8.84 0Z" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M8.251 21.639c-2-.8-3.75-2.25-4.91-4.26a9.89 9.89 0 0 1-1.25-6.25M5.85 4.48A9.936 9.936 0 0 1 12 2.36c2.27 0 4.36.77 6.04 2.05M15.75 21.639c2-.8 3.75-2.25 4.91-4.26a9.89 9.89 0 0 0 1.25-6.25" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </Link>
            </div>
        </aside>
    )
}

export default AdminSidebar