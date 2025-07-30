'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useJobsContext, useUserPreferencesContext, useApplicationsContext } from '@/contexts/AppContext'
import { useRouter } from 'next/navigation'
import Layout from './Layout'
import VirtualizedJobList from './VirtualizedJobList'
import { Search, Filter, Bell, Calendar, MapPin, Building, Loader2, Plus, X, BellRing, BellOff, FileText, Clock, TrendingUp, AlertTriangle } from 'lucide-react'
import { useOptimizedJobData } from '@/hooks/useOptimizedJobData'

// Mock 데이터
const mockJobsData = [
  {
    id: 1,
    title: "Frontend Developer - React/Next.js",
    company: {
      name: "TechCorp Inc.",
      employeeCount: "100-500명",
      industry: "IT 서비스",
      founded: "2015년",
      location: "서울시 강남구",
      website: "https://techcorp.com",
      description: "혁신적인 기술 솔루션을 제공하는 IT 기업으로, 글로벌 시장에서 인정받는 소프트웨어 개발 회사입니다."
    },
    location: "Seoul, South Korea",
    posted_date: "2024-07-13",
    deadline: "2024-07-16",
    description: "We are looking for a skilled Frontend Developer with expertise in React, Next.js, TypeScript, and modern web technologies.",
    url: "https://example.com/job1",
    keywords: ["React", "Next.js", "TypeScript", "JavaScript", "Frontend", "UI/UX"],
    salary_min: 4000,
    salary_max: 6000,
    employment_type: "full-time",
    remote_available: true,
    requirements: [
      "React, Next.js 3년 이상 실무 경험",
      "TypeScript 활용 능력",
      "반응형 웹 개발 경험",
      "Git을 이용한 협업 경험",
      "RESTful API 연동 경험"
    ],
    benefits: [
      "유연근무제",
      "연봉 상한선 없음",
      "교육비 지원",
      "건강검진비 지원",
      "점심 제공"
    ]
  },
  {
    id: 2,
    title: "UX Designer - Product Design",
    company: {
      name: "DesignStudio Co.",
      employeeCount: "50-100명",
      industry: "디자인 에이전시",
      founded: "2018년",
      location: "부산시 해운대구",
      website: "https://designstudio.co.kr",
      description: "사용자 중심의 디자인으로 브랜드 가치를 높이는 전문 디자인 스튜디오입니다."
    },
    location: "Busan, South Korea",
    posted_date: "2024-07-12",
    deadline: "2024-07-15",
    description: "Join our product design team as a UX Designer. You will create user-centered designs and conduct user research.",
    url: "https://example.com/job2",
    keywords: ["UX", "UI", "Design", "Figma", "User Research", "Product Design"],
    salary_min: 3500,
    salary_max: 5500,
    employment_type: "full-time",
    remote_available: false,
    requirements: [
      "UX/UI 디자인 2년 이상 경험",
      "Figma, Sketch 숙련도",
      "사용자 리서치 경험",
      "프로토타이핑 능력",
      "디자인 시스템 구축 경험"
    ],
    benefits: [
      "크리에이티브 환경",
      "디자인 도구 지원",
      "포트폴리오 제작 지원",
      "컨퍼런스 참가비 지원",
      "자유로운 복장"
    ]
  },
  {
    id: 3,
    title: "Full Stack Developer - Node.js & React",
    company: {
      name: "StartupHub",
      employeeCount: "10-50명",
      industry: "핀테크",
      founded: "2020년",
      location: "원격근무",
      website: "https://startuphub.io",
      description: "차세대 금융 서비스를 개발하는 혁신적인 핀테크 스타트업입니다."
    },
    location: "Remote",
    posted_date: "2024-07-11",
    deadline: "2024-07-20",
    description: "We are seeking a Full Stack Developer proficient in Node.js, React, MongoDB, and cloud technologies.",
    url: "https://example.com/job3",
    keywords: ["React", "Node.js", "MongoDB", "JavaScript", "Full Stack", "SaaS"],
    salary_min: 4500,
    salary_max: 7000,
    employment_type: "full-time",
    remote_available: true,
    requirements: [
      "Node.js, React 개발 경험 3년 이상",
      "MongoDB, PostgreSQL 사용 경험",
      "AWS 클라우드 서비스 경험",
      "Docker, Kubernetes 이해",
      "금융 도메인 이해 우대"
    ],
    benefits: [
      "완전 원격근무",
      "스톡옵션 제공",
      "최신 장비 지원",
      "자기계발비 지원",
      "자율출퇴근"
    ]
  }
]

