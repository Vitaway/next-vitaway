import Image from 'next/image'
import React, { CSSProperties } from 'react'

const imageStyle: CSSProperties = {
    position: 'absolute',
    height: '100%',
    width: '100%',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    color: 'transparent',
};

function BackgroundBlurImage() {
    return (<>
        <Image
            alt="blur"
            loading="lazy"
            decoding="async"
            data-nimg="fill"
            className="max-w-none"
            style={imageStyle}
            width={100}
            height={100}
            src="https://ai-tool.nextjstemplates.com/images/blur/blur-02.svg"
        />
    </>)
}

export default BackgroundBlurImage