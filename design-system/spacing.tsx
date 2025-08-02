import React from 'react';

interface SpacingExampleProps {
  value: string;
  pixels: string;
  className: string;
  usage: string;
}

const SpacingExample: React.FC<SpacingExampleProps> = ({ value, pixels, className, usage }) => (
  <div className="flex items-center gap-6 p-4 border border-neutral-200 rounded-lg bg-white">
    <div className="flex items-center gap-3 min-w-[120px]">
      <div 
        className={`bg-primary-500 rounded ${className}`}
        style={{ minWidth: '8px', minHeight: '8px' }}
      />
      <div className="text-right">
        <div className="text-body2 font-mono text-neutral-900">{value}</div>
        <div className="text-caption text-neutral-500">{pixels}</div>
      </div>
    </div>
    <div className="flex-1">
      <p className="text-body2 text-neutral-600">{usage}</p>
    </div>
  </div>
);

interface BreakpointExampleProps {
  name: string;
  value: string;
  description: string;
  devices: string;
}

const BreakpointExample: React.FC<BreakpointExampleProps> = ({ name, value, description, devices }) => (
  <div className="p-4 border border-neutral-200 rounded-lg bg-white">
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-h6 text-neutral-900">{name}</h4>
      <span className="text-body2 font-mono text-neutral-600">{value}</span>
    </div>
    <p className="text-body2 text-neutral-600 mb-1">{description}</p>
    <p className="text-caption text-neutral-500">{devices}</p>
  </div>
);

