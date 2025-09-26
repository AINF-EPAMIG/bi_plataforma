'use client';

import { ViewMode } from './types';

interface ViewModeSwitchProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function ViewModeSwitch({ viewMode, onViewModeChange }: ViewModeSwitchProps) {
  return (
    <div className="flex justify-center">
      <div className="bg-gray-100 p-1 rounded-lg inline-flex">
        <button
          onClick={() => onViewModeChange('graficos')}
          className={`px-8 py-3 rounded-md text-base font-medium transition-all duration-200 ${
            viewMode === 'graficos'
              ? 'bg-[#025C3E] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📊 Gráficos
        </button>
        <button
          onClick={() => onViewModeChange('tabelas')}
          className={`px-8 py-3 rounded-md text-base font-medium transition-all duration-200 ${
            viewMode === 'tabelas'
              ? 'bg-[#025C3E] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📋 Tabelas
        </button>
      </div>
    </div>
  );
}