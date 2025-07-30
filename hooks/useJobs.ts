import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { queryKeys, invalidateQueries } from '@/lib/queryClient'
import { useJobStore } from '@/stores/jobStore'
import type { Job } from '@/stores/jobStore'

// Mock API functions (replace with real API calls)
const fetchJobs = async (): Promise<Job[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Return mock data for now
  const mockJobs: Job[] = [
    {
      id: 1,
      title: "Frontend Developer - React/Next.js",
      company: {
        name: "TechCorp Inc.",
        employeeCount: "100-500명",
        industry: "IT 서비스",
        founded: "2015년",
        location: "서울시 강남구",
        website: "https://techcorp.com",
        description: "혁신적인 기술 솔루션을 제공하는 IT 기업으로, 글로벌 시장에서 인정받는 소프트웨어 개발 회사입니다."
      },
      location: "Seoul, South Korea",
      posted_date: "2024-07-29",
      deadline: "2024-08-05",
      description: "We are looking for a skilled Frontend Developer with expertise in React, Next.js, TypeScript, and modern web technologies. Join our team to build cutting-edge user interfaces and deliver exceptional user experiences.",
      url: "https://example.com/job1",
      keywords: ["React", "Next.js", "TypeScript", "JavaScript", "Frontend", "UI/UX"],
      salary_min: 4000,
      salary_max: 6000,
      employment_type: "full-time",
      remote_available: true,
      requirements: [
        "React, Next.js 3년 이상 실무 경험",
        "TypeScript 활용 능력",
        "반응형 웹 개발 경험",
        "Git을 이용한 협업 경험",
        "RESTful API 연동 경험"
      ],
      benefits: [
        "유연근무제", "연봉 상한선 없음", "교육비 지원", "건강검진비 지원", "점심 제공"
      ]
    },
    {
      id: 2,
      title: "UX Designer - Product Design",
      company: {
        name: "DesignLab",
        employeeCount: "50-100명",
        industry: "디자인 서비스",
        founded: "2018년",
        location: "서울시 성수동",
        website: "https://designlab.com",
        description: "사용자 중심의 디자인을 통해 혁신적인 제품을 만드는 디자인 스튜디오입니다."
      },
      location: "Seoul, South Korea",
      posted_date: "2024-07-28",
      deadline: "2024-08-10",
      description: "We're seeking a talented UX Designer to join our product team. You'll be responsible for creating intuitive and engaging user experiences across our digital products.",
      url: "https://example.com/job2",
      keywords: ["UX Designer", "Product Design", "Figma", "Prototyping", "User Research"],
      salary_min: 3500,
      salary_max: 5500,
      employment_type: "full-time",
      remote_available: false,
      requirements: [
        "UX/UI 디자인 3년 이상 경험",
        "Figma, Sketch 능숙",
        "사용자 리서치 경험",
        "프로토타이핑 역량",
        "디자인 시스템 구축 경험"
      ],
      benefits: [
        "자율 출퇴근", "디자인 도구 지원", "컨퍼런스 참가비 지원", "점심 제공"
      ]
    }
  ]
  
  return mockJobs
}

const fetchJobById = async (id: number): Promise<Job> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const jobs = await fetchJobs()
  const job = jobs.find(j => j.id === id)
  if (!job) throw new Error(`Job with id ${id} not found`)
  return job
}

// Main hook for fetching jobs
export function useJobs() {
  const setJobs = useJobStore(state => state.setJobs)
  const setLoading = useJobStore(state => state.setLoading)
  const setError = useJobStore(state => state.setError)
  
  const query = useQuery({
    queryKey: queryKeys.jobs.lists(),
    queryFn: fetchJobs,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
  
  // Handle query state changes
  useEffect(() => {
    if (query.isLoading) {
      setLoading(true)
    } else {
      setLoading(false)
    }
    
    if (query.data) {
      setJobs(query.data)
      setError(null)
    }
    
    if (query.error) {
      setError(query.error.message)
    }
  }, [query.data, query.error, query.isLoading, setJobs, setLoading, setError])
  
  return query
}

// Hook for fetching a single job
export function useJob(id: number) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(id),
    queryFn: () => fetchJobById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for job search
export function useJobSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.jobs.search(query),
    queryFn: async () => {
      const allJobs = await fetchJobs()
      return allJobs.filter(job => 
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.description.toLowerCase().includes(query.toLowerCase()) ||
        job.keywords.some(keyword => 
          keyword.toLowerCase().includes(query.toLowerCase())
        )
      )
    },
    enabled: query.length > 2, // Only search if query is longer than 2 characters
    staleTime: 1 * 60 * 1000, // 1 minute for search results
  })
}

// Mutation for applying to a job
export function useApplyToJob() {
  return useMutation({
    mutationFn: async ({ jobId, resumeId, coverLetter }: {
      jobId: number
      resumeId?: string
      coverLetter?: string
    }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      return {
        success: true,
        applicationId: `app-${Date.now()}`,
        appliedAt: new Date().toISOString()
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      invalidateQueries.userApplications()
      
      // Show success notification
      console.log(`Successfully applied to job ${variables.jobId}`)
    },
    onError: (error: Error) => {
      console.error('Failed to apply to job:', error.message)
      // You can add toast notification here
    }
  })
}

// Mutation for bookmarking a job
export function useBookmarkJob() {
  return useMutation({
    mutationFn: async ({ jobId, action }: { jobId: number; action: 'add' | 'remove' }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      return {
        success: true,
        jobId,
        action,
        timestamp: new Date().toISOString()
      }
    },
    onSuccess: (data) => {
      // Invalidate bookmarks query
      invalidateQueries.userBookmarks()
      
      console.log(`${data.action === 'add' ? 'Added' : 'Removed'} bookmark for job ${data.jobId}`)
    },
    onError: (error: Error) => {
      console.error('Failed to update bookmark:', error.message)
    }
  })
}

// Hook for getting filtered and sorted jobs
export function useFilteredJobs(filters: {
  minMatchScore?: number
  location?: string
  remoteOnly?: boolean
  salaryMin?: number
  sortBy?: 'matchScore' | 'posted_date' | 'deadline' | 'salary'
}) {
  const processedJobs = useJobStore(state => state.processedJobs)
  
  return processedJobs
    .filter(job => {
      if (filters.minMatchScore && job.matchScore < filters.minMatchScore) return false
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false
      if (filters.remoteOnly && !job.remote_available) return false
      if (filters.salaryMin && job.salary_min < filters.salaryMin) return false
      return true
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'matchScore':
          return b.matchScore - a.matchScore
        case 'posted_date':
          return new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime()
        case 'deadline':
          if (!a.deadline && !b.deadline) return 0
          if (!a.deadline) return 1
          if (!b.deadline) return -1
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        case 'salary':
          return (b.salary_max || 0) - (a.salary_max || 0)
        default:
          return 0
      }
    })
}

// Hook for prefetching job details on hover
export function usePrefetchJob() {
  const queryClient = useQueryClient()
  
  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.jobs.detail(id),
      queryFn: () => fetchJobById(id),
      staleTime: 5 * 60 * 1000,
    })
  }
}