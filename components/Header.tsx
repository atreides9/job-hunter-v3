'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppContext } from '@/contexts/AppContext'
import { Moon, Sun, BarChart, FileText, Bookmark, User } from 'lucide-react'

const Header: React.FC = () => {
  const pathname = usePathname()
  const { darkMode, setDarkMode, applicationHistory, bookmarkedJobs } = useAppContext()

  const navItems = [
    { path: '/', label: '채용공고', icon: FileText },
    { path: '/bookmark', label: '북마크', icon: Bookmark, count: bookmarkedJobs.length },
    { path: '/resume', label: '이력서관리', icon: User },
    { path: '/applications', label: '지원현황', icon: BarChart, count: applicationHistory.length },
  ]

  return (
    <header style={{
      background: darkMode 
        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' 
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white', 
      padding: '1.5rem 0', 
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 1rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '1rem' 
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 'bold', 
            margin: 0, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem' 
          }}>
            🎯 Job Hunter
            <span style={{ 
              fontSize: '0.75rem', 
              opacity: 0.8, 
              background: 'rgba(255,255,255,0.2)', 
              padding: '0.25rem 0.5rem', 
              borderRadius: '0.25rem' 
            }}>v3.0</span>
          </h1>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Navigation buttons */}
          <nav style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
                <button
                  style={{ 
                    background: pathname === item.path 
                      ? 'rgba(255,255,255,0.3)' 
                      : 'rgba(255,255,255,0.2)', 
                    border: '1px solid rgba(255,255,255,0.3)', 
                    color: 'white', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '0.5rem', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: pathname === item.path ? '600' : '400',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (pathname !== item.path) {
                      (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.25)'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (pathname !== item.path) {
                      (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.2)'
                    }
                  }}
                >
                  <item.icon size={16} />
                  {item.label}
                  {item.count !== undefined && item.count > 0 && (
                    <span style={{
                      background: 'rgba(255,255,255,0.3)',
                      borderRadius: '50%',
                      minWidth: '1.25rem',
                      height: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {item.count}
                    </span>
                  )}
                </button>
              </Link>
            ))}
          </nav>
          
          {/* Dark mode toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              border: '1px solid rgba(255,255,255,0.3)', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '0.5rem', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.25)'}
            onMouseOut={(e) => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.2)'}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />} 
            {darkMode ? '라이트' : '다크'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header