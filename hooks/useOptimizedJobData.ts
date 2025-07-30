'use client'

import { useMemo } from 'react'
import { useJobsContext } from '@/contexts/AppContext'

// Custom hook for optimized job data processing
export const useOptimizedJobData = () => {
  const { jobs, userKeywords, processedJobs } = useJobsContext()

  // Urgent jobs calculation (memoized)
  const urgentJobs = useMemo(() => {
    return processedJobs.filter(job => {
      if (!job.deadline) return false
      const today = new Date()
      const deadline = new Date(job.deadline)
      const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 3 && diffDays >= 0
    })
  }, [processedJobs])

  // Statistics calculation (memoized)
  const stats = useMemo(() => ({
    totalJobs: processedJobs.length,
    matchedJobs: processedJobs.filter(job => job.matchScore > 0).length,
    avgMatchScore: processedJobs.length > 0 ? 
      Math.round(processedJobs.reduce((sum, job) => sum + job.matchScore, 0) / processedJobs.length) : 0,
    urgentJobs: urgentJobs.length
  }), [processedJobs, urgentJobs])

  // Optimized keyword highlighting function (memoized)
  const highlightKeywords = useMemo(() => {
    if (!userKeywords.length) return (text: string) => text
    
    const escapedKeywords = userKeywords.map(keyword => 
      keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    )
    const combinedRegex = new RegExp(`(${escapedKeywords.join('|')})`, 'gi')
    
    return (text: string) => {
      return text.replace(combinedRegex, '<mark style="background: linear-gradient(120deg, #fef08a 0%, #fde047 100%); padding: 3px 6px; border-radius: 4px; font-weight: 600;">$1</mark>')
    }
  }, [userKeywords])

  return {
    jobs,
    processedJobs,
    urgentJobs,
    stats,
    highlightKeywords,
    userKeywords
  }
}