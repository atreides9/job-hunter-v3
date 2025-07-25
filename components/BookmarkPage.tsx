'use client'

import React, { useState, useMemo } from 'react'
import { useAppContext } from '@/contexts/AppContext'
import Layout from './Layout'
import { Building, MapPin, Calendar, Clock, Percent, Bookmark, FileText, Trash2 } from 'lucide-react'

const BookmarkPage: React.FC = () => {
  const { 
    jobs, 
    bookmarkedJobs, 
    toggleBookmark, 
    darkMode, 
    userKeywords,
    addApplication,
    applicationHistory 
  } = useAppContext()
  
  const [sortBy, setSortBy] = useState('posted_date')

  const theme = {
    bg: darkMode ? '#0f172a' : '#f8fafc',
    cardBg: darkMode ? '#1e293b' : 'white',
    text: darkMode ? '#f1f5f9' : '#334155',
    textSecondary: darkMode ? '#94a3b8' : '#64748b',
    border: darkMode ? '#334155' : '#e2e8f0'
  }

  // Get bookmarked jobs with match scores
  const bookmarkedJobsData = useMemo(() => {
    const bookmarked = jobs.filter(job => bookmarkedJobs.includes(job.id))
    
    return bookmarked.map(job => {
      const allText = `${job.title} ${job.description} ${job.keywords.join(' ')}`.toLowerCase()
      const matchedKeywords = userKeywords.filter(keyword => 
        allText.includes(keyword.toLowerCase())
      )
      const matchScore = userKeywords.length > 0 ? 
        Math.round((matchedKeywords.length / userKeywords.length) * 100) : 0
      
      return { ...job, matchedKeywords, matchScore }
    }).sort((a, b) => {
      switch (sortBy) {
        case 'matchScore': 
          return b.matchScore - a.matchScore
        case 'deadline': 
          if (!a.deadline && !b.deadline) return 0
          if (!a.deadline) return 1
          if (!b.deadline) return -1
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        case 'company':
          return a.company.localeCompare(b.company)
        default: 
          return new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime()
      }
    })
  }, [jobs, bookmarkedJobs, userKeywords, sortBy])

  const applyToJob = (job: { id: number; title: string; company: string }) => {
    const newApplication = {
      jobId: job.id,
      appliedAt: new Date().toISOString(),
      status: 'applied',
      notes: ''
    }
    addApplication(newApplication)
    alert(`${job.title} 공고에 지원이 완료되었습니다!`)
  }

  const highlightKeywords = (text: string) => {
    if (!userKeywords.length) return text
    let highlightedText = text
    userKeywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi')
      highlightedText = highlightedText.replace(regex, '<mark style="background: linear-gradient(120deg, #fef08a 0%, #fde047 100%); padding: 3px 6px; border-radius: 4px; font-weight: 600;">$1</mark>')
    })
    return highlightedText
  }

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Page Header */}
        <div style={{
          background: theme.cardBg,
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Bookmark size={32} color="#f59e0b" />
            북마크한 공고
          </h1>
          <p style={{
            color: theme.textSecondary,
            fontSize: '1.125rem'
          }}>
            관심있는 {bookmarkedJobsData.length}개의 채용공고를 한눈에 확인하세요
          </p>
        </div>

        {/* Controls */}
        {bookmarkedJobsData.length > 0 && (
          <div style={{
            background: theme.cardBg,
            padding: '1rem 1.5rem',
            borderRadius: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            border: `1px solid ${theme.border}`,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: theme.text }}>정렬:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                style={{ 
                  padding: '0.5rem', 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '0.25rem', 
                  background: theme.cardBg, 
                  color: theme.text,
                  fontSize: '0.875rem'
                }}
              >
                <option value="posted_date">최신 등록순</option>
                <option value="matchScore">일치율 높은 순</option>
                <option value="deadline">마감 임박순</option>
                <option value="company">회사명순</option>
              </select>
            </div>
            
            <div style={{ 
              fontSize: '0.875rem', 
              color: theme.textSecondary 
            }}>
              총 {bookmarkedJobsData.length}개의 북마크된 공고
            </div>
          </div>
        )}

        {/* Bookmarked Jobs */}
        {bookmarkedJobsData.length === 0 ? (
          <div style={{
            background: theme.cardBg,
            borderRadius: '1rem',
            padding: '4rem 2rem',
            textAlign: 'center',
            border: `1px solid ${theme.border}`,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <Bookmark size={64} color={theme.textSecondary} style={{ marginBottom: '1rem' }} />
            <h3 style={{ 
              fontSize: '1.5rem', 
              color: theme.text, 
              marginBottom: '1rem' 
            }}>
              북마크한 공고가 없습니다
            </h3>
            <p style={{ 
              color: theme.textSecondary,
              fontSize: '1.125rem'
            }}>
              채용공고 페이지에서 관심있는 공고를 북마크해보세요!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {bookmarkedJobsData.map(job => {
              const hasApplied = applicationHistory.some(app => app.jobId === job.id)
              const daysUntilDeadline = job.deadline ? Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null
              
              return (
                <div 
                  key={job.id}
                  style={{
                    background: theme.cardBg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '1.25rem',
                        fontWeight: '600', 
                        marginBottom: '0.5rem',
                        color: theme.text,
                        lineHeight: 1.4
                      }} 
                      dangerouslySetInnerHTML={{ __html: highlightKeywords(job.title) }} 
                      />
                      
                      <div style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        fontSize: '0.875rem', 
                        color: theme.textSecondary, 
                        marginBottom: '0.75rem', 
                        flexWrap: 'wrap' 
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Building size={14} /> {job.company}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={14} /> {job.location}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar size={14} /> {new Date(job.posted_date).toLocaleDateString('ko-KR')}
                        </span>
                        {job.deadline && (
                          <span style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.25rem',
                            color: daysUntilDeadline !== null && daysUntilDeadline <= 3 ? '#ef4444' : theme.textSecondary
                          }}>
                            <Clock size={14} /> 마감: {new Date(job.deadline).toLocaleDateString('ko-KR')}
                            {daysUntilDeadline !== null && daysUntilDeadline <= 3 && daysUntilDeadline >= 0 && (
                              <span style={{ color: '#ef4444', fontWeight: '600' }}>(D-{daysUntilDeadline})</span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      background: job.matchScore >= 75 ? '#dcfce7' : 
                                 job.matchScore >= 50 ? '#fef3c7' : 
                                 job.matchScore >= 25 ? '#fed7aa' : '#f1f5f9',
                      color: job.matchScore >= 75 ? '#166534' : 
                             job.matchScore >= 50 ? '#92400e' : 
                             job.matchScore >= 25 ? '#c2410c' : '#64748b',
                      padding: '0.5rem 0.75rem', 
                      borderRadius: '1.5rem', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      flexShrink: 0
                    }}>
                      <Percent size={12} /> {job.matchScore}%
                    </div>
                  </div>

                  <p style={{ 
                    color: theme.textSecondary, 
                    lineHeight: 1.6, 
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }} 
                  dangerouslySetInnerHTML={{ __html: highlightKeywords(job.description) }} 
                  />

                  {/* Actions */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    flexWrap: 'wrap', 
                    gap: '1rem' 
                  }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => applyToJob(job)}
                        style={{ 
                          background: hasApplied ? '#10b981' : '#667eea', 
                          color: 'white', 
                          border: 'none', 
                          padding: '0.75rem 1.5rem', 
                          borderRadius: '0.5rem', 
                          cursor: 'pointer', 
                          fontWeight: '500', 
                          fontSize: '0.875rem', 
                          transition: 'background-color 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                        onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = hasApplied ? '#059669' : '#5a67d8'}
                        onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = hasApplied ? '#10b981' : '#667eea'}
                      >
                        <FileText size={16} />
                        {hasApplied ? '지원완료' : '지원하기'}
                      </button>

                      <button
                        onClick={() => toggleBookmark(job.id)}
                        style={{ 
                          background: '#ef4444', 
                          color: 'white', 
                          border: 'none', 
                          padding: '0.75rem 1.5rem', 
                          borderRadius: '0.5rem', 
                          cursor: 'pointer', 
                          fontWeight: '500', 
                          fontSize: '0.875rem', 
                          transition: 'background-color 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                        onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#dc2626'}
                        onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#ef4444'}
                      >
                        <Trash2 size={16} />
                        북마크 제거
                      </button>
                    </div>

                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: theme.textSecondary,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '0.25rem'
                    }}>
                      <div>💰 {job.salary_min && job.salary_max 
                        ? `${job.salary_min.toLocaleString()}만 - ${job.salary_max.toLocaleString()}만원`
                        : '협의'}</div>
                      <div>ID: {job.id}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default BookmarkPage