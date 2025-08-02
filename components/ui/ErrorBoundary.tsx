'use client';

import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // 에러 로깅 (실제 프로덕션에서는 에러 추적 서비스 사용)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    this.props.onReset?.();
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-lg w-full"
          >
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              {/* Error Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto mb-6"
              >
                <div className="w-20 h-20 bg-error-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-error-500" />
                </div>
              </motion.div>

              {/* Error Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <h1 className="text-h3 text-neutral-900 mb-2">
                  앗! 문제가 발생했습니다
                </h1>
                <p className="text-body1 text-neutral-600 mb-4">
                  예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
                </p>
                
                {/* Error Details in Development */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-left mt-4 p-4 bg-neutral-100 rounded border">
                    <summary className="cursor-pointer text-body2 font-medium text-neutral-700 mb-2">
                      <Bug className="inline w-4 h-4 mr-1" />
                      에러 상세 정보 (개발 모드)
                    </summary>
                    <div className="text-caption font-mono text-neutral-600 space-y-2">
                      <div>
                        <strong>Error:</strong> {this.state.error.message}
                      </div>
                      <div>
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap text-xs mt-1 max-h-32 overflow-y-auto">
                          {this.state.error.stack}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="whitespace-pre-wrap text-xs mt-1 max-h-32 overflow-y-auto">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={this.handleReset}
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                    className="flex-1 sm:flex-none"
                  >
                    다시 시도
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={this.handleGoHome}
                    leftIcon={<Home className="w-4 h-4" />}
                    className="flex-1 sm:flex-none"
                  >
                    홈으로 가기
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={this.handleReload}
                  className="text-neutral-500"
                >
                  페이지 새로고침
                </Button>
              </motion.div>

              {/* Help Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 pt-6 border-t border-neutral-200"
              >
                <p className="text-caption text-neutral-500">
                  문제가 계속 발생한다면{' '}
                  <a 
                    href="mailto:support@jobhunter.com" 
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    고객센터
                  </a>
                  로 문의해주세요.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;