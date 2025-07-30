'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { debounce } from 'lodash-es'

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

interface ApplicationsContextType {
  applicationHistory: ApplicationHistory[];
  setApplicationHistory: (history: ApplicationHistory[]) => void;
  addApplication: (application: ApplicationHistory) => void;
  resumes: Resume[];
  setResumes: (resumes: Resume[]) => void;
  addResume: (resume: Resume) => void;
  deleteResume: (id: string) => void;
}

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined)

export const useApplicationsContext = () => {
  const context = useContext(ApplicationsContext)
  if (context === undefined) {
    throw new Error('useApplicationsContext must be used within an ApplicationsProvider')
  }
  return context
}

export const ApplicationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applicationHistory, setApplicationHistory] = useState<ApplicationHistory[]>([])
  const [resumes, setResumes] = useState<Resume[]>([])

  // Debounced localStorage operations
  const debouncedSaveToStorage = useCallback(
    debounce((key: string, data: any) => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(key, JSON.stringify(data))
        } catch (error) {
          console.warn(`Failed to save ${key} to localStorage:`, error)
        }
      }
    }, 500),
    []
  )

  // Helper functions
  const addApplication = useCallback((application: ApplicationHistory) => {
    setApplicationHistory(prev => [...prev, application])
  }, [])

  const addResume = useCallback((resume: Resume) => {
    setResumes(prev => [...prev, resume])
  }, [])

  const deleteResume = useCallback((id: string) => {
    setResumes(prev => prev.filter(resume => resume.id !== id))
  }, [])

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedApplications = localStorage.getItem('job-hunter-applications')
      const savedResumes = localStorage.getItem('job-hunter-resumes')
      
      if (savedApplications) {
        setApplicationHistory(JSON.parse(savedApplications))
      }
      
      if (savedResumes) {
        setResumes(JSON.parse(savedResumes))
      }
    }
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    debouncedSaveToStorage('job-hunter-applications', applicationHistory)
  }, [applicationHistory, debouncedSaveToStorage])

  useEffect(() => {
    debouncedSaveToStorage('job-hunter-resumes', resumes)
  }, [resumes, debouncedSaveToStorage])

  const value: ApplicationsContextType = {
    applicationHistory,
    setApplicationHistory,
    addApplication,
    resumes,
    setResumes,
    addResume,
    deleteResume,
  }

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  )
}

export type { ApplicationHistory, Resume }