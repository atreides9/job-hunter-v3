'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Search, Filter, Bell, Calendar, MapPin, Building, Percent, ChevronLeft, ChevronRight, Loader2, Plus, X, Moon, Sun, BellRing, BellOff, FileText, Clock, TrendingUp, Bookmark, BookmarkCheck, AlertTriangle, BarChart } from 'lucide-react'
 

//gemini 2.5 flash 사용
// Job.ts 또는 types.ts 파일에 정의되어 있을 가능성이 높습니다.
// 만약 없다면 JobHunter.tsx 파일 상단에 추가해도 무방합니다.
interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  posted_date: string;
  deadline: string;
  description: string;
  url: string;
  keywords: string[];
  salary_min: number;
  salary_max: number;
  employment_type: string;
  remote_available: boolean;
}

interface ApplicationHistory {
  jobId: number;
  appliedAt: string;
  status: string;
  notes: string;
}


// Mock 데이터
const mockJobsData = [
  {
    id: 1,
    title: "Frontend Developer - React/Next.js",
    company: "TechCorp Inc.",
    location: "Seoul, South Korea",
    posted_date: "2024-07-13",
    deadline: "2024-07-16",
    description: "We are looking for a skilled Frontend Developer with expertise in React, Next.js, TypeScript, and modern web technologies.",
    url: "https://example.com/job1",
    keywords: ["React", "Next.js", "TypeScript", "JavaScript", "Frontend", "UI/UX"],
    salary_min: 4000,
    salary_max: 6000,
    employment_type: "full-time",
    remote_available: true
  },
  {
    id: 2,
    title: "UX Designer - Product Design",
    company: "DesignStudio Co.",
    location: "Busan, South Korea",
    posted_date: "2024-07-12",
    deadline: "2024-07-15",
    description: "Join our product design team as a UX Designer. You will create user-centered designs and conduct user research.",
    url: "https://example.com/job2",
    keywords: ["UX", "UI", "Design", "Figma", "User Research", "Product Design"],
    salary_min: 3500,
    salary_max: 5500,
    employment_type: "full-time",
    remote_available: false
  },
  {
    id: 3,
    title: "Full Stack Developer - Node.js & React",
    company: "StartupHub",
    location: "Remote",
    posted_date: "2024-07-11",
    deadline: "2024-07-20",
    description: "We are seeking a Full Stack Developer proficient in Node.js, React, MongoDB, and cloud technologies.",
    url: "https://example.com/job3",
    keywords: ["React", "Node.js", "MongoDB", "JavaScript", "Full Stack", "SaaS"],
    salary_min: 4500,
    salary_max: 7000,
    employment_type: "full-time",
    remote_available: true
  }
]

