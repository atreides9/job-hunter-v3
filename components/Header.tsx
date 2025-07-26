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
    { path: '/applications', label: '지원이력', icon: BarChart, count: applicationHistory.length },
    { path: '/insights', label: '인사이트', icon: TrendingUp },
  ]

  // Secondary navigation - user actions
  const secondaryNavItems = [
    { path: '/bookmark', label: '북마크', icon: Bookmark, count: bookmarkedJobs.length },
    { path: '/resume', label: '이력서관리', icon: User },
  ]

  interface NavItemType {
    path: string;
    label: string;
    icon: React.ComponentType<{ size: number }>;
    count?: number;
  }

  const NavItem = ({ item, isActive }: { item: NavItemType, isActive: boolean }) => (
    <Link href={item.path} style={{ textDecoration: 'none' }}>
      <div className={`md-navigation-item ${isActive ? 'md-navigation-item--active' : ''}`}>
        <item.icon size={20} />
        <span className="md-typescale-label-large">{item.label}</span>
        {item.count !== undefined && item.count > 0 && (
          <span className="md-badge" style={{
            backgroundColor: 'var(--md-sys-color-primary)',
            color: 'var(--md-sys-color-on-primary)',
            borderRadius: '12px',
            padding: '2px 6px',
            fontSize: '11px',
            fontWeight: '500',
            minWidth: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '4px'
          }}>
            {item.count}
          </span>
        )}
      </div>
    </Link>
  )

  return (
    <header className="md-top-app-bar">
      <div className="md-top-app-bar__row">
        {/* Logo Section */}
        <section className="md-top-app-bar__section md-top-app-bar__section--align-start">
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px'
            }}>
              <span className="md-top-app-bar__title">
                🎯 Job Hunter
              </span>
              <span className="md-badge" style={{
                backgroundColor: 'var(--md-sys-color-secondary-container)',
                color: 'var(--md-sys-color-on-secondary-container)',
                fontSize: '10px',
                fontWeight: '500',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                v3.0
              </span>
            </div>
          </Link>
        </section>

        {/* Navigation Section */}
        <section className="md-top-app-bar__section md-top-app-bar__section--align-end">
          <div className="md-navigation-bar">
            {/* Primary Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {primaryNavItems.map((item) => (
                <NavItem 
                  key={item.path} 
                  item={item} 
                  isActive={pathname === item.path} 
                />
              ))}
            </div>

            {/* Divider */}
            <div style={{
              width: '1px',
              height: '24px',
              backgroundColor: 'var(--md-sys-color-outline-variant)',
              margin: '0 8px'
            }} />

            {/* Secondary Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {secondaryNavItems.map((item) => (
                <NavItem 
                  key={item.path} 
                  item={item} 
                  isActive={pathname === item.path} 
                />
              ))}
            </div>

            {/* Divider */}
            <div style={{
              width: '1px',
              height: '24px',
              backgroundColor: 'var(--md-sys-color-outline-variant)',
              margin: '0 8px'
            }} />

            {/* Theme Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="md-icon-button md-icon-button--outlined"
              style={{ 
                width: '40px', 
                height: '40px',
                borderRadius: '20px'
              }}
              aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </section>
      </div>
    </header>
  )
}

export default Header