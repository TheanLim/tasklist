'use client'
import { SearchProvider } from '@/context/SearchContext';
import dynamic from 'next/dynamic';
import Footer from './Footer';

// Dynamically import the ThemeSwitcher component
const Navbar = dynamic(() => import('./Navbar'), {
  ssr: false, // Disable server-side rendering for this component
});

const TaskListApp = ({ children }) => {
  return (
    <>
      <SearchProvider>
        <Navbar />
        {/* className="container mx-auto pt-16 min-h-screen"  */}
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </SearchProvider>
    </>
  )
}

export default TaskListApp