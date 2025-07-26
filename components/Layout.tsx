'use client'

import React, { useEffect } from 'react'
import { useAppContext } from '@/contexts/AppContext'
import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { darkMode } = useAppContext()

  // Apply theme attribute to root element
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.setAttribute('data-theme', 'dark')
    } else {
      root.removeAttribute('data-theme')
    }
  }, [darkMode])

  return (
    <div className="bg-primary" style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
      minHeight: '100vh', 
      transition: 'all 0.3s ease'
    }}>
      <Header />
      <main className="text-primary">
        {children}
      </main>
    </div>
  )
}

export default Layout