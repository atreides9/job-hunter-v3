'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from './Layout'
import VirtualizedJobList from './VirtualizedJobList'
import { Loader2, Plus, X } from 'lucide-react'

// New imports for Zustand + React Query
import { useJobStore } from '@/stores/jobStore'
import { useUserPreferencesStore } from '@/stores/userPreferencesStore'
import { useApplicationStore } from '@/stores/applicationStore'
import { useJobs, useApplyToJob, useFilteredJobs } from '@/hooks/useJobs'

const JobHunterV2 = () => {
  // Zustand stores
  const { 
    userKeywords, 
    setUserKeywords, 
    getStats,
    getUrgentJobs 
  } = useJobStore()
  
  const { darkMode } = useUserPreferencesStore()
  const { addApplication } = useApplicationStore()
  
  // React Query hooks
  const { isLoading, error } = useJobs()
  const applyMutation = useApplyToJob()
  
  const router = useRouter()
  
  // Local state for UI
  const [mounted, setMounted] = useState(false)
  const [newKeyword, setNewKeyword] = useState('')
  const [sortBy, setSortBy] = useState('matchScore')
  const [filterScore, setFilterScore] = useState(0)
  const [showApplicationPopup, setShowApplicationPopup] = useState(false)
  const [currentAppliedJob, setCurrentAppliedJob] = useState<{ id: number; title: string; company: { name: string } } | null>(null)
  
  // Get filtered jobs using the custom hook
  const filteredJobs = useFilteredJobs({
    minMatchScore: filterScore,
    sortBy: sortBy as 'matchScore' | 'posted_date' | 'deadline' | 'salary'
  })
  
  // Get computed data from stores
  const stats = getStats()
  const urgentJobs = getUrgentJobs()
  
  // CSS theme variables
  const theme = {
    bg: 'var(--bg-primary)',
    cardBg: 'var(--bg-tertiary)',
    text: 'var(--text-primary)',
    textSecondary: 'var(--text-secondary)',
    border: 'var(--separator)'
  }
  
  // Mount effect
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Keyword management
  const addKeyword = () => {
    if (newKeyword.trim() && !userKeywords.includes(newKeyword.trim())) {
      setUserKeywords([...userKeywords, newKeyword.trim()])
      setNewKeyword('')
    }
  }
  
  const removeKeyword = (keyword: string) => {
    setUserKeywords(userKeywords.filter(k => k !== keyword))
  }
  
  // Job application handler
  const applyToJob = async (job: { id: number; title: string; company: { name: string } }) => {
    try {
      await applyMutation.mutateAsync({
        jobId: job.id,
        resumeId: 'default'
      })
      
      // Add to application store
      addApplication({
        jobId: job.id,
        status: 'applied',
        notes: `Applied to ${job.title} at ${job.company.name}`
      })
      
      setCurrentAppliedJob(job)
      setShowApplicationPopup(true)
    } catch (error) {
      console.error('Failed to apply to job:', error)
    }
  }
  
  
  if (!mounted) {
    return <div>Loading...</div>
  }
  
  return (
    <Layout>
      <div style={{ 
        background: theme.bg,
        minHeight: '100vh',
        padding: '2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          
          {/* Header Section */}
          <div style={{
            background: theme.cardBg,
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            border: `1px solid ${theme.border}`,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h1 style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: theme.text,
                  marginBottom: '0.5rem'
                }}>
                  Job Hunter v3.0 - Zustand Edition
                </h1>
                <p style={{ 
                  color: theme.textSecondary,
                  fontSize: '1rem'
                }}>
                  AI 기반 맞춤형 채용정보 with 고성능 상태관리
                </p>
              </div>
              
              {isLoading && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading jobs...</span>
                </div>
              )}
            </div>
            
            {/* Stats Dashboard */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                background: darkMode ? '#1e293b' : '#f8fafc',
                padding: '1rem',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6' }}>
                  {stats.totalJobs}
                </div>
                <div style={{ fontSize: '0.875rem', color: theme.textSecondary }}>
                  전체 공고
                </div>
              </div>
              
              <div style={{
                background: darkMode ? '#1e293b' : '#f8fafc',
                padding: '1rem',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
                  {stats.matchedJobs}
                </div>
                <div style={{ fontSize: '0.875rem', color: theme.textSecondary }}>
                  매칭 공고
                </div>
              </div>
              
              <div style={{
                background: darkMode ? '#1e293b' : '#f8fafc',
                padding: '1rem',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>
                  {stats.avgMatchScore}%
                </div>
                <div style={{ fontSize: '0.875rem', color: theme.textSecondary }}>
                  평균 매칭률
                </div>
              </div>
              
              <div style={{
                background: darkMode ? '#1e293b' : '#f8fafc',
                padding: '1rem',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444' }}>
                  {urgentJobs.length}
                </div>
                <div style={{ fontSize: '0.875rem', color: theme.textSecondary }}>
                  마감임박
                </div>
              </div>
            </div>
            
            {/* Keyword Management */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: theme.text,
                marginBottom: '1rem'
              }}>
                관심 키워드
              </h3>
              
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1rem',
                flexWrap: 'wrap'
              }}>
                {userKeywords.map(keyword => (
                  <span 
                    key={keyword}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '1rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {keyword}
                    <button
                      onClick={() => removeKeyword(keyword)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'white',
                        cursor: 'pointer',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                  placeholder="새 키워드 추가"
                  style={{
                    padding: '0.5rem',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '0.25rem',
                    background: theme.cardBg,
                    color: theme.text,
                    fontSize: '0.875rem',
                    flex: 1
                  }}
                />
                <button
                  onClick={addKeyword}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Filters and Controls */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: theme.text }}>
                매칭률:
              </label>
              <select 
                value={filterScore} 
                onChange={(e) => setFilterScore(Number(e.target.value))}
                style={{ 
                  padding: '0.5rem', 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '0.25rem', 
                  background: theme.cardBg, 
                  color: theme.text,
                  fontSize: '0.875rem'
                }}
              >
                <option value={0}>전체</option>
                <option value={25}>25% 이상</option>
                <option value={50}>50% 이상</option>
                <option value={75}>75% 이상</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: theme.text }}>
                정렬:
              </label>
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
                <option value="matchScore">매칭률 높은 순</option>
                <option value="posted_date">최신 등록순</option>
                <option value="deadline">마감 임박순</option>
                <option value="salary">급여 높은 순</option>
              </select>
            </div>
            
            <div style={{ 
              marginLeft: 'auto', 
              fontSize: '0.875rem', 
              color: theme.textSecondary 
            }}>
              {filteredJobs.length}개의 공고
            </div>
          </div>
          
          {/* Job List - Virtualized */}
          {error ? (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              padding: '1rem',
              textAlign: 'center',
              color: '#dc2626'
            }}>
              오류가 발생했습니다: {error.message}
            </div>
          ) : (
            <VirtualizedJobList
              jobs={filteredJobs}
              height={800}
              onJobClick={(job) => router.push(`/jobs/${job.id}`)}
              onApplyClick={applyToJob}
            />
          )}
          
          {/* Application Success Popup */}
          {showApplicationPopup && currentAppliedJob && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: theme.cardBg,
                borderRadius: '1rem',
                padding: '2rem',
                maxWidth: '400px',
                textAlign: 'center',
                border: `1px solid ${theme.border}`
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  color: theme.text,
                  marginBottom: '0.5rem'
                }}>
                  지원 완료!
                </h3>
                <p style={{ color: theme.textSecondary, marginBottom: '1.5rem' }}>
                  {currentAppliedJob.company.name}의 {currentAppliedJob.title} 포지션에 성공적으로 지원되었습니다.
                </p>
                <button
                  onClick={() => {
                    setShowApplicationPopup(false)
                    setCurrentAppliedJob(null)
                  }}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  확인
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default JobHunterV2