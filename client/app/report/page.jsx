import React from 'react'
import Scores from './scores'
import Report from './report'

export default function Analysis() {
  return (
    <div className='w-full min-h-screen bg-gradient-to-b from-purple-600 to-purple-950 '>
    <div className="flex flex-col justify-center items-center h-full max-h-full p-8">
      <Scores />
      <Report />

    </div>
    </div>
  )
}
