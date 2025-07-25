'use client'

import React from 'react'
import { useAppContext } from '@/contexts/AppContext'
import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { darkMode } = useAppContext()

  const theme = {
    bg: darkMode ? '#0f172a' : '#f8fafc',
    cardBg: darkMode ? '#1e293b' : 'white',
    text: darkMode ? '#f1f5f9' : '#334155',
    textSecondary: darkMode ? '#94a3b8' : '#64748b',
    border: darkMode ? '#334155' : '#e2e8f0'
  }

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
      backgroundColor: theme.bg, 
      minHeight: '100vh', 
      color: theme.text,
      transition: 'all 0.3s ease'
    }}>
      <Header />
      <main>
        {children}
      </main>
    </div>
  )
}

export default Layout