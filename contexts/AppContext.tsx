'use client'

import React from 'react'
import { JobsProvider } from './stores/JobsContext'
import { UserPreferencesProvider } from './stores/UserPreferencesContext'
import { ApplicationsProvider } from './stores/ApplicationsContext'

// Composite provider pattern for performance optimization
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <JobsProvider>
      <UserPreferencesProvider>
        <ApplicationsProvider>
          {children}
        </ApplicationsProvider>
      </UserPreferencesProvider>
    </JobsProvider>
  )
}

// Re-export all hooks for convenience
export { useJobsContext } from './stores/JobsContext'
export { useUserPreferencesContext } from './stores/UserPreferencesContext'
export { useApplicationsContext } from './stores/ApplicationsContext'

// Re-export types
export type { Job, CompanyInfo } from './stores/JobsContext'
export type { ApplicationHistory, Resume } from './stores/ApplicationsContext'

// Legacy hook for backward compatibility (deprecated)
export const useAppContext = () => {
  console.warn('useAppContext is deprecated. Use specific context hooks instead.')
  // This would need to be implemented if we need backward compatibility
  throw new Error('useAppContext is deprecated. Use useJobsContext, useUserPreferencesContext, or useApplicationsContext instead.')
}