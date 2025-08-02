'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-sm hover:shadow-md',
    ghost: 'text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500',
    destructive: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 shadow-sm hover:shadow-md',
    outline: 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-500'
  };
  
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2'
  };
  
  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { 
        type: 'spring' as const,
        stiffness: 400,
        damping: 25
      }
    },
    tap: { 
      scale: 0.98,
      transition: { 
        type: 'spring' as const,
        stiffness: 400,
        damping: 30
      }
    },
    loading: {
      scale: 1,
      transition: { 
        type: 'spring' as const,
        stiffness: 300,
        damping: 30
      }
    }
  };


  const iconVariants = {
    loading: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear' as const
      }
    }
  };

  const contentVariants = {
    loading: {
      opacity: 0.7,
      transition: { duration: 0.2 }
    },
    normal: {
      opacity: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.button
      variants={buttonVariants}
      initial="initial"
      whileHover={!disabled && !loading ? "hover" : undefined}
      whileTap={!disabled && !loading ? "tap" : undefined}
      animate={loading ? "loading" : "initial"}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      <motion.div
        variants={contentVariants}
        animate={loading ? "loading" : "normal"}
        className="flex items-center justify-center gap-inherit"
      >
        {loading ? (
          <motion.div variants={iconVariants} animate="loading">
            <Loader2 className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />
          </motion.div>
        ) : leftIcon ? (
          <span className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`}>
            {leftIcon}
          </span>
        ) : null}
        
        <span>{children}</span>
        
        {!loading && rightIcon && (
          <span className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`}>
            {rightIcon}
          </span>
        )}
      </motion.div>
    </motion.button>
  );
};

export default Button;