import Logo from "./logo";

import React from 'react'

function loading() {
    return (
        <div className="flex items-center justify-center h-screen bg-white">
            <div className="text-2xl font-bold flex flex-col items-center sm:flex-row">
                <Logo />
            </div>
        </div>
    )
}

export default loading