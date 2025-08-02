import React from 'react';

interface TypographyShowcaseProps {
  title: string;
  examples: Array<{
    name: string;
    element: React.ReactNode;
    description: string;
    css: string;
  }>;
}

const TypographyShowcase: React.FC<TypographyShowcaseProps> = ({ title, examples }) => (
  <div className="space-y-6">
    <h3 className="text-h4 text-neutral-900 border-b border-neutral-200 pb-2">
      {title}
    </h3>
    <div className="space-y-8">
      {examples.map((example, index) => (
        <div key={index} className="space-y-3">
          <div className="border border-neutral-200 rounded-lg p-6 bg-white">
            {example.element}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-body1 font-medium text-neutral-900 mb-1">
                {example.name}
              </h4>
              <p className="text-body2 text-neutral-600">
                {example.description}
              </p>
            </div>
            <div>
              <h4 className="text-body1 font-medium text-neutral-900 mb-1">
                CSS Properties
              </h4>
              <code className="text-body2 text-neutral-600 bg-neutral-100 p-2 rounded block font-mono">
                {example.css}
              </code>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const TypographySystemDemo: React.FC = () => {
  const headingExamples = [
    {
      name: 'H1 - Main Title',
      element: <h1 className="text-h1 text-neutral-900">혁신적인 구직 플랫폼</h1>,
      description: '페이지의 메인 타이틀, 가장 중요한 헤드라인에 사용',
      css: 'font-size: 3rem; line-height: 1.1; font-weight: 700; letter-spacing: -0.025em;'
    },
    {
      name: 'H2 - Section Title',
      element: <h2 className="text-h2 text-neutral-900">당신을 위한 맞춤 채용정보</h2>,
      description: '주요 섹션의 제목, 페이지 구조를 나누는 헤드라인',
      css: 'font-size: 2.25rem; line-height: 1.2; font-weight: 600; letter-spacing: -0.025em;'
    },
    {
      name: 'H3 - Subsection Title',
      element: <h3 className="text-h3 text-neutral-900">인기 채용공고</h3>,
      description: '하위 섹션 제목, 카테고리 헤더에 사용',
      css: 'font-size: 1.875rem; line-height: 1.3; font-weight: 600;'
    },
    {
      name: 'H4 - Card Title',
      element: <h4 className="text-h4 text-neutral-900">프론트엔드 개발자</h4>,
      description: '카드 제목, 주요 콘텐츠 블록의 헤더',
      css: 'font-size: 1.5rem; line-height: 1.4; font-weight: 600;'
    },
    {
      name: 'H5 - Component Title',
      element: <h5 className="text-h5 text-neutral-900">회사명</h5>,
      description: '컴포넌트 내부 제목, 폼 레이블의 상위 제목',
      css: 'font-size: 1.25rem; line-height: 1.5; font-weight: 500;'
    },
    {
      name: 'H6 - Small Title',
      element: <h6 className="text-h6 text-neutral-900">위치 정보</h6>,
      description: '작은 제목, 세부 정보의 카테고리명',
      css: 'font-size: 1.125rem; line-height: 1.5; font-weight: 500;'
    }
  ];

  const bodyExamples = [
    {
      name: 'Body 1 - Primary Text',
      element: (
        <p className="text-body1 text-neutral-900">
          우리는 당신의 꿈을 실현할 수 있는 최고의 직장을 찾아드립니다. 
          개인의 역량과 기업의 필요를 정확히 매칭하여 완벽한 커리어 기회를 제공합니다.
        </p>
      ),
      description: '본문의 주요 텍스트, 설명문, 일반적인 읽기용 텍스트',
      css: 'font-size: 1rem; line-height: 1.5; font-weight: 400;'
    },
    {
      name: 'Body 2 - Secondary Text',
      element: (
        <p className="text-body2 text-neutral-600">
          2024년 12월 31일까지 • 서울 강남구 • 경력 3-5년 • 정규직
        </p>
      ),
      description: '보조 정보, 메타데이터, 부가 설명에 사용',
      css: 'font-size: 0.875rem; line-height: 1.4; font-weight: 400;'
    },
    {
      name: 'Caption - Small Text',
      element: (
        <p className="text-caption text-neutral-500">
          * 본 정보는 실시간으로 업데이트됩니다
        </p>
      ),
      description: '캡션, 작은 주석, 법적 고지사항에 사용',
      css: 'font-size: 0.75rem; line-height: 1.3; font-weight: 400; letter-spacing: 0.025em;'
    }
  ];

  const specialExamples = [
    {
      name: 'Button Text',
      element: (
        <span className="text-body1 font-medium text-primary-600">
          지원하기
        </span>
      ),
      description: '버튼 내부 텍스트, 액션을 나타내는 텍스트',
      css: 'font-size: 1rem; line-height: 1.5; font-weight: 500;'
    },
    {
      name: 'Link Text',
      element: (
        <a href="#" className="text-body1 text-secondary-600 underline hover:text-secondary-700">
          자세히 보기
        </a>
      ),
      description: '링크 텍스트, 네비게이션 메뉴에 사용',
      css: 'font-size: 1rem; line-height: 1.5; font-weight: 400; text-decoration: underline;'
    },
    {
      name: 'Code Text',
      element: (
        <code className="text-body2 font-mono bg-neutral-100 px-2 py-1 rounded text-neutral-800">
          const jobTitle = "Frontend Developer"
        </code>
      ),
      description: '코드 스니펫, 기술적 정보 표시',
      css: 'font-family: monospace; font-size: 0.875rem; background: #f5f5f5; padding: 0.25rem 0.5rem; border-radius: 0.25rem;'
    }
  ];

  return (
    <div className="space-y-12 p-6 bg-neutral-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-h1 text-neutral-900 mb-2">Typography System</h1>
          <p className="text-body1 text-neutral-600">
            한글과 영문을 위한 타이포그래피 시스템 - 가독성과 계층구조를 고려한 설계
          </p>
        </div>

        <div className="space-y-12">
          <TypographyShowcase 
            title="Headings - 제목 체계"
            examples={headingExamples}
          />
          
          <TypographyShowcase 
            title="Body Text - 본문 텍스트"
            examples={bodyExamples}
          />
          
          <TypographyShowcase 
            title="Special Text - 특수 텍스트"
            examples={specialExamples}
          />
        </div>

        <div className="mt-12 space-y-6">
          <h3 className="text-h4 text-neutral-900 border-b border-neutral-200 pb-2">
            Typography Guidelines
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-lg border border-neutral-200">
              <h4 className="text-h6 text-neutral-900 mb-3">Font Family</h4>
              <p className="text-body2 text-neutral-600 mb-3">
                한글: Pretendard (시스템 폰트 fallback)
              </p>
              <p className="text-body2 text-neutral-600 mb-3">
                영문: System UI fonts
              </p>
              <p className="text-body2 text-neutral-600">
                Monospace: UI Monospace, SFMono-Regular
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-neutral-200">
              <h4 className="text-h6 text-neutral-900 mb-3">Best Practices</h4>
              <ul className="text-body2 text-neutral-600 space-y-2">
                <li>• 계층구조 유지: H1 → H2 → H3 순서</li>
                <li>• 적절한 여백: line-height 1.4-1.6</li>
                <li>• 가독성: 충분한 대비와 크기</li>
                <li>• 일관성: 의미에 따른 일관된 사용</li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-lg border border-neutral-200">
              <h4 className="text-h6 text-neutral-900 mb-3">Letter Spacing</h4>
              <ul className="text-body2 text-neutral-600 space-y-2">
                <li>• 큰 제목: -0.025em (조금 조이게)</li>
                <li>• 일반 텍스트: 0em (기본값)</li>
                <li>• 작은 텍스트: 0.025em (조금 넓게)</li>
                <li>• 캡션: 0.025em+ (가독성 향상)</li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-lg border border-neutral-200">
              <h4 className="text-h6 text-neutral-900 mb-3">Responsive Typography</h4>
              <ul className="text-body2 text-neutral-600 space-y-2">
                <li>• 모바일: 크기 20% 감소</li>
                <li>• 태블릿: 기본 크기</li>
                <li>• 데스크톱: 기본 크기</li>
                <li>• 대형 화면: 적절히 증가</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypographySystemDemo;