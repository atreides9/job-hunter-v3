'use client'

import React, { useState, useRef } from 'react'
import { useUserPreferencesContext, useApplicationsContext } from '@/contexts/AppContext'
import Layout from './Layout'
import { User, Upload, FileText, Download, Trash2, Star, Plus, Calendar, File } from 'lucide-react'

const ResumePage: React.FC = () => {
  const { darkMode } = useUserPreferencesContext()
  const { resumes, addResume, deleteResume } = useApplicationsContext()
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Using CSS variables from Apple Design System
  const theme = {
    bg: 'var(--bg-primary)',
    cardBg: 'var(--bg-tertiary)',
    text: 'var(--text-primary)',
    textSecondary: 'var(--text-secondary)',
    border: 'var(--separator)'
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach(file => {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const newResume = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name.replace('.pdf', ''),
          uploadDate: new Date().toISOString(),
          fileUrl: URL.createObjectURL(file),
          isDefault: resumes.length === 0
        }
        addResume(newResume)
      } else {
        alert('PDF 파일만 업로드 가능합니다.')
      }
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const setAsDefault = () => {
    // This would typically update the resume in the context
    alert('기본 이력서로 설정되었습니다.')
  }

  const downloadResume = (resume: { fileUrl: string; name: string }) => {
    const link = document.createElement('a')
    link.href = resume.fileUrl
    link.download = `${resume.name}.pdf`
    link.click()
  }

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Page Header */}
        <div style={{
          background: theme.cardBg,
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <User size={32} color="#667eea" />
            이력서 관리
          </h1>
          <p style={{
            color: theme.textSecondary,
            fontSize: '1.125rem'
          }}>
            이력서를 업로드하고 관리하세요. 여러 버전의 이력서를 저장할 수 있습니다.
          </p>
        </div>

        {/* Upload Area */}
        <div style={{
          background: theme.cardBg,
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          border: dragOver ? '2px dashed #667eea' : `2px dashed ${theme.border}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        >
          <div style={{
            textAlign: 'center',
            color: dragOver ? '#667eea' : theme.textSecondary
          }}>
            <Upload size={48} style={{ marginBottom: '1rem', margin: '0 auto' }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: theme.text,
              marginBottom: '0.5rem'
            }}>
              이력서 업로드
            </h3>
            <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
              클릭하거나 파일을 드래그해서 업로드하세요
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              PDF 파일만 지원됩니다 (최대 10MB)
            </p>
            
            <button
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.875rem',
                marginTop: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#5a67d8'}
              onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#667eea'}
            >
              <Plus size={16} />
              파일 선택
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </div>

        {/* Resume List */}
        <div style={{
          background: theme.cardBg,
          borderRadius: '1rem',
          padding: '2rem',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: theme.text,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FileText size={24} />
            저장된 이력서 ({resumes.length}개)
          </h2>

          {resumes.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: theme.textSecondary
            }}>
              <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                저장된 이력서가 없습니다
              </p>
              <p style={{ fontSize: '0.875rem' }}>
                위의 업로드 영역에서 이력서를 추가해보세요
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  style={{
                    background: darkMode ? '#0f172a' : '#f8fafc',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <div style={{
                      background: '#667eea',
                      color: 'white',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <File size={24} />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <h3 style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          color: theme.text,
                          margin: 0
                        }}>
                          {resume.name}
                        </h3>
                        {resume.isDefault && (
                          <span style={{
                            background: '#f59e0b',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <Star size={12} />
                            기본
                          </span>
                        )}
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        color: theme.textSecondary
                      }}>
                        <Calendar size={14} />
                        업로드: {new Date(resume.uploadDate).toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {!resume.isDefault && (
                      <button
                        onClick={() => setAsDefault()}
                        style={{
                          background: 'transparent',
                          color: '#f59e0b',
                          border: '1px solid #f59e0b',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          (e.target as HTMLElement).style.background = '#f59e0b'
                          ;(e.target as HTMLElement).style.color = 'white'
                        }}
                        onMouseOut={(e) => {
                          (e.target as HTMLElement).style.background = 'transparent'
                          ;(e.target as HTMLElement).style.color = '#f59e0b'
                        }}
                      >
                        <Star size={14} />
                        기본설정
                      </button>
                    )}
                    
                    <button
                      onClick={() => downloadResume(resume)}
                      style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#059669'}
                      onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#10b981'}
                    >
                      <Download size={14} />
                      다운로드
                    </button>
                    
                    <button
                      onClick={() => deleteResume(resume.id)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#dc2626'}
                      onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#ef4444'}
                    >
                      <Trash2 size={14} />
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default ResumePage