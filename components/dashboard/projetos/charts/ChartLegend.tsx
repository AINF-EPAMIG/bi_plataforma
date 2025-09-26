'use client';

import { memo } from 'react';
import { ChartDataItem, TipoVisualizacao } from '../types';
import { COLORS } from '../constants';

interface ChartLegendProps {
  data: ChartDataItem[];
  activeIndex: number | null;
  hoveredIndex: number | null;
  tipo: TipoVisualizacao;
  onItemClick: (index: number) => void;
  onItemMouseEnter: (index: number) => void;
  onItemMouseLeave: () => void;
}

const ChartLegend = memo(function ChartLegend({
  data,
  activeIndex,
  hoveredIndex,
  tipo,
  onItemClick,
  onItemMouseEnter,
  onItemMouseLeave
}: ChartLegendProps) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      {data.map((programa, index) => (
        <div 
          key={`${programa.name}-${index}`} 
          className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded transition-all duration-200 ${
            activeIndex === index ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
          }`}
          onClick={() => onItemClick(index)}
          onMouseEnter={() => onItemMouseEnter(index)}
          onMouseLeave={onItemMouseLeave}
        >
          <span
            className={`inline-block w-3 h-3 rounded-full transition-all duration-200 ${
              hoveredIndex === index || activeIndex === index ? 'w-4 h-4' : ''
            }`}
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
          <span className={`text-gray-700 truncate ${activeIndex === index ? 'font-semibold' : ''}`}>
            {programa.name}
          </span>
          {(activeIndex === index || hoveredIndex === index) && (
            <span className="ml-auto text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
              {tipo === 'financeiro' 
                ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(programa.value)
                : programa.value
              }
            </span>
          )}
        </div>
      ))}
    </div>
  );
});

ChartLegend.displayName = 'ChartLegend';

export default ChartLegend;