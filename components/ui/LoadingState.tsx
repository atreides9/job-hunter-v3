'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Search, Briefcase } from 'lucide-react';

interface LoadingStateProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'search' | 'job-loading';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  size = 'md',
  message,
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center py-8';

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear' as const
      }
    }
  };

  const dotsVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
        repeat: Infinity,
        repeatType: 'loop' as const
      }
    }
  };

  const dotVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        ease: 'easeInOut' as const
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut' as const
      }
    }
  };

  const searchVariants = {
    animate: {
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const
      }
    }
  };

  const jobLoadingVariants = {
    animate: {
      transition: {
        staggerChildren: 0.3,
        repeat: Infinity,
        repeatType: 'loop' as const
      }
    }
  };

  const cardVariants = {
    animate: {
      opacity: [0.3, 1, 0.3],
      scale: [0.95, 1, 0.95],
      transition: {
        duration: 1.5,
        ease: 'easeInOut' as const
      }
    }
  };

  const renderLoadingContent = () => {
    switch (type) {
      case 'spinner':
        return (
          <motion.div variants={spinnerVariants} animate="animate">
            <Loader2 className={`${sizeClasses[size]} text-primary-600`} />
          </motion.div>
        );

      case 'dots':
        return (
          <motion.div 
            variants={dotsVariants}
            animate="animate"
            className="flex space-x-1"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                variants={dotVariants}
                className={`bg-primary-600 rounded-full ${
                  size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'
                }`}
              />
            ))}
          </motion.div>
        );

      case 'pulse':
        return (
          <motion.div variants={pulseVariants} animate="animate">
            <div className={`bg-primary-600 rounded-full ${sizeClasses[size]}`} />
          </motion.div>
        );

      case 'search':
        return (
          <div className="text-center">
            <motion.div 
              variants={searchVariants}
              animate="animate"
              className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4"
            >
              <Search className="w-8 h-8 text-primary-600" />
            </motion.div>
            <div className="space-y-2">
              <div className="text-h5 text-neutral-900">채용공고를 검색하고 있습니다</div>
              <div className="flex justify-center">
                <motion.div 
                  variants={dotsVariants}
                  animate="animate"
                  className="flex space-x-1"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      variants={dotVariants}
                      className="w-2 h-2 bg-primary-600 rounded-full"
                    />
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'job-loading':
        return (
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-2"
              >
                <Briefcase className="w-6 h-6 text-primary-600" />
              </motion.div>
              <div className="text-h6 text-neutral-900">최신 채용공고를 불러오고 있습니다</div>
            </div>
            
            <motion.div 
              variants={jobLoadingVariants}
              animate="animate"
              className="space-y-3"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  className="p-4 bg-neutral-100 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-neutral-200 rounded animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-neutral-200 rounded animate-pulse" />
                      <div className="h-3 bg-neutral-200 rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );

      default:
        return (
          <motion.div variants={spinnerVariants} animate="animate">
            <Loader2 className={`${sizeClasses[size]} text-primary-600`} />
          </motion.div>
        );
    }
  };

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        {renderLoadingContent()}
        {message && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mt-4 text-neutral-600 ${
              size === 'sm' ? 'text-caption' : 'text-body2'
            }`}
          >
            {message}
          </motion.p>
        )}
      </div>
    </div>
  );
};

interface ProgressLoadingProps {
  progress: number;
  message?: string;
  className?: string;
}

export const ProgressLoading: React.FC<ProgressLoadingProps> = ({
  progress,
  message,
  className = ''
}) => {
  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="max-w-xs mx-auto">
        <div className="mb-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-8 h-8 text-primary-600" />
            </motion.div>
          </div>
          <div className="text-h6 text-neutral-900 mb-2">
            {message || '로딩 중...'}
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <div className="text-caption text-neutral-500 mt-1">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
};

interface InlineLoadingProps {
  text?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  text = '로딩 중',
  size = 'sm',
  className = ''
}) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-primary-600`} />
      </motion.div>
      <span className={`text-neutral-600 ${size === 'sm' ? 'text-body2' : 'text-body1'}`}>
        {text}
      </span>
    </div>
  );
};

export default LoadingState;