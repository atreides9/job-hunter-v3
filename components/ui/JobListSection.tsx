'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import JobCard, { Job } from './JobCard';
import { SkeletonGrid } from './Skeleton';
import Button from './Button';

interface FilterOptions {
  type: string[];
  experience: string[];
  location: string[];
  salary: string[];
  company: string[];
}

interface JobListSectionProps {
  jobs: Job[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onJobClick?: (job: Job) => void;
  onBookmark?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  onFilter?: (filters: FilterOptions) => void;
  className?: string;
}

const JobListSection: React.FC<JobListSectionProps> = ({
  jobs,
  loading = false,
  hasMore = true,
  onLoadMore,
  onJobClick,
  onBookmark,
  onApply,
  onFilter,
  className = ''
}) => {
  const [layout, setLayout] = useState<'card' | 'list'>('card');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    type: [],
    experience: [],
    location: [],
    salary: [],
    company: []
  });
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastJobElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore?.();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const
      }
    }
  };

  const layoutTransition = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30
  };

  const filterOptions = {
    type: ['정규직', '계약직', '인턴', '프리랜서'],
    experience: ['신입', '1-3년', '4-7년', '8년 이상'],
    location: ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산'],
    salary: ['3000만원 이하', '3000-5000만원', '5000-7000만원', '7000만원 이상'],
  };

  const handleFilterChange = (category: keyof FilterOptions, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      const currentValues = newFilters[category];
      
      if (currentValues.includes(value)) {
        newFilters[category] = currentValues.filter(v => v !== value);
      } else {
        newFilters[category] = [...currentValues, value];
      }
      
      onFilter?.(newFilters);
      return newFilters;
    });
  };

  const clearFilters = () => {
    const emptyFilters = {
      type: [],
      experience: [],
      location: [],
      salary: [],
      company: []
    };
    setFilters(emptyFilters);
    onFilter?.(emptyFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).flat().length;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-h3 text-neutral-900 mb-2">채용공고</h2>
          <p className="text-body1 text-neutral-600">
            총 {jobs.length.toLocaleString()}개의 채용공고
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            className="relative"
          >
            필터
            {getActiveFilterCount() > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                {getActiveFilterCount()}
              </span>
            )}
          </Button>
          
          {/* Layout Toggle */}
          <div className="flex items-center bg-neutral-100 rounded-lg p-1">
            <motion.button
              onClick={() => setLayout('card')}
              className={`p-2 rounded-md transition-colors ${
                layout === 'card' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Grid className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => setLayout('list')}
              className={`p-2 rounded-md transition-colors ${
                layout === 'list' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <List className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-neutral-200 rounded-lg p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-h5 text-neutral-900">필터 옵션</h3>
              <div className="flex items-center gap-2">
                {getActiveFilterCount() > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    전체 해제
                  </Button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(filterOptions).map(([category, options]) => (
                <div key={category}>
                  <h4 className="text-body1 font-medium text-neutral-900 mb-3 capitalize">
                    {category === 'type' ? '고용형태' :
                     category === 'experience' ? '경력' :
                     category === 'location' ? '지역' :
                     category === 'salary' ? '연봉' : category}
                  </h4>
                  <div className="space-y-2">
                    {options.map((option) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters[category as keyof FilterOptions].includes(option)}
                          onChange={() => handleFilterChange(category as keyof FilterOptions, option)}
                          className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-body2 text-neutral-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Job List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout
        transition={layoutTransition}
        className={
          layout === 'card'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }
      >
        <AnimatePresence mode="popLayout">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              ref={index === jobs.length - 1 ? lastJobElementRef : null}
              variants={itemVariants}
              layout
              transition={layoutTransition}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <JobCard
                job={job}
                layout={layout}
                onClick={onJobClick}
                onBookmark={onBookmark}
                onApply={onApply}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <SkeletonGrid 
            count={layout === 'card' ? 6 : 3} 
            layout={layout}
          />
        </motion.div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && jobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-8"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            leftIcon={<ChevronDown className="w-5 h-5" />}
            className="min-w-[200px]"
          >
            더 많은 채용공고 보기
          </Button>
        </motion.div>
      )}

      {/* No More Jobs */}
      {!loading && !hasMore && jobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-neutral-500 text-body1">
            모든 채용공고를 확인했습니다
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default JobListSection;