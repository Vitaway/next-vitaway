import React from 'react'
import Logo from './components/logo'

function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-2xl font-bold flex flex-col items-center sm:flex-row">
        <Logo />
      </div>
    </div>
  )
}

export default Loading