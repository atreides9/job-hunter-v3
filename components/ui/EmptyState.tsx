'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, Heart, AlertCircle, Wifi, RefreshCw } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  type?: 'no-results' | 'no-bookmarks' | 'no-applications' | 'error' | 'offline';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'no-results',
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  const getEmptyStateConfig = () => {
    switch (type) {
      case 'no-results':
        return {
          icon: Search,
          title: title || '검색 결과가 없습니다',
          description: description || '다른 키워드로 검색하거나 필터 조건을 변경해보세요.',
          actionLabel: actionLabel || '검색 조건 변경',
          illustration: (
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center"
              >
                <Search className="w-12 h-12 text-primary-500" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full"
              />
            </div>
          )
        };
      
      case 'no-bookmarks':
        return {
          icon: Heart,
          title: title || '저장된 공고가 없습니다',
          description: description || '관심있는 채용공고를 북마크하여 나중에 쉽게 찾아보세요.',
          actionLabel: actionLabel || '채용공고 둘러보기',
          illustration: (
            <div className="relative">
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 bg-error-100 rounded-full flex items-center justify-center"
              >
                <Heart className="w-12 h-12 text-error-500" />
              </motion.div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 w-24 h-24 border-2 border-error-300 rounded-full"
              />
            </div>
          )
        };
      
      case 'no-applications':
        return {
          icon: Briefcase,
          title: title || '지원한 공고가 없습니다',
          description: description || '새로운 기회를 찾아 지원해보세요. 꿈의 직장이 기다리고 있습니다!',
          actionLabel: actionLabel || '채용공고 보기',
          illustration: (
            <div className="relative">
              <motion.div
                animate={{ rotateY: [0, 180, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 bg-secondary-100 rounded-lg flex items-center justify-center"
              >
                <Briefcase className="w-12 h-12 text-secondary-500" />
              </motion.div>
              <motion.div
                animate={{ scale: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-neutral-200 rounded-full opacity-30"
              />
            </div>
          )
        };
      
      case 'error':
        return {
          icon: AlertCircle,
          title: title || '문제가 발생했습니다',
          description: description || '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          actionLabel: actionLabel || '다시 시도',
          illustration: (
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(239, 68, 68, 0.4)',
                    '0 0 0 20px rgba(239, 68, 68, 0)',
                    '0 0 0 0 rgba(239, 68, 68, 0)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 bg-error-100 rounded-full flex items-center justify-center"
              >
                <AlertCircle className="w-12 h-12 text-error-500" />
              </motion.div>
            </div>
          )
        };
      
      case 'offline':
        return {
          icon: Wifi,
          title: title || '인터넷 연결을 확인해주세요',
          description: description || '오프라인 상태입니다. 인터넷 연결을 확인하고 다시 시도해주세요.',
          actionLabel: actionLabel || '새로고침',
          illustration: (
            <div className="relative">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center"
              >
                <Wifi className="w-12 h-12 text-neutral-400" />
              </motion.div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-warning-400 rounded-full flex items-center justify-center"
              >
                <RefreshCw className="w-3 h-3 text-white" />
              </motion.div>
            </div>
          )
        };
      
      default:
        return {
          icon: Search,
          title: title || '데이터가 없습니다',
          description: description || '표시할 내용이 없습니다.',
          actionLabel: actionLabel || '새로고침',
          illustration: null
        };
    }
  };

  const config = getEmptyStateConfig();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}
    >
      {/* Illustration */}
      <motion.div variants={itemVariants} className="mb-8">
        {config.illustration || (
          <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center">
            <config.icon className="w-12 h-12 text-neutral-400" />
          </div>
        )}
      </motion.div>

      {/* Content */}
      <motion.div variants={itemVariants} className="mb-8 max-w-md">
        <h3 className="text-h4 text-neutral-900 mb-4">{config.title}</h3>
        <p className="text-body1 text-neutral-600 leading-relaxed">
          {config.description}
        </p>
      </motion.div>

      {/* Action Button */}
      {onAction && (
        <motion.div variants={itemVariants}>
          <Button
            onClick={onAction}
            size="lg"
            className="min-w-[200px]"
            leftIcon={
              type === 'error' || type === 'offline' ? 
                <RefreshCw className="w-5 h-5" /> : 
                <config.icon className="w-5 h-5" />
            }
          >
            {config.actionLabel}
          </Button>
        </motion.div>
      )}

      {/* Additional Tips */}
      {type === 'no-results' && (
        <motion.div 
          variants={itemVariants}
          className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-200 max-w-md"
        >
          <h4 className="text-body1 font-medium text-primary-900 mb-2">검색 팁</h4>
          <ul className="text-body2 text-primary-800 space-y-1 text-left">
            <li>• 키워드를 단순화해보세요</li>
            <li>• 다른 지역을 선택해보세요</li>
            <li>• 필터 조건을 줄여보세요</li>
            <li>• 유사한 직무명으로 검색해보세요</li>
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;