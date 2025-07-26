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
    <div className="md-surface" style={{ 
      fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', 
      minHeight: '100vh', 
      backgroundColor: 'var(--md-sys-color-background)',
      color: 'var(--md-sys-color-on-background)',
      transition: 'all var(--md-motion-duration-medium2) var(--md-motion-easing-standard)'
    }}>
      <Header />
      <main>
        {children}
      </main>
    </div>
  )
}

export default Layout