export const SpacingSystemDemo: React.FC = () => {
  const spacingValues = [
    { value: '0', pixels: '0px', className: 'w-0 h-0', usage: '여백 없음, 경계선 제거' },
    { value: '0.5', pixels: '2px', className: 'w-0.5 h-0.5', usage: '최소 여백, 세밀한 조정' },
    { value: '1', pixels: '4px', className: 'w-1 h-1', usage: '아이콘과 텍스트 사이' },
    { value: '2', pixels: '8px', className: 'w-2 h-2', usage: '관련 요소 간 기본 여백' },
    { value: '3', pixels: '12px', className: 'w-3 h-3', usage: '버튼 내부 패딩' },
    { value: '4', pixels: '16px', className: 'w-4 h-4', usage: '카드 내부 패딩, 폼 요소 간격' },
    { value: '6', pixels: '24px', className: 'w-6 h-6', usage: '섹션 내부 여백, 제목과 본문 사이' },
    { value: '8', pixels: '32px', className: 'w-8 h-8', usage: '카드 간격, 주요 컴포넌트 여백' },
    { value: '12', pixels: '48px', className: 'w-12 h-12', usage: '섹션 간 큰 여백' },
    { value: '16', pixels: '64px', className: 'w-16 h-16', usage: '페이지 레벨 여백, 헤더 높이' },
    { value: '20', pixels: '80px', className: 'w-20 h-20', usage: '페이지 상하 여백' },
    { value: '24', pixels: '96px', className: 'w-24 h-24', usage: '대형 섹션 여백' },
  ];

  const breakpoints = [
    {
      name: 'Mobile',
      value: '< 640px',
      description: '모바일 디바이스용 레이아웃',
      devices: 'iPhone, Android 폰'
    },
    {
      name: 'Small (sm)',
      value: '≥ 640px',
      description: '큰 모바일, 작은 태블릿',
      devices: '큰 폰, 접힌 태블릿'
    },
    {
      name: 'Medium (md)',
      value: '≥ 768px',
      description: '태블릿 세로 모드',
      devices: 'iPad, Android 태블릿'
    },
    {
      name: 'Large (lg)',
      value: '≥ 1024px',
      description: '태블릿 가로, 작은 노트북',
      devices: 'iPad Pro, 작은 랩톱'
    },
    {
      name: 'Extra Large (xl)',
      value: '≥ 1280px',
      description: '데스크톱, 큰 노트북',
      devices: '일반 모니터, 노트북'
    },
    {
      name: '2X Large (2xl)',
      value: '≥ 1536px',
      description: '대형 데스크톱',
      devices: '큰 모니터, 울트라와이드'
    }
  ];

  const shadowExamples = [
    { name: 'sm', css: 'shadow-sm', description: '미세한 그림자, 버튼 hover' },
    { name: 'DEFAULT', css: 'shadow', description: '기본 그림자, 카드 기본 상태' },
    { name: 'md', css: 'shadow-md', description: '중간 그림자, 카드 hover' },
    { name: 'lg', css: 'shadow-lg', description: '큰 그림자, 모달, 드롭다운' },
    { name: 'xl', css: 'shadow-xl', description: '매우 큰 그림자, 오버레이' },
    { name: '2xl', css: 'shadow-2xl', description: '최대 그림자, 팝업' },
  ];

  const borderRadiusExamples = [
    { name: 'none', css: 'rounded-none', description: '각진 모서리' },
    { name: 'sm', css: 'rounded-sm', description: '살짝 둥근 모서리' },
    { name: 'DEFAULT', css: 'rounded', description: '기본 둥근 모서리' },
    { name: 'md', css: 'rounded-md', description: '중간 둥근 모서리' },
    { name: 'lg', css: 'rounded-lg', description: '큰 둥근 모서리' },
    { name: 'xl', css: 'rounded-xl', description: '매우 큰 둥근 모서리' },
    { name: 'full', css: 'rounded-full', description: '완전한 원형/타원' },
  ];

  return (
    <div className="space-y-12 p-6 bg-neutral-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-h1 text-neutral-900 mb-2">Spacing & Layout System</h1>
          <p className="text-body1 text-neutral-600">
            8px 기반 그리드 시스템과 반응형 브레이크포인트
          </p>
        </div>

        <div className="space-y-12">
          {/* Spacing Values */}
          <section>
            <h2 className="text-h3 text-neutral-900 mb-6">Spacing Scale (8px 기반)</h2>
            <div className="space-y-3">
              {spacingValues.map((spacing, index) => (
                <SpacingExample key={index} {...spacing} />
              ))}
            </div>
          </section>

          {/* Breakpoints */}
          <section>
            <h2 className="text-h3 text-neutral-900 mb-6">Responsive Breakpoints</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {breakpoints.map((breakpoint, index) => (
                <BreakpointExample key={index} {...breakpoint} />
              ))}
            </div>
          </section>

          {/* Shadows */}
          <section>
            <h2 className="text-h3 text-neutral-900 mb-6">Shadow System</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shadowExamples.map((shadow, index) => (
                <div key={index} className="space-y-3">
                  <div className={`w-full h-24 bg-white ${shadow.css} rounded-lg flex items-center justify-center`}>
                    <span className="text-body2 font-mono text-neutral-600">{shadow.name}</span>
                  </div>
                  <div>
                    <h4 className="text-body1 font-medium text-neutral-900">{shadow.name}</h4>
                    <p className="text-body2 text-neutral-600">{shadow.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Border Radius */}
          <section>
            <h2 className="text-h3 text-neutral-900 mb-6">Border Radius</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {borderRadiusExamples.map((radius, index) => (
                <div key={index} className="space-y-3">
                  <div className={`w-full h-16 bg-primary-500 ${radius.css} flex items-center justify-center`}>
                    <span className="text-caption font-mono text-white">{radius.name}</span>
                  </div>
                  <div>
                    <h4 className="text-body2 font-medium text-neutral-900">{radius.name}</h4>
                    <p className="text-caption text-neutral-600">{radius.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Usage Guidelines */}
          <section>
            <h2 className="text-h3 text-neutral-900 mb-6">Usage Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-lg border border-neutral-200">
                <h3 className="text-h5 text-neutral-900 mb-4">8px Grid System</h3>
                <ul className="space-y-2 text-body2 text-neutral-600">
                  <li>• 모든 여백은 8의 배수 사용</li>
                  <li>• 4px는 미세 조정용으로만 사용</li>
                  <li>• 일관성 있는 시각적 리듬 생성</li>
                  <li>• 디자이너-개발자 협업 효율성</li>
                </ul>
              </div>

              <div className="p-6 bg-white rounded-lg border border-neutral-200">
                <h3 className="text-h5 text-neutral-900 mb-4">Responsive Design</h3>
                <ul className="space-y-2 text-body2 text-neutral-600">
                  <li>• Mobile First 접근 방식</li>
                  <li>• 터치 타겟 최소 44px</li>
                  <li>• 읽기 폭 최대 75자</li>
                  <li>• 적절한 여백으로 호흡감 확보</li>
                </ul>
              </div>

              <div className="p-6 bg-white rounded-lg border border-neutral-200">
                <h3 className="text-h5 text-neutral-900 mb-4">Shadow Usage</h3>
                <ul className="space-y-2 text-body2 text-neutral-600">
                  <li>• 계층 구조 표현</li>
                  <li>• 인터랙션 피드백</li>
                  <li>• 공간감 연출</li>
                  <li>• 과도한 사용 지양</li>
                </ul>
              </div>

              <div className="p-6 bg-white rounded-lg border border-neutral-200">
                <h3 className="text-h5 text-neutral-900 mb-4">Border Radius</h3>
                <ul className="space-y-2 text-body2 text-neutral-600">
                  <li>• 친근하고 부드러운 느낌</li>
                  <li>• 콘텐츠 유형에 따라 선택</li>
                  <li>• 브랜드 성격 반영</li>
                  <li>• 일관성 있는 적용</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SpacingSystemDemo;