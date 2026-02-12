import React from 'react'
import Image from 'next/image'

function Logo() {
    return (<>
        <Image src="https://ehr.vitaway.org/logo.png" alt="Vitaway Logo" className=" w-20 mt-3" width={120} height={120} />
    </>)
}

export default Logo