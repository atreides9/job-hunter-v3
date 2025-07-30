'use client'

import React, { useCallback, useMemo } from 'react'
import { FixedSizeList as List } from 'react-window'
import { Building, MapPin, Calendar, DollarSign, Bookmark, BookmarkCheck, ExternalLink, Clock, TrendingUp } from 'lucide-react'
import { useUserPreferencesContext } from '@/contexts/AppContext'
import type { Job } from '@/contexts/AppContext'
import { useOptimizedJobData } from '@/hooks/useOptimizedJobData'

interface JobItemProps {
  index: number
  style: React.CSSProperties
  data: {
    jobs: (Job & { matchedKeywords: string[]; matchScore: number })[]
    bookmarkedJobs: number[]
    toggleBookmark: (jobId: number) => void
    highlightKeywords: (text: string) => string
    onJobClick: (job: Job) => void
    onApplyClick: (job: Job) => void
  }
}

const JobItem: React.FC<JobItemProps> = ({ index, style, data }) => {
  const { jobs, bookmarkedJobs, toggleBookmark, highlightKeywords, onJobClick, onApplyClick } = data
  const job = jobs[index]

  // Always call hooks in the same order
  const isBookmarked = job ? bookmarkedJobs.includes(job.id) : false
  const isUrgent = useMemo(() => {
    if (!job?.deadline) return false
    const today = new Date()
    const deadline = new Date(job.deadline)
    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 3 && diffDays >= 0
  }, [job?.deadline])

  const handleBookmarkClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (job) toggleBookmark(job.id)
  }, [job, toggleBookmark])

  const handleApplyClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (job) onApplyClick(job)
  }, [job, onApplyClick])

  const handleJobClick = useCallback(() => {
    if (job) onJobClick(job)
  }, [job, onJobClick])

  // Early return after hooks
  if (!job) return null

  return (
    <div style={style} className="px-2 py-1">
      <div 
        className={`
          bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 
          hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 
          transition-all duration-300 cursor-pointer group p-6
          ${isUrgent ? 'ring-2 ring-red-200 dark:ring-red-800 bg-red-50 dark:bg-red-900/10' : ''}
        `}
        onClick={handleJobClick}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 
                className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                dangerouslySetInnerHTML={{ __html: highlightKeywords(job.title) }}
              />
              {isUrgent && (
                <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium">
                  <Clock className="w-3 h-3" />
                  마감임박
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                <span className="font-medium">{job.company.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{job.posted_date}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {job.matchScore > 0 && (
              <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                {job.matchScore}% 매칭
              </div>
            )}
            <button
              onClick={handleBookmarkClick}
              className={`
                p-2 rounded-full transition-all duration-200
                ${isBookmarked 
                  ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 hover:text-yellow-600 dark:hover:text-yellow-400'
                }
              `}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <p 
          className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: highlightKeywords(job.description) }}
        />

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
              <DollarSign className="w-4 h-4" />
              <span>{job.salary_min?.toLocaleString()}만 - {job.salary_max?.toLocaleString()}만원</span>
            </div>
            {job.remote_available && (
              <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                원격근무 가능
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
            >
              지원하기
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface VirtualizedJobListProps {
  jobs: (Job & { matchedKeywords: string[]; matchScore: number })[]
  height?: number
  onJobClick: (job: Job) => void
  onApplyClick: (job: Job) => void
}

const VirtualizedJobList: React.FC<VirtualizedJobListProps> = ({ 
  jobs, 
  height = 600, 
  onJobClick, 
  onApplyClick 
}) => {
  const { bookmarkedJobs, toggleBookmark } = useUserPreferencesContext()
  const { highlightKeywords } = useOptimizedJobData()

  const itemData = useMemo(() => ({
    jobs,
    bookmarkedJobs,
    toggleBookmark,
    highlightKeywords,
    onJobClick,
    onApplyClick
  }), [jobs, bookmarkedJobs, toggleBookmark, highlightKeywords, onJobClick, onApplyClick])

  // Dynamic item height based on content (average ~180px)
  const itemSize = 190

  if (!jobs.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">표시할 채용공고가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
      <List
        height={height}
        width="100%"
        itemCount={jobs.length}
        itemSize={itemSize}
        itemData={itemData}
        overscanCount={5} // Pre-render 5 items above/below viewport for smooth scrolling
        className="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        {JobItem}
      </List>
    </div>
  )
}

export default VirtualizedJobList