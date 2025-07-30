import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// Types
interface CompanyInfo {
  name: string
  employeeCount: string
  industry: string
  founded: string
  location: string
  website: string
  description: string
}

interface Job {
  id: number
  title: string
  company: CompanyInfo
  location: string
  posted_date: string
  deadline: string
  description: string
  url: string
  keywords: string[]
  salary_min: number
  salary_max: number
  employment_type: string
  remote_available: boolean
  requirements?: string[]
  benefits?: string[]
}

interface ProcessedJob extends Job {
  matchedKeywords: string[]
  matchScore: number
}

interface JobState {
  // Core data
  jobs: Job[]
  userKeywords: string[]
  
  // Computed data (memoized)
  processedJobs: ProcessedJob[]
  
  // Loading states
  isLoading: boolean
  error: string | null
  
  // Actions
  setJobs: (jobs: Job[]) => void
  addJob: (job: Job) => void
  updateJob: (id: number, updates: Partial<Job>) => void
  removeJob: (id: number) => void
  
  setUserKeywords: (keywords: string[]) => void
  addKeyword: (keyword: string) => void
  removeKeyword: (keyword: string) => void
  
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Computed selectors
  getJobById: (id: number) => Job | undefined
  getMatchedJobs: (minScore?: number) => ProcessedJob[]
  getUrgentJobs: () => ProcessedJob[]
  getStats: () => {
    totalJobs: number
    matchedJobs: number
    avgMatchScore: number
    urgentJobs: number
  }
}

// Helper function to calculate job matching
const calculateJobMatching = (job: Job, keywords: string[]): { matchedKeywords: string[]; matchScore: number } => {
  if (!keywords.length) return { matchedKeywords: [], matchScore: 0 }
  
  const allText = `${job.title} ${job.description} ${job.keywords.join(' ')}`.toLowerCase()
  const lowerKeywords = keywords.map(k => k.toLowerCase())
  
  // Use Set for O(1) word lookup
  const textWords = new Set(allText.split(/\s+/))
  const matchedKeywords = lowerKeywords.filter(keyword => 
    textWords.has(keyword) || allText.includes(keyword)
  )
  
  const matchScore = Math.round((matchedKeywords.length / keywords.length) * 100)
  
  return { matchedKeywords, matchScore }
}

// Create store with middleware for better performance and debugging
export const useJobStore = create<JobState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // Initial state
      jobs: [],
      userKeywords: ['React', 'UX Designer'],
      processedJobs: [],
      isLoading: false,
      error: null,
      
      // Actions
      setJobs: (jobs) => 
        set((state) => {
          state.jobs = jobs
          // Recalculate processed jobs when jobs change
          state.processedJobs = jobs.map(job => ({
            ...job,
            ...calculateJobMatching(job, state.userKeywords)
          }))
        }),
      
      addJob: (job) =>
        set((state) => {
          state.jobs.push(job)
          // Add to processed jobs
          state.processedJobs.push({
            ...job,
            ...calculateJobMatching(job, state.userKeywords)
          })
        }),
      
      updateJob: (id, updates) =>
        set((state) => {
          const jobIndex = state.jobs.findIndex(job => job.id === id)
          if (jobIndex !== -1) {
            state.jobs[jobIndex] = { ...state.jobs[jobIndex], ...updates }
            // Update processed job
            const updatedJob = state.jobs[jobIndex]
            state.processedJobs[jobIndex] = {
              ...updatedJob,
              ...calculateJobMatching(updatedJob, state.userKeywords)
            }
          }
        }),
      
      removeJob: (id) =>
        set((state) => {
          state.jobs = state.jobs.filter(job => job.id !== id)
          state.processedJobs = state.processedJobs.filter(job => job.id !== id)
        }),
      
      setUserKeywords: (keywords) =>
        set((state) => {
          state.userKeywords = keywords
          // Recalculate all processed jobs when keywords change
          state.processedJobs = state.jobs.map(job => ({
            ...job,
            ...calculateJobMatching(job, keywords)
          }))
        }),
      
      addKeyword: (keyword) =>
        set((state) => {
          if (!state.userKeywords.includes(keyword)) {
            state.userKeywords.push(keyword)
            // Recalculate processed jobs
            state.processedJobs = state.jobs.map(job => ({
              ...job,
              ...calculateJobMatching(job, state.userKeywords)
            }))
          }
        }),
      
      removeKeyword: (keyword) =>
        set((state) => {
          state.userKeywords = state.userKeywords.filter(k => k !== keyword)
          // Recalculate processed jobs
          state.processedJobs = state.jobs.map(job => ({
            ...job,
            ...calculateJobMatching(job, state.userKeywords)
          }))
        }),
      
      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading
        }),
      
      setError: (error) =>
        set((state) => {
          state.error = error
        }),
      
      // Computed selectors
      getJobById: (id) => {
        const state = get()
        return state.jobs.find(job => job.id === id)
      },
      
      getMatchedJobs: (minScore = 0) => {
        const state = get()
        return state.processedJobs.filter(job => job.matchScore >= minScore)
      },
      
      getUrgentJobs: () => {
        const state = get()
        const today = new Date()
        return state.processedJobs.filter(job => {
          if (!job.deadline) return false
          const deadline = new Date(job.deadline)
          const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          return diffDays <= 3 && diffDays >= 0
        })
      },
      
      getStats: () => {
        const state = get()
        const urgentJobs = state.processedJobs.filter(job => {
          if (!job.deadline) return false
          const today = new Date()
          const deadline = new Date(job.deadline)
          const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          return diffDays <= 3 && diffDays >= 0
        })
        
        return {
          totalJobs: state.processedJobs.length,
          matchedJobs: state.processedJobs.filter(job => job.matchScore > 0).length,
          avgMatchScore: state.processedJobs.length > 0 
            ? Math.round(state.processedJobs.reduce((sum, job) => sum + job.matchScore, 0) / state.processedJobs.length)
            : 0,
          urgentJobs: urgentJobs.length
        }
      }
    }))
  )
)

// Selectors for better performance
export const selectJobs = (state: JobState) => state.jobs
export const selectProcessedJobs = (state: JobState) => state.processedJobs
export const selectUserKeywords = (state: JobState) => state.userKeywords
export const selectIsLoading = (state: JobState) => state.isLoading
export const selectError = (state: JobState) => state.error

// Derived selectors
export const selectJobsByMatchScore = (minScore: number) => (state: JobState) =>
  state.processedJobs.filter(job => job.matchScore >= minScore)

export const selectUrgentJobs = (state: JobState) => {
  const today = new Date()
  return state.processedJobs.filter(job => {
    if (!job.deadline) return false
    const deadline = new Date(job.deadline)
    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 3 && diffDays >= 0
  })
}

export type { Job, ProcessedJob, CompanyInfo }