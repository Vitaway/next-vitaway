'use client';

import Image from 'next/image'
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Logo from '../logo';


function AdminNavbar() {
    const { data: session } = useSession();

    return (
        <nav className="w-full h-16 bg-white shadow-sm flex items-center px-4 border-b border-gray-200">
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold flex items-center py-5">
                        <span className="text-white px-1 rounded">
                            <Logo />
                        </span>
                    </div>
                </div>
                <div>
                    <div className="flex items-center space-x-2">
                        {session && (
                            <>
                                <Image src={session.user?.image || ""} className="w-7 h-7 rounded-full object-cover" alt="Logo" width={40} height={40} />
                                <span className="text-sm text-slate-600 font-semibold">Hi, {session.user?.name}</span>
                                <button onClick={() => signOut()} className="bg-red-600 text-white px-4 py-2 rounded text-sm">Logout</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default AdminNavbar