'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, Users, Bookmark, ExternalLink } from 'lucide-react';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: string;
  salary?: string;
  postedDate: string;
  deadline?: string;
  description: string;
  tags: string[];
  logoUrl?: string;
  isBookmarked?: boolean;
  isUrgent?: boolean;
}

interface JobCardProps {
  job: Job;
  onClick?: (job: Job) => void;
  onBookmark?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  className?: string;
  layout?: 'card' | 'list';
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onClick,
  onBookmark,
  onApply,
  className = '',
  layout = 'card'
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.(job);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark?.(job.id);
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply?.(job.id);
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    hover: { 
      y: -4,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    },
    tap: { 
      scale: 0.98,
      transition: { 
        type: 'spring',
        stiffness: 400,
        damping: 30
      }
    }
  };

  const tagVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const iconVariants = {
    hover: { scale: 1.1, rotate: 5 },
    tap: { scale: 0.9 }
  };

  if (layout === 'list') {
    return (
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover="hover"
        whileTap="tap"
        onClick={handleCardClick}
        className={`
          group cursor-pointer bg-white border border-neutral-200 rounded-lg p-6
          hover:border-primary-300 hover:shadow-md transition-all duration-200
          ${className}
        `}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4 flex-1">
            {job.logoUrl && (
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                <img 
                  src={job.logoUrl} 
                  alt={`${job.company} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-h5 text-neutral-900 group-hover:text-primary-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-body1 text-neutral-600 font-medium">
                    {job.company}
                  </p>
                </div>
                
                {job.isUrgent && (
                  <span className="px-2 py-1 bg-error-100 text-error-700 text-caption font-medium rounded">
                    급구
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-body2 text-neutral-500 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {job.experience}
                </div>
                {job.salary && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {job.postedDate}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {job.tags.slice(0, 4).map((tag, index) => (
                  <motion.span
                    key={tag}
                    variants={tagVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="px-2 py-1 bg-neutral-100 text-neutral-700 text-caption rounded hover:bg-primary-100 transition-colors cursor-pointer"
                  >
                    {tag}
                  </motion.span>
                ))}
                {job.tags.length > 4 && (
                  <span className="text-caption text-neutral-500">
                    +{job.tags.length - 4}개 더
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleBookmarkClick}
              className={`
                p-2 rounded-lg transition-colors
                ${job.isBookmarked 
                  ? 'text-primary-600 bg-primary-100 hover:bg-primary-200' 
                  : 'text-neutral-400 hover:text-primary-600 hover:bg-primary-50'
                }
              `}
              aria-label={job.isBookmarked ? '북마크 제거' : '북마크 추가'}
            >
              <Bookmark className={`w-5 h-5 ${job.isBookmarked ? 'fill-current' : ''}`} />
            </motion.button>
            
            <motion.button
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleApplyClick}
              className="px-4 py-2 bg-primary-600 text-white text-body2 font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              지원하기
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      whileTap="tap"
      onClick={handleCardClick}
      className={`
        group cursor-pointer bg-white border border-neutral-200 rounded-lg p-6 
        hover:border-primary-300 hover:shadow-lg transition-all duration-200
        ${className}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {job.logoUrl && (
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
              <img 
                src={job.logoUrl} 
                alt={`${job.company} logo`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-h5 text-neutral-900 group-hover:text-primary-600 transition-colors mb-1">
              {job.title}
            </h3>
            <p className="text-body1 text-neutral-600 font-medium">
              {job.company}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          {job.isUrgent && (
            <span className="px-2 py-1 bg-error-100 text-error-700 text-caption font-medium rounded">
              급구
            </span>
          )}
          
          <motion.button
            variants={iconVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleBookmarkClick}
            className={`
              p-2 rounded-lg transition-colors
              ${job.isBookmarked 
                ? 'text-primary-600 bg-primary-100 hover:bg-primary-200' 
                : 'text-neutral-400 hover:text-primary-600 hover:bg-primary-50'
              }
            `}
            aria-label={job.isBookmarked ? '북마크 제거' : '북마크 추가'}
          >
            <Bookmark className={`w-5 h-5 ${job.isBookmarked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex flex-wrap items-center gap-4 text-body2 text-neutral-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {job.location}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {job.experience}
          </div>
          {job.salary && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {job.salary}
            </div>
          )}
        </div>
        
        <p className="text-body2 text-neutral-600 line-clamp-2">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {job.tags.slice(0, 3).map((tag, index) => (
            <motion.span
              key={tag}
              variants={tagVariants}
              whileHover="hover"
              whileTap="tap"
              className="px-2 py-1 bg-neutral-100 text-neutral-700 text-caption rounded hover:bg-primary-100 transition-colors cursor-pointer"
            >
              {tag}
            </motion.span>
          ))}
          {job.tags.length > 3 && (
            <span className="text-caption text-neutral-500">
              +{job.tags.length - 3}개 더
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
        <div className="flex items-center gap-1 text-body2 text-neutral-500">
          <Clock className="w-4 h-4" />
          {job.postedDate}
          {job.deadline && (
            <>
              <span className="mx-2">•</span>
              <span className="text-warning-600">마감 {job.deadline}</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            variants={iconVariants}
            whileHover="hover"
            whileTap="tap"
            className="p-2 text-neutral-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            aria-label="상세 보기"
          >
            <ExternalLink className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            variants={iconVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleApplyClick}
            className="px-4 py-2 bg-primary-600 text-white text-body2 font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            지원하기
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;