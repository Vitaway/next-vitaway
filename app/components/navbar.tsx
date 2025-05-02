import React from 'react'
import TopNavbar from './navbars/top-navbar';
import BottomNavbar from './navbars/bottom-navbar';

function Navbar() {
    return (<>
        <div className="mb-0 py-3 px-3 bg-gradient-to-b from-[#003E48] to-[#282e33] text-cente flex items-center justify-center">
            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10.75 2.45c.7-.59 1.83-.59 2.51 0l1.58 1.35c.3.25.87.46 1.27.46h1.7c1.06 0 1.93.87 1.93 1.93v1.7c0 .4.21.96.46 1.26l1.35 1.58c.59.7.59 1.83 0 2.51l-1.35 1.58c-.25.3-.46.86-.46 1.26v1.7c0 1.06-.87 1.93-1.93 1.93h-1.7c-.4 0-.96.21-1.26.46l-1.58 1.35c-.7.59-1.83.59-2.51 0l-1.58-1.35c-.3-.25-.87-.46-1.26-.46H6.17c-1.06 0-1.93-.87-1.93-1.93v-1.71c0-.39-.2-.96-.45-1.25l-1.35-1.59c-.58-.69-.58-1.81 0-2.5l1.35-1.59c.25-.3.45-.86.45-1.25V6.2c0-1.06.87-1.93 1.93-1.93H7.9c.4 0 .96-.21 1.26-.46l1.59-1.36ZM12 8.13v4.83" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M11.995 16h.009" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
            <p className='ml-2 text-sm text-white'>Visit our Offices located at KG 165 St 7, Kimironko, Near the Former KIE &quot;Remera Campus.&quot; for more supports.</p>
        </div>

        <TopNavbar />

        <BottomNavbar />
    </>)
}

export default Navbar;