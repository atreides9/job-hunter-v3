import { create } from 'zustand'
import { subscribeWithSelector, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface ApplicationHistory {
  jobId: number
  appliedAt: string
  status: 'applied' | 'interview' | 'rejected' | 'offered' | 'accepted'
  notes: string
  resumeId?: string
}

interface Resume {
  id: string
  name: string
  uploadDate: string
  fileUrl: string
  isDefault: boolean
}

interface ApplicationState {
  // Core data
  applicationHistory: ApplicationHistory[]
  resumes: Resume[]
  
  // Loading states
  isSubmitting: boolean
  error: string | null
  
  // Application actions
  addApplication: (application: Omit<ApplicationHistory, 'appliedAt'>) => void
  updateApplicationStatus: (jobId: number, status: ApplicationHistory['status'], notes?: string) => void
  removeApplication: (jobId: number) => void
  
  // Resume actions
  addResume: (resume: Omit<Resume, 'id' | 'uploadDate'>) => void
  updateResume: (id: string, updates: Partial<Omit<Resume, 'id'>>) => void
  removeResume: (id: string) => void
  setDefaultResume: (id: string) => void
  
  // State management
  setSubmitting: (submitting: boolean) => void
  setError: (error: string | null) => void
  
  // Selectors
  getApplicationByJobId: (jobId: number) => ApplicationHistory | undefined
  hasAppliedToJob: (jobId: number) => boolean
  getDefaultResume: () => Resume | undefined
  getApplicationsByStatus: (status: ApplicationHistory['status']) => ApplicationHistory[]
  getApplicationStats: () => {
    total: number
    applied: number
    interview: number
    rejected: number
    offered: number
    accepted: number
  }
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    subscribeWithSelector(
      immer((set, get) => ({
        // Initial state
        applicationHistory: [],
        resumes: [],
        isSubmitting: false,
        error: null,
        
        // Application actions
        addApplication: (applicationData) =>
          set((state) => {
            const existingIndex = state.applicationHistory.findIndex(
              app => app.jobId === applicationData.jobId
            )
            
            const application: ApplicationHistory = {
              ...applicationData,
              appliedAt: new Date().toISOString(),
              status: applicationData.status || 'applied'
            }
            
            if (existingIndex === -1) {
              state.applicationHistory.push(application)
            } else {
              // Update existing application
              state.applicationHistory[existingIndex] = application
            }
          }),
        
        updateApplicationStatus: (jobId, status, notes = '') =>
          set((state) => {
            const applicationIndex = state.applicationHistory.findIndex(
              app => app.jobId === jobId
            )
            
            if (applicationIndex !== -1) {
              state.applicationHistory[applicationIndex].status = status
              if (notes) {
                state.applicationHistory[applicationIndex].notes = notes
              }
            }
          }),
        
        removeApplication: (jobId) =>
          set((state) => {
            state.applicationHistory = state.applicationHistory.filter(
              app => app.jobId !== jobId
            )
          }),
        
        // Resume actions
        addResume: (resumeData) =>
          set((state) => {
            const resume: Resume = {
              ...resumeData,
              id: `resume-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              uploadDate: new Date().toISOString()
            }
            
            // If this is the first resume or marked as default, make it default
            if (state.resumes.length === 0 || resumeData.isDefault) {
              // Remove default from others
              state.resumes.forEach(r => r.isDefault = false)
              resume.isDefault = true
            }
            
            state.resumes.push(resume)
          }),
        
        updateResume: (id, updates) =>
          set((state) => {
            const resumeIndex = state.resumes.findIndex(resume => resume.id === id)
            if (resumeIndex !== -1) {
              Object.assign(state.resumes[resumeIndex], updates)
              
              // If setting as default, remove default from others
              if (updates.isDefault) {
                state.resumes.forEach((resume, index) => {
                  if (index !== resumeIndex) {
                    resume.isDefault = false
                  }
                })
              }
            }
          }),
        
        removeResume: (id) =>
          set((state) => {
            const resumeIndex = state.resumes.findIndex(resume => resume.id === id)
            if (resumeIndex !== -1) {
              const wasDefault = state.resumes[resumeIndex].isDefault
              state.resumes.splice(resumeIndex, 1)
              
              // If removed resume was default, make first remaining resume default
              if (wasDefault && state.resumes.length > 0) {
                state.resumes[0].isDefault = true
              }
            }
          }),
        
        setDefaultResume: (id) =>
          set((state) => {
            state.resumes.forEach(resume => {
              resume.isDefault = resume.id === id
            })
          }),
        
        // State management
        setSubmitting: (submitting) =>
          set((state) => {
            state.isSubmitting = submitting
          }),
        
        setError: (error) =>
          set((state) => {
            state.error = error
          }),
        
        // Selectors
        getApplicationByJobId: (jobId) => {
          const state = get()
          return state.applicationHistory.find(app => app.jobId === jobId)
        },
        
        hasAppliedToJob: (jobId) => {
          const state = get()
          return state.applicationHistory.some(app => app.jobId === jobId)
        },
        
        getDefaultResume: () => {
          const state = get()
          return state.resumes.find(resume => resume.isDefault)
        },
        
        getApplicationsByStatus: (status) => {
          const state = get()
          return state.applicationHistory.filter(app => app.status === status)
        },
        
        getApplicationStats: () => {
          const state = get()
          const stats = {
            total: state.applicationHistory.length,
            applied: 0,
            interview: 0,
            rejected: 0,
            offered: 0,
            accepted: 0
          }
          
          state.applicationHistory.forEach(app => {
            stats[app.status]++
          })
          
          return stats
        }
      }))
    ),
    {
      name: 'job-hunter-applications', // localStorage key
      partialize: (state) => ({
        applicationHistory: state.applicationHistory,
        resumes: state.resumes
      })
    }
  )
)

// Selectors for better performance
export const selectApplicationHistory = (state: ApplicationState) => state.applicationHistory
export const selectResumes = (state: ApplicationState) => state.resumes
export const selectIsSubmitting = (state: ApplicationState) => state.isSubmitting
export const selectError = (state: ApplicationState) => state.error

// Derived selectors
export const selectApplicationCount = (state: ApplicationState) => state.applicationHistory.length
export const selectResumeCount = (state: ApplicationState) => state.resumes.length
export const selectDefaultResume = (state: ApplicationState) => 
  state.resumes.find(resume => resume.isDefault)

// Custom hooks for specific use cases
export const useApplicationStatus = (jobId: number) => {
  return useApplicationStore((state) => {
    const app = state.getApplicationByJobId(jobId)
    return app?.status || null
  })
}

export const useHasApplied = (jobId: number) => {
  return useApplicationStore((state) => state.hasAppliedToJob(jobId))
}

export type { ApplicationHistory, Resume }