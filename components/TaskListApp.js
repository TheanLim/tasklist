'use client'
import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { SearchProvider } from '@/context/SearchContext'

const TaskListApp = ({children}) => {
  return (
    <>
        <SearchProvider>
        <Navbar/>
        {/* className="container mx-auto pt-16 min-h-screen"  */}
        <main className="pt-16">
            {children}
        </main>
        <Footer/>
        </SearchProvider>
    </>
  )
}

export default TaskListApp