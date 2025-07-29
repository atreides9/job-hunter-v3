'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppContext } from '@/contexts/AppContext'
import { Moon, Sun, BarChart, Bookmark, User, Home, TrendingUp } from 'lucide-react'

const Header: React.FC = () => {
  const pathname = usePathname()
  const { darkMode, setDarkMode, applicationHistory, bookmarkedJobs } = useAppContext()

  // Primary navigation - main app sections
  const primaryNavItems = [
    { path: '/', label: '홈', icon: Home },
    { path: '/applications', label: '지원현황', icon: BarChart, count: applicationHistory.length },
    { path: '/insights', label: '인사이트', icon: TrendingUp },
    { path: '/bookmark', label: '북마크', icon: Bookmark, count: bookmarkedJobs.length },
    { path: '/resume', label: '이력서관리', icon: User },
  ]
  // Secondary navigation - user actions

  interface NavItemType {
    path: string;
    label: string;
    icon: React.ComponentType<{ size: number }>;
    count?: number;
  }

  const NavItem = ({ item, isActive }: { item: NavItemType, isActive: boolean }) => (
    <Link href={item.path} style={{ textDecoration: 'none' }}>
      <button className={`nav-item ${isActive ? 'active' : ''}`}>
        <item.icon size={16} />
        <span>{item.label}</span>
        {item.count !== undefined && item.count > 0 && (
          <span className="badge" style={{
            background: 'var(--blue)',
            color: 'white',
            borderRadius: '10px',
            padding: '2px 6px',
            fontSize: '11px',
            fontWeight: '600',
            minWidth: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {item.count}
          </span>
        )}
      </button>
    </Link>
  )

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: 'clamp(16px, 4vw, 20px)',
            fontWeight: '700',
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap'
          }}>
            🎯 Job Hunter
          </div>
        </Link>
        
        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Primary Navigation */}
          <nav className="nav-group nav-primary">
            {primaryNavItems.map((item) => (
              <NavItem 
                key={item.path} 
                item={item} 
                isActive={pathname === item.path} 
              />
            ))}
          </nav>

          {/* Separator */}
          <div className="nav-separator" />

          {/* Theme Toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="nav-item"
            style={{ border: 'none', background: 'transparent' }}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{darkMode ? '라이트' : '다크'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header