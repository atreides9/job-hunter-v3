'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { debounce } from 'lodash-es'

interface UserPreferencesContextType {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  bookmarkedJobs: number[];
  setBookmarkedJobs: (bookmarks: number[]) => void;
  toggleBookmark: (jobId: number) => void;
  jobNotes: {[key: number]: string};
  setJobNotes: (notes: {[key: number]: string}) => void;
  updateJobNote: (jobId: number, note: string) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined)

export const useUserPreferencesContext = () => {
  const context = useContext(UserPreferencesContext)
  if (context === undefined) {
    throw new Error('useUserPreferencesContext must be used within a UserPreferencesProvider')
  }
  return context
}

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false)
  const [bookmarkedJobs, setBookmarkedJobs] = useState<number[]>([])
  const [jobNotes, setJobNotes] = useState<{[key: number]: string}>({})

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
  const toggleBookmark = useCallback((jobId: number) => {
    setBookmarkedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }, [])

  const updateJobNote = useCallback((jobId: number, note: string) => {
    setJobNotes(prev => ({ ...prev, [jobId]: note }))
  }, [])

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBookmarks = localStorage.getItem('job-hunter-bookmarks')
      const savedNotes = localStorage.getItem('job-hunter-notes')
      const savedDarkMode = localStorage.getItem('job-hunter-dark-mode')
      
      if (savedBookmarks) {
        setBookmarkedJobs(JSON.parse(savedBookmarks))
      }
      
      if (savedNotes) {
        setJobNotes(JSON.parse(savedNotes))
      }
      
      if (savedDarkMode) {
        setDarkMode(JSON.parse(savedDarkMode))
      }
    }
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    debouncedSaveToStorage('job-hunter-bookmarks', bookmarkedJobs)
  }, [bookmarkedJobs, debouncedSaveToStorage])

  useEffect(() => {
    debouncedSaveToStorage('job-hunter-notes', jobNotes)
  }, [jobNotes, debouncedSaveToStorage])

  useEffect(() => {
    debouncedSaveToStorage('job-hunter-dark-mode', darkMode)
  }, [darkMode, debouncedSaveToStorage])

  const value: UserPreferencesContextType = {
    darkMode,
    setDarkMode,
    bookmarkedJobs,
    setBookmarkedJobs,
    toggleBookmark,
    jobNotes,
    setJobNotes,
    updateJobNote,
  }

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  )
}