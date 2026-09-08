import React from 'react'
import Image from 'next/image'

function Logo({ className = 'w-20 h-auto' }: { className?: string }) {
    return (
        <Image
            src="/images/logo.png"
            alt="Vitaway Logo"
            className={className}
            width={120}
            height={120}
            priority
        />
    )
}

export default Logo
