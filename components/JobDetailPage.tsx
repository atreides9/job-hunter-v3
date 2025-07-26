'use client'

import React, { useState } from 'react'
import { useAppContext } from '@/contexts/AppContext'
import { useRouter } from 'next/navigation'
import Layout from './Layout'
import { 
  ArrowLeft, Building, MapPin, Clock, Globe, 
  CheckCircle, Star, Bookmark, BookmarkCheck, AlertTriangle,
  DollarSign, Briefcase, Heart, Award, Coffee, Car, Home
} from 'lucide-react'

interface JobDetailPageProps {
  jobId: string
}

const JobDetailPage: React.FC<JobDetailPageProps> = ({ jobId }) => {
  const { 
    jobs, 
    bookmarkedJobs, 
    toggleBookmark, 
    applicationHistory, 
    addApplication,
    darkMode 
  } = useAppContext()
  
  const router = useRouter()
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  
  const job = jobs.find(j => j.id === parseInt(jobId))
  const isBookmarked = bookmarkedJobs.includes(parseInt(jobId))
  const hasApplied = applicationHistory.some(app => app.jobId === parseInt(jobId))

  // Using CSS variables from Apple Design System
  const theme = {
    bg: 'var(--bg-primary)',
    cardBg: 'var(--bg-tertiary)',
    text: 'var(--text-primary)',
    textSecondary: 'var(--text-secondary)',
    border: 'var(--separator)',
    accent: 'var(--blue)'
  }

  if (!job) {
    return (
      <Layout>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '2rem 1rem',
          textAlign: 'center'
        }}>
          <AlertTriangle size={64} color={theme.textSecondary} style={{ marginBottom: '1rem' }} />
          <h1 style={{ color: theme.text, fontSize: '2rem', marginBottom: '1rem' }}>
            채용공고를 찾을 수 없습니다
          </h1>
          <p style={{ color: theme.textSecondary, marginBottom: '2rem' }}>
            요청하신 채용공고가 존재하지 않거나 삭제되었을 수 있습니다.
          </p>
          <button
            onClick={() => router.back()}
            style={{
              background: theme.accent,
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ArrowLeft size={16} />
            돌아가기
          </button>
        </div>
      </Layout>
    )
  }

  const handleApply = () => {
    if (hasApplied) {
      alert('이미 지원한 공고입니다.')
      return
    }
    
    setShowApplicationModal(true)
  }

  const confirmApplication = () => {
    const application = {
      jobId: job.id,
      appliedAt: new Date().toISOString(),
      status: 'applied',
      notes: ''
    }
    
    addApplication(application)
    setShowApplicationModal(false)
    
    setTimeout(() => {
      alert('지원이 완료되었습니다!')
    }, 100)
  }

  const daysUntilDeadline = job.deadline ? 
    Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          style={{
            background: 'transparent',
            border: `1px solid ${theme.border}`,
            color: theme.text,
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            (e.target as HTMLElement).style.background = theme.border
          }}
          onMouseOut={(e) => {
            (e.target as HTMLElement).style.background = 'transparent'
          }}
        >
          <ArrowLeft size={16} />
          뒤로가기
        </button>

        {/* Job Header */}
        <div style={{
          background: theme.cardBg,
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: theme.text,
                marginBottom: '1rem',
                lineHeight: '1.2'
              }}>
                {job.title}
              </h1>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Building size={20} color={theme.accent} />
                <span style={{ fontSize: '1.25rem', fontWeight: '600', color: theme.text }}>
                  {job.company.name}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: theme.textSecondary }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} />
                  {job.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Briefcase size={16} />
                  {job.employment_type}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <DollarSign size={16} />
                  {job.salary_min.toLocaleString()}만원 - {job.salary_max.toLocaleString()}만원
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => toggleBookmark(job.id)}
                className={`btn ${isBookmarked ? 'btn-secondary' : 'btn-secondary'}`}
                style={{
                  background: isBookmarked ? 'var(--orange)' : 'var(--fill-tertiary)',
                  color: isBookmarked ? 'white' : 'var(--blue)',
                  border: `1px solid ${isBookmarked ? 'var(--orange)' : 'var(--fill-secondary)'}`,
                  padding: '0.75rem'
                }}
              >
                {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              </button>
              
              <button
                onClick={handleApply}
                disabled={hasApplied}
                className={`btn ${hasApplied ? 'btn-secondary' : 'btn-primary'}`}
                style={{
                  opacity: hasApplied ? 0.6 : 1,
                  cursor: hasApplied ? 'not-allowed' : 'pointer'
                }}
              >
                {hasApplied ? '지원완료' : '지원하기'}
              </button>
            </div>
          </div>
          
          {/* Deadline Alert */}
          {daysUntilDeadline !== null && daysUntilDeadline <= 7 && (
            <div style={{
              background: daysUntilDeadline <= 3 ? '#fee2e2' : '#fef3c7',
              color: daysUntilDeadline <= 3 ? '#dc2626' : '#d97706',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              <Clock size={16} />
              마감까지 {daysUntilDeadline}일 남았습니다!
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main Content */}
          <div>
            {/* Job Description */}
            <div style={{
              background: theme.cardBg,
              borderRadius: '1rem',
              padding: '2rem',
              marginBottom: '2rem',
              border: `1px solid ${theme.border}`,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: theme.text,
                marginBottom: '1rem'
              }}>
                채용공고
              </h2>
              <p style={{
                color: theme.text,
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div style={{
                background: theme.cardBg,
                borderRadius: '1rem',
                padding: '2rem',
                marginBottom: '2rem',
                border: `1px solid ${theme.border}`,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: theme.text,
                  marginBottom: '1rem'
                }}>
                  자격요건
                </h2>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {job.requirements.map((req, index) => (
                    <li key={index} style={{
                      color: theme.text,
                      marginBottom: '0.5rem',
                      lineHeight: '1.5'
                    }}>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div style={{
                background: theme.cardBg,
                borderRadius: '1rem',
                padding: '2rem',
                border: `1px solid ${theme.border}`,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: theme.text,
                  marginBottom: '1rem'
                }}>
                  복리후생
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  {job.benefits.map((benefit, index) => {
                    const getBenefitIcon = (benefit: string) => {
                      if (benefit.includes('유연근무') || benefit.includes('원격')) return <Home size={16} />
                      if (benefit.includes('교육') || benefit.includes('컨퍼런스')) return <Award size={16} />
                      if (benefit.includes('점심') || benefit.includes('식사')) return <Coffee size={16} />
                      if (benefit.includes('차량') || benefit.includes('주차')) return <Car size={16} />
                      if (benefit.includes('건강') || benefit.includes('의료')) return <Heart size={16} />
                      return <Star size={16} />
                    }
                    
                    return (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem',
                        background: darkMode ? '#0f172a' : '#f8fafc',
                        borderRadius: '0.5rem',
                        color: theme.text
                      }}>
                        {getBenefitIcon(benefit)}
                        {benefit}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Company Info */}
            <div style={{
              background: theme.cardBg,
              borderRadius: '1rem',
              padding: '2rem',
              marginBottom: '2rem',
              border: `1px solid ${theme.border}`,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: theme.text,
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Building size={24} />
                회사정보
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: theme.text,
                    marginBottom: '0.5rem'
                  }}>
                    {job.company.name}
                  </h3>
                  <p style={{
                    color: theme.textSecondary,
                    fontSize: '0.875rem',
                    lineHeight: '1.5'
                  }}>
                    {job.company.description}
                  </p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0',
                    borderBottom: `1px solid ${theme.border}`
                  }}>
                    <span style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>업종</span>
                    <span style={{ color: theme.text, fontSize: '0.875rem', fontWeight: '500' }}>
                      {job.company.industry}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0',
                    borderBottom: `1px solid ${theme.border}`
                  }}>
                    <span style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>직원수</span>
                    <span style={{ color: theme.text, fontSize: '0.875rem', fontWeight: '500' }}>
                      {job.company.employeeCount}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0',
                    borderBottom: `1px solid ${theme.border}`
                  }}>
                    <span style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>설립년도</span>
                    <span style={{ color: theme.text, fontSize: '0.875rem', fontWeight: '500' }}>
                      {job.company.founded}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0',
                    borderBottom: `1px solid ${theme.border}`
                  }}>
                    <span style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>위치</span>
                    <span style={{ color: theme.text, fontSize: '0.875rem', fontWeight: '500' }}>
                      {job.company.location}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0'
                  }}>
                    <span style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>웹사이트</span>
                    <a 
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        color: theme.accent, 
                        fontSize: '0.875rem', 
                        fontWeight: '500',
                        textDecoration: 'none'
                      }}
                    >
                      <Globe size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                      방문하기
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Info */}
            <div style={{
              background: theme.cardBg,
              borderRadius: '1rem',
              padding: '2rem',
              border: `1px solid ${theme.border}`,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: theme.text,
                marginBottom: '1.5rem'
              }}>
                채용정보
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: `1px solid ${theme.border}`
                }}>
                  <span style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>게시일</span>
                  <span style={{ color: theme.text, fontSize: '0.875rem', fontWeight: '500' }}>
                    {new Date(job.posted_date).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                
                {job.deadline && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0',
                    borderBottom: `1px solid ${theme.border}`
                  }}>
                    <span style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>마감일</span>
                    <span style={{ 
                      color: daysUntilDeadline !== null && daysUntilDeadline <= 3 ? '#dc2626' : theme.text, 
                      fontSize: '0.875rem', 
                      fontWeight: '500' 
                    }}>
                      {new Date(job.deadline).toLocaleDateString('ko-KR')}
                      {daysUntilDeadline !== null && daysUntilDeadline >= 0 && (
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>
                          (D-{daysUntilDeadline})
                        </span>
                      )}
                    </span>
                  </div>
                )}
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: `1px solid ${theme.border}`
                }}>
                  <span style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>근무형태</span>
                  <span style={{ color: theme.text, fontSize: '0.875rem', fontWeight: '500' }}>
                    {job.employment_type}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0'
                }}>
                  <span style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>원격근무</span>
                  <span style={{ color: theme.text, fontSize: '0.875rem', fontWeight: '500' }}>
                    {job.remote_available ? '가능' : '불가능'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Modal */}
        {showApplicationModal && (
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
              width: '90%',
              textAlign: 'center'
            }}>
              <CheckCircle size={64} color="#10b981" style={{ marginBottom: '1rem' }} />
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: theme.text,
                marginBottom: '1rem'
              }}>
                지원하시겠습니까?
              </h3>
              <p style={{
                color: theme.textSecondary,
                marginBottom: '2rem'
              }}>
                {job.company.name}의 {job.title} 포지션에 지원합니다.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${theme.border}`,
                    color: theme.text,
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  취소
                </button>
                <button
                  onClick={confirmApplication}
                  style={{
                    background: theme.accent,
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  지원하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default JobDetailPage