import Image from 'next/image'
import React from 'react'

interface MobileFrameProps {
  title: string;
  image: string;
  width?: string;
  height?: string;
}

function MobileFrame({ title, image, width = '300px', height = '600px' }: MobileFrameProps) {
  return (<>
    <div className="relative border-gray-800 bg-white border-[14px] rounded-[2.5rem] shadow-xl" style={{ width, height }}>
      <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>

      {/* Volume Button */}
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[16px] top-[124px] rounded-l-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[16px] top-[178px] rounded-l-lg"></div>

      {/* Mobile Switch */}
      <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[16px] top-[142px] rounded-r-lg"></div>

      <div className="rounded-[2rem] overflow-hidden bg-white" style={{ width: `calc(${width} - 28px)`, height: `calc(${height} - 28px)` }}>
        <Image width={100} height={100} src={image} className="dark:hidden w-[272px] h-[572px]" alt={title} />
        <Image width={100} height={100} src={image} className="hidden dark:block w-full h-full" alt={title} />
      </div>
    </div>
  </>)
}

export default MobileFrame