'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

// Job-related types
interface CompanyInfo {
  name: string;
  employeeCount: string;
  industry: string;
  founded: string;
  location: string;
  website: string;
  description: string;
}

interface Job {
  id: number;
  title: string;
  company: CompanyInfo;
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
  requirements?: string[];
  benefits?: string[];
}

interface JobsContextType {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  userKeywords: string[];
  setUserKeywords: (keywords: string[]) => void;
  // Computed values
  processedJobs: (Job & { matchedKeywords: string[]; matchScore: number })[];
}

const JobsContext = createContext<JobsContextType | undefined>(undefined)

export const useJobsContext = () => {
  const context = useContext(JobsContext)
  if (context === undefined) {
    throw new Error('useJobsContext must be used within a JobsProvider')
  }
  return context
}

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [userKeywords, setUserKeywords] = useState<string[]>(['React', 'UX Designer'])

  // Memoized processed jobs calculation
  const processedJobs = React.useMemo(() => {
    if (!jobs?.length || !userKeywords?.length) {
      return jobs?.map(job => ({ ...job, matchedKeywords: [], matchScore: 0 })) || []
    }
    
    const lowerKeywords = userKeywords.map(k => k.toLowerCase())
    
    return jobs.map(job => {
      const allText = `${job.title} ${job.description} ${job.keywords.join(' ')}`.toLowerCase()
      const textWords = new Set(allText.split(/\s+/))
      const matchedKeywords = lowerKeywords.filter(keyword => 
        textWords.has(keyword) || allText.includes(keyword)
      )
      
      const matchScore = Math.round((matchedKeywords.length / userKeywords.length) * 100)
      
      return { ...job, matchedKeywords, matchScore }
    })
  }, [jobs, userKeywords])

  const value: JobsContextType = {
    jobs,
    setJobs,
    userKeywords,
    setUserKeywords,
    processedJobs,
  }

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  )
}

export type { Job, CompanyInfo }