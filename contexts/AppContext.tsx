'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// Type definitions
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

interface ApplicationHistory {
  jobId: number;
  appliedAt: string;
  status: string;
  notes: string;
}

interface Resume {
  id: string;
  name: string;
  uploadDate: string;
  fileUrl: string;
  isDefault: boolean;
}

interface AppContextType {
  // Jobs
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  
  // User preferences
  userKeywords: string[];
  setUserKeywords: (keywords: string[]) => void;
  
  // Bookmarks
  bookmarkedJobs: number[];
  setBookmarkedJobs: (bookmarks: number[]) => void;
  toggleBookmark: (jobId: number) => void;
  
  // Applications
  applicationHistory: ApplicationHistory[];
  setApplicationHistory: (history: ApplicationHistory[]) => void;
  addApplication: (application: ApplicationHistory) => void;
  
  // Job notes
  jobNotes: {[key: number]: string};
  setJobNotes: (notes: {[key: number]: string}) => void;
  updateJobNote: (jobId: number, note: string) => void;
  
  // Theme
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  
  // Resumes
  resumes: Resume[];
  setResumes: (resumes: Resume[]) => void;
  addResume: (resume: Resume) => void;
  deleteResume: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([])
  const [userKeywords, setUserKeywords] = useState<string[]>(['React', 'UX Designer'])
  
  // Bookmarks state
  const [bookmarkedJobs, setBookmarkedJobs] = useState<number[]>([])
  
  // Applications state
  const [applicationHistory, setApplicationHistory] = useState<ApplicationHistory[]>([])
  
  // Job notes state
  const [jobNotes, setJobNotes] = useState<{[key: number]: string}>({})
  
  // Theme state
  const [darkMode, setDarkMode] = useState(false)
  
  // Resumes state
  const [resumes, setResumes] = useState<Resume[]>([])

  // Helper functions
  const toggleBookmark = (jobId: number) => {
    setBookmarkedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  const addApplication = (application: ApplicationHistory) => {
    setApplicationHistory(prev => [...prev, application])
  }

  const updateJobNote = (jobId: number, note: string) => {
    setJobNotes(prev => ({ ...prev, [jobId]: note }))
  }

  const addResume = (resume: Resume) => {
    setResumes(prev => [...prev, resume])
  }

  const deleteResume = (id: string) => {
    setResumes(prev => prev.filter(resume => resume.id !== id))
  }

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBookmarks = localStorage.getItem('job-hunter-bookmarks')
      const savedApplications = localStorage.getItem('job-hunter-applications')
      const savedNotes = localStorage.getItem('job-hunter-notes')
      const savedDarkMode = localStorage.getItem('job-hunter-dark-mode')
      const savedResumes = localStorage.getItem('job-hunter-resumes')
      
      if (savedBookmarks) {
        setBookmarkedJobs(JSON.parse(savedBookmarks))
      }
      
      if (savedApplications) {
        setApplicationHistory(JSON.parse(savedApplications))
      }
      
      if (savedNotes) {
        setJobNotes(JSON.parse(savedNotes))
      }
      
      if (savedDarkMode) {
        setDarkMode(JSON.parse(savedDarkMode))
      }
      
      if (savedResumes) {
        setResumes(JSON.parse(savedResumes))
      }
    }
  }, [])

  // Save data to localStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('job-hunter-bookmarks', JSON.stringify(bookmarkedJobs))
    }
  }, [bookmarkedJobs])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('job-hunter-applications', JSON.stringify(applicationHistory))
    }
  }, [applicationHistory])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('job-hunter-notes', JSON.stringify(jobNotes))
    }
  }, [jobNotes])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('job-hunter-dark-mode', JSON.stringify(darkMode))
    }
  }, [darkMode])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('job-hunter-resumes', JSON.stringify(resumes))
    }
  }, [resumes])

  const value: AppContextType = {
    jobs,
    setJobs,
    userKeywords,
    setUserKeywords,
    bookmarkedJobs,
    setBookmarkedJobs,
    toggleBookmark,
    applicationHistory,
    setApplicationHistory,
    addApplication,
    jobNotes,
    setJobNotes,
    updateJobNote,
    darkMode,
    setDarkMode,
    resumes,
    setResumes,
    addResume,
    deleteResume,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}