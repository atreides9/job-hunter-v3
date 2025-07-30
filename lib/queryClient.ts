import { QueryClient } from '@tanstack/react-query'

// Create a client instance with optimized settings for Job Hunter
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 2 times
      retry: 2,
      // Retry with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for fresh data
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect by default (jobs don't change that frequently)
      refetchOnReconnect: false,
      // Don't refetch on mount if data is fresh
      refetchOnMount: 'always'
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      // Show error notifications
      onError: (error) => {
        console.error('Mutation error:', error)
        // You can add toast notifications here
      }
    }
  }
})

// Query keys for consistent cache management
export const queryKeys = {
  // Job-related queries
  jobs: {
    all: ['jobs'] as const,
    lists: () => [...queryKeys.jobs.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.jobs.lists(), filters] as const,
    details: () => [...queryKeys.jobs.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.jobs.details(), id] as const,
    search: (query: string) => [...queryKeys.jobs.all, 'search', query] as const
  },
  
  // Company-related queries
  companies: {
    all: ['companies'] as const,
    details: () => [...queryKeys.companies.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.companies.details(), id] as const
  },
  
  // User-related queries
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    preferences: () => [...queryKeys.user.all, 'preferences'] as const,
    applications: () => [...queryKeys.user.all, 'applications'] as const,
    bookmarks: () => [...queryKeys.user.all, 'bookmarks'] as const
  },
  
  // Analytics queries
  analytics: {
    all: ['analytics'] as const,
    jobStats: () => [...queryKeys.analytics.all, 'jobStats'] as const,
    userStats: () => [...queryKeys.analytics.all, 'userStats'] as const,
    trends: (period: string) => [...queryKeys.analytics.all, 'trends', period] as const
  }
} as const

// Helper functions for cache invalidation
export const invalidateQueries = {
  jobs: () => queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all }),
  jobsList: () => queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() }),
  jobDetail: (id: number) => queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(id) }),
  
  companies: () => queryClient.invalidateQueries({ queryKey: queryKeys.companies.all }),
  companyDetail: (id: string) => 
    queryClient.invalidateQueries({ queryKey: queryKeys.companies.detail(id) }),
  
  userApplications: () => 
    queryClient.invalidateQueries({ queryKey: queryKeys.user.applications() }),
  userBookmarks: () => 
    queryClient.invalidateQueries({ queryKey: queryKeys.user.bookmarks() }),
  
  analytics: () => queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all })
}

// Prefetch helpers for better UX
export const prefetchQueries = {
  jobDetail: async (id: number) => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.jobs.detail(id),
      queryFn: () => fetch(`/api/jobs/${id}`).then(res => res.json()),
      staleTime: 5 * 60 * 1000
    })
  },
  
  companyDetail: async (id: string) => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.companies.detail(id),
      queryFn: () => fetch(`/api/companies/${id}`).then(res => res.json()),
      staleTime: 10 * 60 * 1000
    })
  }
}

// Cache utilities
export const cacheUtils = {
  // Get cached data without triggering a fetch
  getJobFromCache: (id: number) => {
    return queryClient.getQueryData(queryKeys.jobs.detail(id))
  },
  
  // Set data in cache manually
  setJobInCache: (id: number, data: unknown) => {
    queryClient.setQueryData(queryKeys.jobs.detail(id), data)
  },
  
  // Remove specific data from cache
  removeJobFromCache: (id: number) => {
    queryClient.removeQueries({ queryKey: queryKeys.jobs.detail(id) })
  },
  
  // Clear all job-related cache
  clearJobsCache: () => {
    queryClient.removeQueries({ queryKey: queryKeys.jobs.all })
  }
}

export default queryClient