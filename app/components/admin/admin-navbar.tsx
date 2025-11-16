'use client';

import React from 'react';
import Logo from '../logo';


function AdminNavbar() {
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
                        <span className="text-sm text-slate-600 font-semibold">Admin Panel</span>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default AdminNavbar