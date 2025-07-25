'use client'

import React, { useState, useMemo } from 'react'
import { useAppContext } from '@/contexts/AppContext'
import Layout from './Layout'
import { BarChart, Building, MapPin, Calendar, Clock, Filter, Search, Eye, Edit } from 'lucide-react'

const ApplicationsPage: React.FC = () => {
  const { 
    jobs, 
    applicationHistory, 
    darkMode 
  } = useAppContext()
  
  const [sortBy, setSortBy] = useState('appliedAt')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const theme = {
    bg: darkMode ? '#0f172a' : '#f8fafc',
    cardBg: darkMode ? '#1e293b' : 'white',
    text: darkMode ? '#f1f5f9' : '#334155',
    textSecondary: darkMode ? '#94a3b8' : '#64748b',
    border: darkMode ? '#334155' : '#e2e8f0',
    tableBg: darkMode ? '#0f172a' : '#ffffff',
    tableHeaderBg: darkMode ? '#1e293b' : '#f8fafc',
    tableRowBg: darkMode ? '#1e293b' : '#ffffff',
    tableRowHoverBg: darkMode ? '#334155' : '#f1f5f9'
  }

  // Enhanced applications data with job details
  const applicationsData = useMemo(() => {
    return applicationHistory.map(app => {
      const job = jobs.find(j => j.id === app.jobId)
      if (!job) return null
      
      const daysUntilDeadline = job.deadline ? 
        Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null
      
      const daysSinceApplied = Math.ceil((new Date().getTime() - new Date(app.appliedAt).getTime()) / (1000 * 60 * 60 * 24))
      
      return {
        ...app,
        job,
        daysUntilDeadline,
        daysSinceApplied,
        status: daysSinceApplied <= 7 ? 'applied' : 
                daysSinceApplied <= 14 ? 'reviewing' : 
                daysSinceApplied <= 30 ? 'pending' : 'no-response'
      }
    }).filter(Boolean)
  }, [applicationHistory, jobs])

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let filtered = applicationsData

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app && app.job && (
          app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.job.company.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app && app.status === filterStatus)
    }

    // Sort
    return filtered.sort((a, b) => {
      if (!a || !b) return 0
      switch (sortBy) {
        case 'company':
          return a.job.company.localeCompare(b.job.company)
        case 'title':
          return a.job.title.localeCompare(b.job.title)
        case 'deadline':
          if (!a.job.deadline && !b.job.deadline) return 0
          if (!a.job.deadline) return 1
          if (!b.job.deadline) return -1
          return new Date(a.job.deadline).getTime() - new Date(b.job.deadline).getTime()
        case 'status':
          return a.status.localeCompare(b.status)
        default: // appliedAt
          return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      }
    })
  }, [applicationsData, searchQuery, filterStatus, sortBy])

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
      'applied': { label: '지원완료', color: '#10b981', bg: '#dcfce7' },
      'reviewing': { label: '검토중', color: '#f59e0b', bg: '#fef3c7' },
      'pending': { label: '대기중', color: '#6b7280', bg: '#f3f4f6' },
      'no-response': { label: '무응답', color: '#ef4444', bg: '#fee2e2' }
    }
    
    const config = statusConfig[status] || statusConfig['applied']
    
    return (
      <span style={{
        background: darkMode ? config.color + '20' : config.bg,
        color: config.color,
        padding: '0.375rem 0.75rem',
        borderRadius: '1rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        border: darkMode ? `1px solid ${config.color}40` : 'none'
      }}>
        {config.label}
      </span>
    )
  }

  const statistics = useMemo(() => {
    const total = applicationsData.length
    const applied = applicationsData.filter(app => app && app.status === 'applied').length
    const reviewing = applicationsData.filter(app => app && app.status === 'reviewing').length
    const pending = applicationsData.filter(app => app && app.status === 'pending').length
    const noResponse = applicationsData.filter(app => app && app.status === 'no-response').length
    
    return { total, applied, reviewing, pending, noResponse }
  }, [applicationsData])

  return (
    <Layout>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
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
            <BarChart size={32} color="#667eea" />
            지원 현황
          </h1>
          <p style={{
            color: theme.textSecondary,
            fontSize: '1.125rem'
          }}>
            지원한 {statistics.total}개 공고의 현황을 확인하고 관리하세요
          </p>
        </div>

        {/* Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: '총 지원', value: statistics.total, color: '#667eea' },
            { label: '지원완료', value: statistics.applied, color: '#10b981' },
            { label: '검토중', value: statistics.reviewing, color: '#f59e0b' },
            { label: '대기중', value: statistics.pending, color: '#6b7280' },
            { label: '무응답', value: statistics.noResponse, color: '#ef4444' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: theme.cardBg,
              padding: '1.5rem',
              borderRadius: '1rem',
              textAlign: 'center',
              border: `1px solid ${theme.border}`,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{
          background: theme.cardBg,
          padding: '1.5rem',
          borderRadius: '1rem',
          marginBottom: '1.5rem',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: theme.textSecondary
                }} />
                <input
                  type="text"
                  placeholder="회사명 또는 직무 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    paddingLeft: '2.5rem',
                    paddingRight: '1rem',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.5rem',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '0.375rem',
                    background: theme.cardBg,
                    color: theme.text,
                    fontSize: '0.875rem',
                    minWidth: '250px'
                  }}
                />
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={16} color={theme.text} />
                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: theme.text }}>상태:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '0.375rem',
                    background: theme.cardBg,
                    color: theme.text,
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="all">전체</option>
                  <option value="applied">지원완료</option>
                  <option value="reviewing">검토중</option>
                  <option value="pending">대기중</option>
                  <option value="no-response">무응답</option>
                </select>
              </div>

              {/* Sort */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: theme.text }}>정렬:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '0.375rem',
                    background: theme.cardBg,
                    color: theme.text,
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="appliedAt">지원일순</option>
                  <option value="company">회사명순</option>
                  <option value="title">직무순</option>
                  <option value="deadline">마감일순</option>
                  <option value="status">상태순</option>
                </select>
              </div>
            </div>

            <div style={{
              fontSize: '0.875rem',
              color: theme.textSecondary
            }}>
              {filteredApplications.length}개의 지원 기록
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div style={{
          background: theme.tableBg,
          borderRadius: '1rem',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {filteredApplications.length === 0 ? (
            <div style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              color: theme.textSecondary
            }}>
              <BarChart size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3 style={{
                fontSize: '1.5rem',
                color: theme.text,
                marginBottom: '1rem'
              }}>
                {searchQuery || filterStatus !== 'all' ? '검색 결과가 없습니다' : '지원한 공고가 없습니다'}
              </h3>
              <p style={{ fontSize: '1.125rem' }}>
                {searchQuery || filterStatus !== 'all' ? '다른 검색 조건을 시도해보세요' : '채용공고 페이지에서 지원해보세요!'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: theme.tableHeaderBg }}>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: theme.text,
                      borderBottom: `1px solid ${theme.border}`,
                      fontSize: '0.875rem'
                    }}>회사명</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: theme.text,
                      borderBottom: `1px solid ${theme.border}`,
                      fontSize: '0.875rem'
                    }}>직무</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: theme.text,
                      borderBottom: `1px solid ${theme.border}`,
                      fontSize: '0.875rem'
                    }}>지원일</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: theme.text,
                      borderBottom: `1px solid ${theme.border}`,
                      fontSize: '0.875rem'
                    }}>마감일</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: theme.text,
                      borderBottom: `1px solid ${theme.border}`,
                      fontSize: '0.875rem'
                    }}>위치</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: theme.text,
                      borderBottom: `1px solid ${theme.border}`,
                      fontSize: '0.875rem'
                    }}>상태</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: theme.text,
                      borderBottom: `1px solid ${theme.border}`,
                      fontSize: '0.875rem'
                    }}>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app, index) => app && (
                    <tr
                      key={app.jobId}
                      style={{
                        background: index % 2 === 0 ? theme.tableRowBg : theme.tableHeaderBg,
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = theme.tableRowHoverBg
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? theme.tableRowBg : theme.tableHeaderBg
                      }}
                    >
                      <td style={{
                        padding: '1rem',
                        borderBottom: `1px solid ${theme.border}`,
                        fontSize: '0.875rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Building size={16} color={theme.textSecondary} />
                          <span style={{ color: theme.text, fontWeight: '500' }}>
                            {app.job.company}
                          </span>
                        </div>
                      </td>
                      <td style={{
                        padding: '1rem',
                        borderBottom: `1px solid ${theme.border}`,
                        fontSize: '0.875rem'
                      }}>
                        <div style={{ color: theme.text, fontWeight: '500' }}>
                          {app.job.title}
                        </div>
                        <div style={{ 
                          color: theme.textSecondary, 
                          fontSize: '0.75rem',
                          marginTop: '0.25rem'
                        }}>
                          ID: {app.job.id}
                        </div>
                      </td>
                      <td style={{
                        padding: '1rem',
                        borderBottom: `1px solid ${theme.border}`,
                        fontSize: '0.875rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={16} color={theme.textSecondary} />
                          <span style={{ color: theme.text }}>
                            {new Date(app.appliedAt).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                        <div style={{ 
                          color: theme.textSecondary, 
                          fontSize: '0.75rem',
                          marginTop: '0.25rem'
                        }}>
                          {app.daysSinceApplied}일 전
                        </div>
                      </td>
                      <td style={{
                        padding: '1rem',
                        borderBottom: `1px solid ${theme.border}`,
                        fontSize: '0.875rem'
                      }}>
                        {app.job.deadline ? (
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Clock size={16} color={
                                app.daysUntilDeadline !== null && app.daysUntilDeadline <= 3 ? '#ef4444' : theme.textSecondary
                              } />
                              <span style={{ 
                                color: app.daysUntilDeadline !== null && app.daysUntilDeadline <= 3 ? '#ef4444' : theme.text 
                              }}>
                                {new Date(app.job.deadline).toLocaleDateString('ko-KR')}
                              </span>
                            </div>
                            {app.daysUntilDeadline !== null && app.daysUntilDeadline >= 0 && (
                              <div style={{ 
                                color: app.daysUntilDeadline <= 3 ? '#ef4444' : theme.textSecondary, 
                                fontSize: '0.75rem',
                                marginTop: '0.25rem',
                                fontWeight: app.daysUntilDeadline <= 3 ? '600' : '400'
                              }}>
                                D-{app.daysUntilDeadline}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: theme.textSecondary }}>-</span>
                        )}
                      </td>
                      <td style={{
                        padding: '1rem',
                        borderBottom: `1px solid ${theme.border}`,
                        fontSize: '0.875rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MapPin size={16} color={theme.textSecondary} />
                          <span style={{ color: theme.text }}>
                            {app.job.location}
                          </span>
                        </div>
                      </td>
                      <td style={{
                        padding: '1rem',
                        borderBottom: `1px solid ${theme.border}`,
                        fontSize: '0.875rem',
                        textAlign: 'center'
                      }}>
                        {getStatusBadge(app.status)}
                      </td>
                      <td style={{
                        padding: '1rem',
                        borderBottom: `1px solid ${theme.border}`,
                        fontSize: '0.875rem',
                        textAlign: 'center'
                      }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button
                            style={{
                              background: 'transparent',
                              border: `1px solid ${theme.border}`,
                              color: theme.text,
                              padding: '0.375rem',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              (e.target as HTMLElement).style.backgroundColor = theme.border
                            }}
                            onMouseOut={(e) => {
                              (e.target as HTMLElement).style.backgroundColor = 'transparent'
                            }}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            style={{
                              background: 'transparent',
                              border: `1px solid ${theme.border}`,
                              color: theme.text,
                              padding: '0.375rem',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              (e.target as HTMLElement).style.backgroundColor = theme.border
                            }}
                            onMouseOut={(e) => {
                              (e.target as HTMLElement).style.backgroundColor = 'transparent'
                            }}
                          >
                            <Edit size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default ApplicationsPage