const JobHunter = () => {
  const { jobs, setJobs, userKeywords, setUserKeywords } = useJobsContext()
  const { bookmarkedJobs, darkMode } = useUserPreferencesContext()
  const { applicationHistory, addApplication } = useApplicationsContext()
  const { processedJobs, urgentJobs, stats, highlightKeywords } = useOptimizedJobData()

  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [keywordNotifications, setKeywordNotifications] = useState([
    { keyword: 'React', frequency: 'daily' },
    { keyword: 'UX Designer', frequency: 'weekly' }
  ])
  const [newKeyword, setNewKeyword] = useState('')
  const [sortBy, setSortBy] = useState('posted_date')
  const [filterScore, setFilterScore] = useState(0)
  // Removed currentPage state - virtualization handles scrolling
  const [showApplicationHistory, setShowApplicationHistory] = useState(false)
  const [showInsights] = useState(false)
  const [showKeywordSettings, setShowKeywordSettings] = useState(false)
  const [showApplicationPopup, setShowApplicationPopup] = useState(false)
  const [currentAppliedJob, setCurrentAppliedJob] = useState<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [showJobDetails, setShowJobDetails] = useState(false)
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  // Removed jobsPerPage - virtualization handles display

  // Using CSS variables from Apple Design System
  const theme = {
    bg: 'var(--bg-primary)',
    cardBg: 'var(--bg-tertiary)',
    text: 'var(--text-primary)',
    textSecondary: 'var(--text-secondary)',
    border: 'var(--separator)'
  }

  // 컴포넌트 마운트 상태 추적
  useEffect(() => {
    setMounted(true)
  }, [])

  // 데이터 로딩
  useEffect(() => {
    if (mounted) {
      setTimeout(() => {
        setJobs(mockJobsData)
        setLoading(false)
      }, 800)
    }
  }, [mounted, setJobs])

  // Using data from useOptimizedJobData hook (removed duplicate calculations)

  // 필터링 및 정렬
  const filteredJobs = useMemo(() => {
    const filtered = processedJobs.filter(job => job.matchScore >= filterScore)
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'matchScore': 
          return b.matchScore - a.matchScore
        case 'deadline': 
          if (!a.deadline && !b.deadline) return 0
          if (!a.deadline) return 1
          if (!b.deadline) return -1
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        default: 
          return new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime()
      }
    })
  }, [processedJobs, sortBy, filterScore])

  // Removed pagination logic - using VirtualizedJobList

  // 키워드 추가
  const addKeyword = () => {
    if (newKeyword.trim() && !userKeywords.includes(newKeyword.trim())) {
      setUserKeywords([...userKeywords, newKeyword.trim()])
      setKeywordNotifications([...keywordNotifications, { keyword: newKeyword.trim(), frequency: 'daily' }])
      setNewKeyword('')
    }
  }

  // 키워드 제거
  const removeKeyword = (keyword: string) => {
    setUserKeywords(userKeywords.filter(k => k !== keyword))
    setKeywordNotifications(keywordNotifications.filter(k => k.keyword !== keyword))
  }

  // 알림 설정 변경
  const updateKeywordNotification = (keyword: string, frequency: string) => {
    setKeywordNotifications(prev => 
      prev.map(k => k.keyword === keyword ? { ...k, frequency } : k)
    )
  }

  // 지원하기
  const applyToJob = (job: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const newApplication = {
      jobId: job.id,
      appliedAt: new Date().toISOString(),
      status: 'applied',
      notes: ''
    }
    addApplication(newApplication)
    setCurrentAppliedJob(job)
    setShowApplicationPopup(true)
  }


  // Using highlightKeywords and stats from useOptimizedJobData hook (removed duplicate calculations)

  // 인사이트
  const insights = [
    `지원한 공고: ${applicationHistory.length}개`,
    `북마크한 공고: ${bookmarkedJobs.length}개`,
    `평균 매칭률: ${stats.avgMatchScore}%`,
    userKeywords.length > 0 ? `가장 많이 매칭된 키워드: ${userKeywords[0]}` : ''
  ].filter(Boolean)

  // 서버 사이드 렌더링 시에는 빈 div 반환
  if (!mounted) {
    return <div />
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        height: '100vh', background: theme.bg, color: '#667eea', gap: '1rem'
      }}>
        <Loader2 size={48} style={{ animation: 'spin 1s linear infinite' }} />
        <div style={{ fontSize: '1.5rem' }}>Job Hunter v3.0 로딩 중...</div>
        <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>잊지 마세요. 당신의 가능성은 무한합니다✨</div>
      </div>
    )
  }

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* 마감 임박 알림 */}
        {urgentJobs.length > 0 && (
          <div style={{ 
            background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)', 
            border: '2px solid #f59e0b', 
            borderRadius: '1rem', 
            padding: '1rem', 
            marginBottom: '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem' 
          }}>
            <AlertTriangle size={20} color="#f59e0b" />
            <span style={{ fontWeight: '600', color: '#92400e' }}>
              ⚡ 마감 임박! {urgentJobs.length}개의 공고가 3일 이내 마감됩니다
            </span>
          </div>
        )}

        {/* 인사이트 패널 */}
        {showInsights && (
          <div style={{ 
            background: theme.cardBg, 
            borderRadius: '1rem', 
            padding: '1.5rem', 
            marginBottom: '2rem', 
            border: `1px solid ${theme.border}`,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              margin: '0 0 1rem 0', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: theme.text
            }}>
              <TrendingUp size={20} /> 📈 나의 취업 활동 인사이트
            </h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {insights.map((insight, index) => (
                <div key={index} style={{ 
                  color: theme.textSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ color: '#10b981' }}>•</span>
                  {insight}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 지원 이력 패널 */}
        {showApplicationHistory && (
          <div style={{ 
            background: theme.cardBg, 
            borderRadius: '1rem', 
            padding: '1.5rem', 
            marginBottom: '2rem', 
            border: `1px solid ${theme.border}`,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              margin: '0 0 1rem 0', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: theme.text
            }}>
              <FileText size={20} /> 📋 지원 이력 관리
            </h3>
            {applicationHistory.length === 0 ? (
              <p style={{ color: theme.textSecondary }}>아직 지원한 공고가 없습니다. 지원하기 버튼을 눌러 자동으로 저장해보세요!</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {applicationHistory.map((app, index) => {
                  const job = jobs.find(j => j.id === app.jobId)
                  if (!job) return null
                  return (
                    <div key={index} style={{ 
                      border: `1px solid ${theme.border}`, 
                      borderRadius: '0.5rem', 
                      padding: '1rem',
                      background: darkMode ? '#0f172a' : '#f8fafc'
                    }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: theme.text }}>{job.title}</h4>
                      <p style={{ 
                        margin: '0', 
                        fontSize: '0.875rem', 
                        color: theme.textSecondary 
                      }}>
                        {job.company.name} • 지원일: {new Date(app.appliedAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* 키워드 섹션 */}
        <div style={{ 
          background: theme.cardBg, 
          borderRadius: '1rem', 
          padding: '1.5rem', 
          marginBottom: '2rem', 
          border: `1px solid ${theme.border}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              margin: 0, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: theme.text
            }}>
              <Search size={20} /> 관심 키워드 설정
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button 
                onClick={() => setShowKeywordSettings(!showKeywordSettings)} 
                style={{ 
                  background: showKeywordSettings ? '#667eea' : 'transparent', 
                  border: `1px solid ${theme.border}`, 
                  color: showKeywordSettings ? 'white' : theme.text, 
                  padding: '0.5rem 1rem', 
                  borderRadius: '0.5rem', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  fontSize: '0.75rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <BellRing size={14} /> 알림 설정
              </button>
            </div>
          </div>

          {/* 키워드 알림 설정 */}
          {showKeywordSettings && (
            <div style={{ 
              background: darkMode ? '#0f172a' : '#f8fafc', 
              border: `1px solid ${theme.border}`, 
              borderRadius: '0.5rem', 
              padding: '1rem', 
              marginBottom: '1rem' 
            }}>
              <h4 style={{ margin: '0 0 1rem 0', color: theme.text }}>🔔 키워드별 알림 설정</h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {keywordNotifications.map((notification, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '0.5rem', 
                    background: theme.cardBg, 
                    borderRadius: '0.25rem',
                    border: `1px solid ${theme.border}`
                  }}>
                    <span style={{ color: theme.text }}>{notification.keyword}</span>
                    <select 
                      value={notification.frequency} 
                      onChange={(e) => updateKeywordNotification(notification.keyword, e.target.value)} 
                      style={{ 
                        padding: '0.25rem 0.5rem', 
                        border: `1px solid ${theme.border}`, 
                        borderRadius: '0.25rem', 
                        background: theme.cardBg, 
                        color: theme.text,
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="daily">매일</option>
                      <option value="weekly">주 1회</option>
                      <option value="off">알림 안함</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            marginBottom: '1rem', 
            flexWrap: 'wrap' 
          }}>
            <input 
              type="text" 
              value={newKeyword} 
              onChange={(e) => setNewKeyword(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && addKeyword()} 
              placeholder="키워드를 입력하세요 (예: Python, Backend)" 
              style={{ 
                flex: 1, 
                minWidth: '250px', 
                padding: '0.75rem', 
                border: `2px solid ${theme.border}`, 
                borderRadius: '0.5rem', 
                background: theme.cardBg, 
                color: theme.text,
                fontSize: '1rem',
                outline: 'none'
              }} 
            />
            <button 
              onClick={addKeyword} 
              style={{ 
                background: '#667eea', 
                color: 'white', 
                border: 'none', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '0.5rem', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                fontWeight: '500',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#5a67d8'}
              onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#667eea'}
            >
              <Plus size={16} /> 추가
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {userKeywords.map(keyword => {
              const notification = keywordNotifications.find(n => n.keyword === keyword)
              return (
                <span 
                  key={keyword} 
                  onClick={() => removeKeyword(keyword)} 
                  style={{ 
                    background: notification?.frequency === 'off' ? '#6b7280' : '#667eea', 
                    color: 'white', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '1.5rem', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {keyword}
                  {notification?.frequency === 'off' ? <BellOff size={12} /> : <Bell size={12} />}
                  <X size={14} />
                </span>
              )
            })}
          </div>
        </div>

        {/* 통계 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          {[
            { value: stats.totalJobs, label: '총 채용공고', color: '#667eea' },
            { value: stats.matchedJobs, label: '매칭 공고', color: '#10b981' },
            { value: `${stats.avgMatchScore}%`, label: '평균 일치율', color: '#f59e0b' },
            { value: stats.urgentJobs, label: '마감 임박', color: '#ef4444' }
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

        {/* 필터 */}
        <div style={{ 
          background: theme.cardBg, 
          padding: '1rem 1.5rem', 
          borderRadius: '1rem', 
          marginBottom: '1.5rem', 
          display: 'flex', 
          gap: '1rem', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          border: `1px solid ${theme.border}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color={theme.text} />
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: theme.text }}>최소 일치율:</label>
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
              <option value="matchScore">일치율 높은 순</option>
              <option value="posted_date">최신 등록순</option>
              <option value="deadline">마감 임박순</option>
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

        {/* 공고 목록 - VirtualizedJobList */}
        <VirtualizedJobList
          jobs={filteredJobs}
          height={800}
          onJobClick={(job) => router.push(`/jobs/${job.id}`)}
          onApplyClick={applyToJob}
        />

        {/* Pagination removed - VirtualizedJobList handles scrolling */}

        {/* Application Success Popup */}
        {showApplicationPopup && currentAppliedJob && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: theme.cardBg,
              borderRadius: '1rem',
              padding: '2rem',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              border: `1px solid ${theme.border}`,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>✅</div>
              
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: theme.text,
                marginBottom: '0.5rem'
              }}>
                지원이 완료되었습니다!
              </h3>
              
              <p style={{
                color: theme.textSecondary,
                marginBottom: '1.5rem',
                fontSize: '0.875rem'
              }}>
                &ldquo;{currentAppliedJob.title}&rdquo; 공고에<br/>
                성공적으로 지원되었습니다.
              </p>
              
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => {
                    setShowApplicationPopup(false)
                    if (currentAppliedJob) {
                      router.push(`/jobs/${currentAppliedJob.id}`)
                    }
                  }}
                  style={{
                    background: '#667eea',
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
                  onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#5a67d8'}
                  onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#667eea'}
                >
                  <FileText size={16} /> 지원한 공고 확인
                </button>
                
                <button
                  onClick={() => setShowApplicationPopup(false)}
                  style={{
                    background: 'transparent',
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = theme.border
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = 'transparent'
                  }}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Job Details Modal */}
        {showJobDetails && selectedJobForDetails && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div style={{
              background: theme.cardBg,
              borderRadius: '1rem',
              padding: '2rem',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: `1px solid ${theme.border}`,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              position: 'relative'
            }}>
              {/* Close button */}
              <button
                onClick={() => {
                  setShowJobDetails(false)
                  setSelectedJobForDetails(null)
                }}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'transparent',
                  border: 'none',
                  color: theme.textSecondary,
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = theme.border}
                onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
              >
                <X size={24} />
              </button>

              {/* Job header */}
              <div style={{ marginBottom: '2rem', paddingRight: '3rem' }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: theme.text,
                  marginBottom: '1rem',
                  lineHeight: 1.3
                }} dangerouslySetInnerHTML={{ __html: highlightKeywords(selectedJobForDetails.title) }} />
                
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  fontSize: '0.875rem',
                  color: theme.textSecondary,
                  marginBottom: '1rem'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Building size={16} /> {selectedJobForDetails.company}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={16} /> {selectedJobForDetails.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={16} /> 등록일: {new Date(selectedJobForDetails.posted_date).toLocaleDateString('ko-KR')}
                  </span>
                  {selectedJobForDetails.deadline && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={16} /> 마감: {new Date(selectedJobForDetails.deadline).toLocaleDateString('ko-KR')}
                    </span>
                  )}
                </div>

                {/* Merit badges */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap'
                }}>
                  {selectedJobForDetails.remote_available && (
                    <span style={{ 
                      background: darkMode ? '#064e3b' : '#dcfce7', 
                      color: darkMode ? '#34d399' : '#166534', 
                      padding: '0.375rem 0.75rem', 
                      borderRadius: '0.375rem', 
                      fontSize: '0.813rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      border: darkMode ? '1px solid #10b981' : 'none'
                    }}>
                      🏠 원격근무
                    </span>
                  )}
                  {selectedJobForDetails.salary_max >= 6000 && (
                    <span style={{ 
                      background: darkMode ? '#3730a3' : '#e0e7ff', 
                      color: darkMode ? '#a5b4fc' : '#4338ca', 
                      padding: '0.375rem 0.75rem', 
                      borderRadius: '0.375rem', 
                      fontSize: '0.813rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      border: darkMode ? '1px solid #6366f1' : 'none'
                    }}>
                      💰 고연봉
                    </span>
                  )}
                  {selectedJobForDetails.employment_type === 'full-time' && (
                    <span style={{ 
                      background: darkMode ? '#7c2d12' : '#fee2e2', 
                      color: darkMode ? '#fca5a5' : '#dc2626', 
                      padding: '0.375rem 0.75rem', 
                      borderRadius: '0.375rem', 
                      fontSize: '0.813rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      border: darkMode ? '1px solid #ef4444' : 'none'
                    }}>
                      ⏰ 정규직
                    </span>
                  )}
                </div>
              </div>

              {/* Job details sections */}
              <div style={{ display: 'grid', gap: '2rem' }}>
                {/* Job description */}
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: theme.text,
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    📋 상세 설명
                  </h3>
                  <div style={{
                    background: darkMode ? '#0f172a' : '#f8fafc',
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    border: `1px solid ${theme.border}`,
                    color: theme.textSecondary,
                    lineHeight: 1.6
                  }} dangerouslySetInnerHTML={{ __html: highlightKeywords(selectedJobForDetails.description) }} />
                </div>

                {/* Salary info */}
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: theme.text,
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    💰 급여 정보
                  </h3>
                  <div style={{
                    background: darkMode ? '#0f172a' : '#f8fafc',
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    border: `1px solid ${theme.border}`,
                    color: theme.text,
                    fontSize: '1.125rem',
                    fontWeight: '600'
                  }}>
                    {selectedJobForDetails.salary_min && selectedJobForDetails.salary_max 
                      ? `${selectedJobForDetails.salary_min.toLocaleString()}만 - ${selectedJobForDetails.salary_max.toLocaleString()}만원`
                      : '급여 협의'}
                  </div>
                </div>

                {/* Keywords */}
                {selectedJobForDetails.keywords && selectedJobForDetails.keywords.length > 0 && (
                  <div>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: theme.text,
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      🏷️ 관련 키워드
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {selectedJobForDetails.keywords.map((keyword: string, index: number) => (
                        <span 
                          key={index}
                          style={{ 
                            background: '#667eea', 
                            color: 'white', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '1rem', 
                            fontSize: '0.875rem', 
                            fontWeight: '500'
                          }}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Application note */}
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: theme.text,
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    📝 지원 정보
                  </h3>
                  <div style={{
                    background: '#dcfce7',
                    color: '#166534',
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #10b981'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                      ✅ 지원 완료된 공고입니다
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                      지원일: {applicationHistory.find(app => app.jobId === selectedJobForDetails.id)?.appliedAt ? 
                        new Date(applicationHistory.find(app => app.jobId === selectedJobForDetails.id)!.appliedAt).toLocaleDateString('ko-KR') : 
                        '정보 없음'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                marginTop: '2rem',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => {
                    setShowJobDetails(false)
                    setShowApplicationHistory(true)
                  }}
                  style={{
                    background: '#667eea',
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
                  onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#5a67d8'}
                  onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#667eea'}
                >
                  <FileText size={16} /> 전체 지원이력 보기
                </button>
                
                <button
                  onClick={() => {
                    setShowJobDetails(false)
                    setSelectedJobForDetails(null)
                  }}
                  style={{
                    background: 'transparent',
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = theme.border
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = 'transparent'
                  }}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ 
          textAlign: 'center', 
          padding: '3rem 0 2rem', 
          color: theme.textSecondary, 
          fontSize: '0.875rem' 
        }}>
          <div style={{ 
            background: theme.cardBg, 
            borderRadius: '1rem', 
            padding: '2rem', 
            border: `1px solid ${theme.border}`,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ 
              fontWeight: '600', 
              marginBottom: '0.5rem', 
              fontSize: '1.1rem',
              color: theme.text
            }}>
              🚀 Job Hunter v3.0 - Multi-Page 업데이트! ✨
            </p>
            <p style={{ 
              marginBottom: '1rem', 
              color: theme.textSecondary 
            }}>
              키워드별 알림 설정,<br className="mobile-break"/>
              지원 이력 자동 저장,<br className="mobile-break"/>
              다크모드 기능 추가!
            </p>
            <div className="feature-list-mobile" style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '1rem', 
              fontSize: '0.8rem', 
              color: theme.textSecondary,
              flexWrap: 'wrap'
            }}>
              <span>🔔 키워드별 알림</span>
              <span>💾 지원이력 자동저장</span>
              <span>📅 마감임박 알림</span>
              <span>🌙 다크모드</span>
              <span>📊 취업활동 인사이트</span>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  )
}

export default JobHunter