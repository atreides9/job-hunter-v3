'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'rectangular' | 'circular' | 'text';
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  variant = 'rectangular',
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-neutral-200 animate-pulse';
  
  const variantClasses = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4'
  };

  const pulseVariants = {
    initial: { opacity: 0.6 },
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const waveVariants = {
    initial: { 
      backgroundPosition: '-200px 0' 
    },
    animate: {
      backgroundPosition: '200px 0',
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '100%'),
    ...(animation === 'wave' && {
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200px 100%'
    })
  };

  const skeletonVariants = animation === 'pulse' ? pulseVariants : animation === 'wave' ? waveVariants : {};

  return (
    <motion.div
      variants={animation !== 'none' ? skeletonVariants : {}}
      initial={animation !== 'none' ? 'initial' : undefined}
      animate={animation !== 'none' ? 'animate' : undefined}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${className}
      `}
      style={style}
      role="status"
      aria-label="로딩 중..."
    />
  );
};

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  width?: string[];
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  className = '',
  width = []
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={width[index] || (index === lines - 1 ? '75%' : '100%')}
          className="h-4"
        />
      ))}
    </div>
  );
};

interface JobCardSkeletonProps {
  layout?: 'card' | 'list';
  className?: string;
}

export const JobCardSkeleton: React.FC<JobCardSkeletonProps> = ({
  layout = 'card',
  className = ''
}) => {
  if (layout === 'list') {
    return (
      <div className={`p-6 bg-white border border-neutral-200 rounded-lg ${className}`}>
        <div className="flex items-start gap-4">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <Skeleton width="60%" height={20} />
              <Skeleton width="40%" height={16} />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton width={80} height={16} />
              <Skeleton width={60} height={16} />
              <Skeleton width={70} height={16} />
            </div>
            <div className="flex gap-2">
              <Skeleton width={60} height={24} className="rounded-full" />
              <Skeleton width={50} height={24} className="rounded-full" />
              <Skeleton width={55} height={24} className="rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton width={80} height={36} className="rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-white border border-neutral-200 rounded-lg ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="space-y-2 flex-1">
            <Skeleton width="70%" height={20} />
            <Skeleton width="50%" height={16} />
          </div>
        </div>
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-4">
          <Skeleton width={80} height={16} />
          <Skeleton width={60} height={16} />
          <Skeleton width={70} height={16} />
        </div>
        <SkeletonText lines={2} width={['100%', '80%']} />
        <div className="flex gap-2">
          <Skeleton width={60} height={24} className="rounded-full" />
          <Skeleton width={50} height={24} className="rounded-full" />
          <Skeleton width={55} height={24} className="rounded-full" />
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
        <Skeleton width={120} height={16} />
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton width={80} height={36} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
};

interface SkeletonGridProps {
  count?: number;
  layout?: 'card' | 'list';
  className?: string;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  count = 6,
  layout = 'card',
  className = ''
}) => {
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`
        ${layout === 'card' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }
        ${className}
      `}
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div key={index} variants={itemVariants}>
          <JobCardSkeleton layout={layout} />
        </motion.div>
      ))}
    </motion.div>
  );
};

interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <Skeleton
      variant="circular"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
};

interface SkeletonButtonProps {
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  size = 'md',
  fullWidth = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-28'
  };

  return (
    <Skeleton
      className={`
        rounded-lg
        ${fullWidth ? 'w-full' : sizeClasses[size]}
        ${className}
      `}
      height={size === 'sm' ? 32 : size === 'lg' ? 48 : 40}
    />
  );
};

export default Skeleton;