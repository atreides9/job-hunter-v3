import React from 'react';

interface ColorPaletteProps {
  title: string;
  colors: Record<string, string>;
  className?: string;
}

const ColorSwatch: React.FC<{ color: string; name: string; value: string }> = ({ 
  color, 
  name, 
  value 
}) => (
  <div className="flex flex-col items-center p-3 rounded-lg border border-neutral-200 hover:shadow-md transition-shadow">
    <div 
      className="w-16 h-16 rounded-lg border border-neutral-200 mb-2"
      style={{ backgroundColor: color }}
    />
    <div className="text-center">
      <div className="text-sm font-medium text-neutral-900">{name}</div>
      <div className="text-xs text-neutral-500 font-mono">{value}</div>
    </div>
  </div>
);

const ColorPalette: React.FC<ColorPaletteProps> = ({ title, colors, className = "" }) => (
  <div className={`space-y-4 ${className}`}>
    <h3 className="text-h5 text-neutral-900">{title}</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 gap-4">
      {Object.entries(colors).map(([name, value]) => (
        <ColorSwatch 
          key={name} 
          color={value} 
          name={name} 
          value={value} 
        />
      ))}
    </div>
  </div>
);

export const ColorSystemDemo: React.FC = () => {
  const primaryColors = {
    50: '#fef7f0',
    100: '#fdeee1',
    200: '#f9d5b8',
    300: '#f4b88a',
    400: '#ed9759',
    500: '#e67d36',
    600: '#d66e2b',
    700: '#b15826',
    800: '#8e4827',
    900: '#733c23',
    950: '#3e1e11',
  };

  const secondaryColors = {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  };

  const neutralColors = {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  };

  const semanticColors = {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  };

  return (
    <div className="space-y-8 p-6 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-h1 text-neutral-900 mb-2">Color System</h1>
          <p className="text-body1 text-neutral-600">
            Simple, Warm, Empowering 디자인 원칙을 따르는 컬러 팔레트
          </p>
        </div>

        <div className="space-y-12">
          <ColorPalette 
            title="Primary Colors - 따뜻하고 친근한 메인 컬러" 
            colors={primaryColors} 
          />
          
          <ColorPalette 
            title="Secondary Colors - 부드러운 보조 컬러" 
            colors={secondaryColors} 
          />
          
          <ColorPalette 
            title="Neutral Colors - 회색 계열" 
            colors={neutralColors} 
          />
          
          <ColorPalette 
            title="Semantic Colors" 
            colors={semanticColors} 
          />
        </div>

        <div className="mt-12 space-y-6">
          <h3 className="text-h5 text-neutral-900">Usage Examples</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg border border-neutral-200 shadow-sm">
              <div className="w-8 h-8 bg-primary-500 rounded-lg mb-4"></div>
              <h4 className="text-h6 text-neutral-900 mb-2">Primary Action</h4>
              <p className="text-body2 text-neutral-600">
                메인 액션 버튼, 링크, 중요한 UI 요소에 사용
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-neutral-200 shadow-sm">
              <div className="w-8 h-8 bg-secondary-500 rounded-lg mb-4"></div>
              <h4 className="text-h6 text-neutral-900 mb-2">Secondary Action</h4>
              <p className="text-body2 text-neutral-600">
                보조 액션, 정보 표시, 부가 기능에 사용
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-neutral-200 shadow-sm">
              <div className="w-8 h-8 bg-neutral-500 rounded-lg mb-4"></div>
              <h4 className="text-h6 text-neutral-900 mb-2">Neutral Elements</h4>
              <p className="text-body2 text-neutral-600">
                텍스트, 경계선, 배경 등 기본 UI 요소에 사용
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorSystemDemo;