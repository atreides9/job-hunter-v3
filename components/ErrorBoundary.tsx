'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error to monitoring service (Sentry, etc.)
    if (typeof window !== 'undefined') {
      console.error('Error Boundary caught an error:', error, errorInfo)
      
      // Report to analytics/monitoring
      if (process.env.NODE_ENV === 'production') {
        // Replace with your error reporting service
        // Sentry.captureException(error, { extra: errorInfo })
      }
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} retry={this.retry} />
      }

      return <DefaultErrorFallback error={this.state.error!} retry={this.retry} />
    }

    return this.props.children
  }
}

// Default error fallback component with Korean UX
const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => {
  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            문제가 발생했습니다
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-left">
            <p className="text-xs text-gray-600 dark:text-gray-300 font-mono">
              {error.message}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={retry}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            다시 시도
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            홈으로 돌아가기
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
          문제가 지속되면 관리자에게 문의해 주세요.
        </p>
      </div>
    </div>
  )
}

// Specialized error boundaries for different sections
export const JobsErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary fallback={JobsErrorFallback}>
    {children}
  </ErrorBoundary>
)

const JobsErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ retry }) => (
  <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
    <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
    <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
      채용공고를 불러올 수 없습니다
    </h3>
    <p className="text-red-600 dark:text-red-300 text-sm mb-4">
      네트워크 연결을 확인하고 다시 시도해 주세요.
    </p>
    <button
      onClick={retry}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      다시 불러오기
    </button>
  </div>
)

export default ErrorBoundary