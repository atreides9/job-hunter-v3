'use client'

import React from 'react'
import Layout from '@/components/Layout'
import { TrendingUp, BarChart, Users, Target, Clock, Star } from 'lucide-react'

const InsightsPage: React.FC = () => {
  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Page Header */}
        <div className="card" style={{
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <TrendingUp size={48} style={{ color: 'var(--blue)', marginBottom: '1rem' }} />
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '0.5rem'
          }}>
            인사이트 대시보드
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.125rem'
          }}>
            취업 활동 분석과 개인화된 인사이트를 확인하세요
          </p>
        </div>

        {/* Coming Soon */}
        <div className="card" style={{
          padding: '4rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {[
              { icon: BarChart, label: '지원 통계', color: 'var(--blue)' },
              { icon: Users, label: '업계 트렌드', color: 'var(--green)' },
              { icon: Target, label: '매칭 분석', color: 'var(--orange)' },
              { icon: Clock, label: '활동 패턴', color: 'var(--purple)' },
              { icon: Star, label: '추천 공고', color: 'var(--pink)' },
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: 0.5
              }}>
                <item.icon size={32} style={{ color: item.color }} />
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: 'var(--text-secondary)'
                }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            곧 출시됩니다!
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.125rem',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            개인화된 취업 인사이트, 업계 동향 분석, 지원 패턴 최적화 등 
            다양한 기능을 준비하고 있습니다.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default InsightsPage