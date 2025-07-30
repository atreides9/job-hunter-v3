import { create } from 'zustand'
import { subscribeWithSelector, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface UserPreferencesState {
  // Theme
  darkMode: boolean
  
  // Bookmarks
  bookmarkedJobs: number[]
  
  // Job notes
  jobNotes: { [key: number]: string }
  
  // Actions
  setDarkMode: (dark: boolean) => void
  toggleDarkMode: () => void
  
  // Bookmark actions
  addBookmark: (jobId: number) => void
  removeBookmark: (jobId: number) => void
  toggleBookmark: (jobId: number) => void
  isBookmarked: (jobId: number) => boolean
  
  // Notes actions
  setJobNote: (jobId: number, note: string) => void
  removeJobNote: (jobId: number) => void
  getJobNote: (jobId: number) => string
  
  // Bulk operations
  clearAllBookmarks: () => void
  clearAllNotes: () => void
  
  // Selectors
  getBookmarkedJobIds: () => number[]
  getNotesCount: () => number
}

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    subscribeWithSelector(
      immer((set, get) => ({
        // Initial state
        darkMode: false,
        bookmarkedJobs: [],
        jobNotes: {},
        
        // Theme actions
        setDarkMode: (dark) =>
          set((state) => {
            state.darkMode = dark
          }),
        
        toggleDarkMode: () =>
          set((state) => {
            state.darkMode = !state.darkMode
          }),
        
        // Bookmark actions
        addBookmark: (jobId) =>
          set((state) => {
            if (!state.bookmarkedJobs.includes(jobId)) {
              state.bookmarkedJobs.push(jobId)
            }
          }),
        
        removeBookmark: (jobId) =>
          set((state) => {
            state.bookmarkedJobs = state.bookmarkedJobs.filter(id => id !== jobId)
          }),
        
        toggleBookmark: (jobId) =>
          set((state) => {
            const index = state.bookmarkedJobs.indexOf(jobId)
            if (index === -1) {
              state.bookmarkedJobs.push(jobId)
            } else {
              state.bookmarkedJobs.splice(index, 1)
            }
          }),
        
        isBookmarked: (jobId) => {
          const state = get()
          return state.bookmarkedJobs.includes(jobId)
        },
        
        // Notes actions
        setJobNote: (jobId, note) =>
          set((state) => {
            if (note.trim()) {
              state.jobNotes[jobId] = note
            } else {
              delete state.jobNotes[jobId]
            }
          }),
        
        removeJobNote: (jobId) =>
          set((state) => {
            delete state.jobNotes[jobId]
          }),
        
        getJobNote: (jobId) => {
          const state = get()
          return state.jobNotes[jobId] || ''
        },
        
        // Bulk operations
        clearAllBookmarks: () =>
          set((state) => {
            state.bookmarkedJobs = []
          }),
        
        clearAllNotes: () =>
          set((state) => {
            state.jobNotes = {}
          }),
        
        // Selectors
        getBookmarkedJobIds: () => {
          const state = get()
          return [...state.bookmarkedJobs]
        },
        
        getNotesCount: () => {
          const state = get()
          return Object.keys(state.jobNotes).length
        }
      }))
    ),
    {
      name: 'job-hunter-user-preferences', // localStorage key
      partialize: (state) => ({
        darkMode: state.darkMode,
        bookmarkedJobs: state.bookmarkedJobs,
        jobNotes: state.jobNotes
      })
    }
  )
)

// Selectors for better performance
export const selectDarkMode = (state: UserPreferencesState) => state.darkMode
export const selectBookmarkedJobs = (state: UserPreferencesState) => state.bookmarkedJobs
export const selectJobNotes = (state: UserPreferencesState) => state.jobNotes

// Derived selectors
export const selectBookmarkCount = (state: UserPreferencesState) => state.bookmarkedJobs.length
export const selectNotesCount = (state: UserPreferencesState) => Object.keys(state.jobNotes).length

// Custom hooks for specific use cases
export const useBookmarkStatus = (jobId: number) => {
  return useUserPreferencesStore((state) => state.isBookmarked(jobId))
}

export const useJobNote = (jobId: number) => {
  return useUserPreferencesStore((state) => state.getJobNote(jobId))
}