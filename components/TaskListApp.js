import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const TaskListApp = ({children}) => {
  return (
    <>
        <Navbar/>
        {/* className="container mx-auto pt-16 min-h-screen"  */}
        <main className="pt-16">
            {children}
        </main>
        <Footer/>
    </>
  )
}

export default TaskListApp