const JobHunter = () => {
  //const [jobs, setJobs] = useState([])
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [userKeywords, setUserKeywords] = useState(['React', 'UX Designer'])
  const [keywordNotifications, setKeywordNotifications] = useState([
    { keyword: 'React', frequency: 'daily' },
    { keyword: 'UX Designer', frequency: 'weekly' }
  ])
  const [newKeyword, setNewKeyword] = useState('')
  const [sortBy, setSortBy] = useState('posted_date')
  const [filterScore, setFilterScore] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [darkMode, setDarkMode] = useState(false)
  const [applicationHistory, setApplicationHistory] = useState<ApplicationHistory[]>([])
  const [bookmarkedJobs, setBookmarkedJobs] = useState<number[]>([])
  const [jobNotes, setJobNotes] = useState<{[key: number]: string}>({})
  const [showApplicationHistory, setShowApplicationHistory] = useState(false)
  const [showInsights, setShowInsights] = useState(false)
  const [showKeywordSettings, setShowKeywordSettings] = useState(false)
  const jobsPerPage = 3

  // 다크모드 테마
  const theme = {
    bg: darkMode ? '#0f172a' : '#f8fafc',
    cardBg: darkMode ? '#1e293b' : 'white',
    text: darkMode ? '#f1f5f9' : '#334155',
    textSecondary: darkMode ? '#94a3b8' : '#64748b',
    border: darkMode ? '#334155' : '#e2e8f0'
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
  }, [mounted])

  // 키워드 매칭 계산
  const processedJobs = useMemo(() => {
    return jobs.map(job => {
      const allText = `${job.title} ${job.description} ${job.keywords.join(' ')}`.toLowerCase()
      const matchedKeywords = userKeywords.filter(keyword => 
        allText.includes(keyword.toLowerCase())
      )
      const matchScore = userKeywords.length > 0 ? 
        Math.round((matchedKeywords.length / userKeywords.length) * 100) : 0
      
      return { ...job, matchedKeywords, matchScore }
    })
  }, [jobs, userKeywords])

  // 마감 임박 공고
  const urgentJobs = processedJobs.filter(job => {
    if (!job.deadline) return false
    const today = new Date()
    const deadline = new Date(job.deadline)
    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 3 && diffDays >= 0
  })

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

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  )

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
  const applyToJob = (job: Job) => {
    const newApplication = {
      jobId: job.id,
      appliedAt: new Date().toISOString(),
      status: 'applied',
      notes: ''
    }
    setApplicationHistory(prev => [...prev, newApplication])
    window.open(job.url, '_blank')
  }

  // 북마크 토글
  const toggleBookmark = (jobId: number) => {
    setBookmarkedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  // 메모 업데이트
  const updateJobNote = (jobId: number, note: string) => {
    setJobNotes(prev => ({ ...prev, [jobId]: note }))
  }

  // 하이라이팅
  const highlightKeywords = (text: string) => {
    if (!userKeywords.length) return text
    let highlightedText = text
    userKeywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi')
      highlightedText = highlightedText.replace(regex, '<mark style="background: linear-gradient(120deg, #fef08a 0%, #fde047 100%); padding: 3px 6px; border-radius: 4px; font-weight: 600;">$1</mark>')
    })
    return highlightedText
  }

  // 통계
  const stats = {
    totalJobs: processedJobs.length,
    matchedJobs: processedJobs.filter(job => job.matchScore > 0).length,
    avgMatchScore: processedJobs.length > 0 ? 
      Math.round(processedJobs.reduce((sum, job) => sum + job.matchScore, 0) / processedJobs.length) : 0,
    appliedJobs: applicationHistory.length,
    urgentJobs: urgentJobs.length
  }

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
        <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>새로운 기능들과 함께 돌아왔어요! ✨</div>
      </div>
    )
  }

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
      backgroundColor: theme.bg, 
      minHeight: '100vh', 
      color: theme.text,
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setShowInsights(!showInsights)} 
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
                fontSize: '0.875rem'
              }}
            >
              <BarChart size={16} /> 인사이트
            </button>
            <button 
              onClick={() => setShowApplicationHistory(!showApplicationHistory)} 
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
                fontSize: '0.875rem'
              }}
            >
              <FileText size={16} /> 지원이력 ({applicationHistory.length})
            </button>
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
                fontSize: '0.875rem'
              }}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />} 
              {darkMode ? '라이트' : '다크'}
            </button>
          </div>
        </div>
      </header>

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
                        {job.company} • 지원일: {new Date(app.appliedAt).toLocaleDateString('ko-KR')}
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
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()} 
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

        {/* 공고 카드 */}
        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
          {paginatedJobs.length === 0 ? (
            <div style={{
              background: theme.cardBg,
              borderRadius: '1rem',
              padding: '3rem',
              textAlign: 'center',
              border: `1px solid ${theme.border}`,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '1.5rem', color: theme.textSecondary, marginBottom: '1rem' }}>
                조건에 맞는 채용공고가 없습니다
              </div>
              <div style={{ color: theme.textSecondary }}>
                키워드나 필터 조건을 변경해보세요
              </div>
            </div>
          ) : (
            paginatedJobs.map(job => {
              const isBookmarked = bookmarkedJobs.includes(job.id)
              const hasApplied = applicationHistory.some(app => app.jobId === job.id)
              const daysUntilDeadline = job.deadline ? Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null
              
              const cardStyle = job.matchScore >= 70 ? {
                background: darkMode ? 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)' : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '2px solid #10b981',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
              } : {
                background: theme.cardBg,
                border: `1px solid ${theme.border}`,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }
              
              return (
                <div 
                  key={job.id} 
                  style={{
                    ...cardStyle,
                    borderRadius: '1rem', 
                    padding: '1.5rem', 
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = darkMode 
                      ? '0 8px 25px rgba(0, 0, 0, 0.4)' 
                      : '0 8px 25px rgba(0, 0, 0, 0.15)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = cardStyle.boxShadow
                  }}
                >
                  {/* 마감 임박 배지 */}
                  {daysUntilDeadline !== null && daysUntilDeadline <= 3 && daysUntilDeadline >= 0 && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '1rem', 
                      right: '1rem', 
                      background: '#ef4444', 
                      color: 'white', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem', 
                      fontWeight: '600', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.25rem',
                      zIndex: 1
                    }}>
                      <Clock size={12} /> D-{daysUntilDeadline}
                    </div>
                  )}

                  {/* 높은 매칭률 배지 */}
                  {job.matchScore >= 70 && (
                    <div style={{ 
                      position: 'absolute', 
                      top: daysUntilDeadline !== null && daysUntilDeadline <= 3 ? '3rem' : '1rem',
                      right: '1rem', 
                      background: '#10b981', 
                      color: 'white', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem', 
                      fontWeight: '600'
                    }}>
                      ⭐ 높은 매칭률
                    </div>
                  )}

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    marginBottom: '1rem', 
                    flexWrap: 'wrap', 
                    gap: '1rem' 
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '600', 
                        marginBottom: '0.5rem', 
                        paddingRight: '5rem',
                        color: theme.text,
                        lineHeight: 1.3
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
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={14} /> 마감: {new Date(job.deadline).toLocaleDateString('ko-KR')}
                          </span>
                        )}
                        {job.remote_available && (
                          <span style={{ 
                            background: '#dcfce7', 
                            color: '#166534', 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '0.25rem', 
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            🏠 원격근무
                          </span>
                        )}
                      </div>

                      <div style={{
                        fontSize: '0.875rem',
                        color: theme.textSecondary,
                        marginBottom: '0.5rem'
                      }}>
                        💰 급여: {job.salary_min && job.salary_max 
                          ? `${job.salary_min.toLocaleString()}만 - ${job.salary_max.toLocaleString()}만원`
                          : '협의'}
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
                      padding: '0.5rem 1rem', 
                      borderRadius: '1.5rem', 
                      fontSize: '0.875rem', 
                      fontWeight: '600' 
                    }}>
                      <Percent size={14} /> {job.matchScore}%
                    </div>
                  </div>

                  <p style={{ 
                    color: theme.textSecondary, 
                    lineHeight: 1.6, 
                    marginBottom: '1rem' 
                  }} 
                  dangerouslySetInnerHTML={{ __html: highlightKeywords(job.description) }} 
                  />

                  {job.matchedKeywords?.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: theme.textSecondary, 
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                      }}>
                        매칭된 키워드:
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {job.matchedKeywords.map(keyword => (
                          <span 
                            key={keyword}
                            onClick={(e) => {
                              e.stopPropagation()
                              setUserKeywords([keyword])
                              setCurrentPage(1)
                            }}
                            style={{ 
                              background: '#10b981', 
                              color: 'white', 
                              padding: '0.25rem 0.75rem', 
                              borderRadius: '1rem', 
                              fontSize: '0.75rem', 
                              fontWeight: '500',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                            onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#059669'}
                            onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#10b981'}
                          >
                            🔍 {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 메모 입력 */}
                  <div style={{ marginBottom: '1rem' }}>
                    <textarea
                      placeholder="💭 이 공고에 대한 메모를 추가하세요... (예: 포트폴리오 준비, 면접 질문 등)"
                      value={jobNotes[job.id] || ''}
                      onChange={(e) => updateJobNote(job.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: '100%',
                        minHeight: '3rem',
                        padding: '0.75rem',
                        border: `1px solid ${theme.border}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        background: darkMode ? '#0f172a' : '#f8fafc',
                        color: theme.text,
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        outline: 'none',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = theme.border}
                    />
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    flexWrap: 'wrap', 
                    gap: '1rem' 
                  }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          applyToJob(job)
                        }}
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
                        {hasApplied ? <BookmarkCheck size={16} /> : <FileText size={16} />}
                        {hasApplied ? '지원완료' : '지원하기'}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleBookmark(job.id)
                        }}
                        style={{ 
                          background: isBookmarked ? '#f59e0b' : 'transparent', 
                          color: isBookmarked ? 'white' : '#667eea', 
                          border: `1px solid ${isBookmarked ? '#f59e0b' : '#667eea'}`, 
                          padding: '0.75rem 1.5rem', 
                          borderRadius: '0.5rem', 
                          cursor: 'pointer', 
                          fontWeight: '500', 
                          fontSize: '0.875rem', 
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                        onMouseOver={(e) => {
                          if (!isBookmarked) {
                            (e.target as HTMLElement).style.backgroundColor = '#667eea'
                            ;(e.target as HTMLElement).style.color = 'white'
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!isBookmarked) {
                            (e.target as HTMLElement).style.backgroundColor = 'transparent'
                            ;(e.target as HTMLElement).style.color = '#667eea'
                          }
                        }}
                      >
                        {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                        {isBookmarked ? '북마크됨' : '북마크'}
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
                      <div>ID: {job.id}</div>
                      <div>{job.employment_type}</div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '1rem', 
            background: theme.cardBg, 
            padding: '1rem', 
            borderRadius: '1rem', 
            border: `1px solid ${theme.border}`,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.5rem 1rem', 
                border: `1px solid ${theme.border}`, 
                borderRadius: '0.5rem', 
                background: currentPage === 1 ? (darkMode ? '#374151' : '#f8fafc') : theme.cardBg, 
                color: currentPage === 1 ? theme.textSecondary : theme.text, 
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer', 
                transition: 'all 0.2s ease',
                fontSize: '0.875rem'
              }}
            >
              <ChevronLeft size={16} /> 이전
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{ 
                    padding: '0.5rem 0.75rem', 
                    border: `1px solid ${theme.border}`, 
                    borderRadius: '0.5rem', 
                    background: currentPage === page ? '#667eea' : theme.cardBg, 
                    color: currentPage === page ? 'white' : theme.text, 
                    cursor: 'pointer', 
                    fontWeight: currentPage === page ? '700' : '400',
                    fontSize: currentPage === page ? '0.95rem' : '0.875rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.5rem 1rem', 
                border: `1px solid ${theme.border}`, 
                borderRadius: '0.5rem', 
                background: currentPage === totalPages ? (darkMode ? '#374151' : '#f8fafc') : theme.cardBg, 
                color: currentPage === totalPages ? theme.textSecondary : theme.text, 
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', 
                transition: 'all 0.2s ease',
                fontSize: '0.875rem'
              }}
            >
              다음 <ChevronRight size={16} />
            </button>
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
              🚀 Job Hunter v3.0 - 피드백 완벽 반영! ✨
            </p>
            <p style={{ 
              marginBottom: '1rem', 
              color: theme.textSecondary 
            }}>
              키워드별 알림 설정, 지원 이력 자동 저장, 다크모드 기능 추가!
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '2rem', 
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
    </div>
  )
}

export default JobHunter