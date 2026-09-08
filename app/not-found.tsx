import Link from 'next/link'
import React from 'react'
import GuestLayout from './layouts/GuestLayout'

function NotFound() {
    return (
        <GuestLayout>
            <section className="flex min-h-[60vh] flex-col items-center justify-center rounded-b-[22px] bg-[#F6F3EE] px-5 py-20 text-center sm:rounded-b-[28px]">
                <h1 className="text-3xl font-bold tracking-tight text-[#003E48] sm:text-5xl">
                    This page is not <span className="font-accent">here</span>
                </h1>
                <p className="mt-4 max-w-md text-[#003E48]/70">
                    Sorry, the page you are looking for could not be found.
                </p>
                <Link href="/" className="press-btn mt-8">
                    Return home
                </Link>
            </section>
        </GuestLayout>
    )
}

export default NotFound
