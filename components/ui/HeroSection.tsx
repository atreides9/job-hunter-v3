'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, TrendingUp, Users, Star } from 'lucide-react';
import Button from './Button';

interface HeroSectionProps {
  onSearch?: (query: string, location: string) => void;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [currentText, setCurrentText] = useState('');
  

  useEffect(() => {
    const typingTexts = [
      '프론트엔드 개발자',
      '백엔드 개발자', 
      'UX/UI 디자이너',
      '데이터 사이언티스트',
      '프로덕트 매니저'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimer: NodeJS.Timeout;

    const typeText = () => {
      const currentFullText = typingTexts[textIndex];
      
      if (isDeleting) {
        setCurrentText(currentFullText.substring(0, charIndex - 1));
        charIndex--;
        
        if (charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % typingTexts.length;
          typingTimer = setTimeout(typeText, 500);
          return;
        }
      } else {
        setCurrentText(currentFullText.substring(0, charIndex + 1));
        charIndex++;
        
        if (charIndex === currentFullText.length) {
          isDeleting = true;
          typingTimer = setTimeout(typeText, 2000);
          return;
        }
      }
      
      typingTimer = setTimeout(typeText, isDeleting ? 50 : 100);
    };

    typingTimer = setTimeout(typeText, 1000);
    
    return () => clearTimeout(typingTimer);
  }, []);

  const handleSearch = () => {
    onSearch?.(searchQuery, location);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut' as const
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const
      }
    }
  };

  const stats = [
    { icon: Users, label: '활성 구직자', value: '50,000+' },
    { icon: Briefcase, label: '채용공고', value: '12,000+' },
    { icon: TrendingUp, label: '성공 매칭', value: '25,000+' },
    { icon: Star, label: '만족도', value: '4.8/5' }
  ];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 ${className}`}>
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-200 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32"
      >
        <div className="text-center">
          {/* Main Heading */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-h1 sm:text-5xl lg:text-6xl text-neutral-900 mb-6">
              당신의 꿈을{' '}
              <span className="text-primary-600 relative">
                실현할
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-primary-200 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                />
              </span>
              <br />
              <span className="text-secondary-600">완벽한 직장</span>을 찾아보세요
            </h1>
            
            <div className="text-h4 sm:text-3xl lg:text-4xl text-neutral-600 min-h-[3rem] flex items-center justify-center">
              <span className="mr-2">나는</span>
              <motion.span 
                className="text-primary-600 font-semibold relative"
                animate={pulseVariants.pulse}
              >
                {currentText}
                <motion.span
                  className="absolute right-0 top-0 w-0.5 h-full bg-primary-600"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.span>
              <span className="ml-2">입니다</span>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-body1 sm:text-lg text-neutral-600 max-w-2xl mx-auto mb-12"
          >
            AI 기반 맞춤 추천으로 당신에게 완벽한 일자리를 찾아드립니다. 
            간단한 검색으로 새로운 커리어의 시작점을 발견하세요.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            variants={itemVariants}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-neutral-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="직무, 회사명을 검색하세요"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="지역을 선택하세요"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="h-12 text-base font-semibold"
                  leftIcon={<Search className="w-5 h-5" />}
                >
                  검색하기
                </Button>
              </div>
            </div>
            
            {/* Popular Searches */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-body2 text-neutral-500">인기 검색어:</span>
              {['프론트엔드', '백엔드', 'UI/UX', '마케팅', '데이터분석'].map((tag) => (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchQuery(tag)}
                  className="px-3 py-1 bg-neutral-100 text-neutral-700 text-body2 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors"
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={floatingVariants}
                animate="float"
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-h4 font-bold text-neutral-900 mb-1">{stat.value}</div>
                <div className="text-body2 text-neutral-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-12 fill-white">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;