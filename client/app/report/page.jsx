"use client";
import React from 'react'
import Scores from './scores'
import Sidebar from "../components/Sidebar";
import '../components/bg.css';

export default function Analysis() {
  return (
    <div className="flex  static-bg">
    <div className='w-20 md:24' >
    <Sidebar />
    </div>
    
    <div className="flex flex-col justify-center items-center w-full min-h-screen max-h-full p-4">
      <Scores />
    </div>
    </div>
  )
}
