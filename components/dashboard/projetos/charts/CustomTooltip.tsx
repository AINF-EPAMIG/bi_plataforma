'use client';

import { memo } from 'react';
import { TipoVisualizacao } from '../types';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ 
    value: number; 
    color: string; 
    payload: { name?: string; totalSum: number } 
  }>;
  tipo: TipoVisualizacao;
}

const CustomTooltip = memo(function CustomTooltip({ 
  active, 
  payload, 
  tipo 
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0];
  const { value, color } = data;
  const { name, totalSum } = data.payload;
  
  const percent = ((value / totalSum) * 100).toFixed(1);
  const valorFormatado = tipo === 'financeiro' 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    : value.toString();
  
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-semibold text-gray-800">{name}</span>
      </div>
      <div className="text-sm text-gray-600">
        <div>{tipo === 'financeiro' ? 'Valor:' : 'Projetos:'} <span className="font-bold text-gray-800">{valorFormatado}</span></div>
        <div>Percentual: <span className="font-bold text-gray-800">{percent}%</span></div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.active === nextProps.active && 
         prevProps.payload?.[0]?.value === nextProps.payload?.[0]?.value;
});

CustomTooltip.displayName = 'CustomTooltip';

export default CustomTooltip;