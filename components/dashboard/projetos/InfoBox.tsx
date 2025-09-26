'use client';

import { memo } from 'react';
import { TipoVisualizacao, InfoBoxItem } from './types';

interface InfoBoxProps {
  item: InfoBoxItem;
  isVisible: boolean;
  onClose: () => void;
  color: string;
  isAnimating: boolean;
  tipo: TipoVisualizacao;
}

const InfoBox = memo(function InfoBox({ 
  item, 
  isVisible, 
  onClose, 
  color, 
  isAnimating, 
  tipo 
}: InfoBoxProps) {
  if (!isVisible || !item) return null;

  const percent = ((item.value / item.totalSum) * 100).toFixed(1);
  const valorFormatado = tipo === 'financeiro' 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value)
    : item.value.toString();

  return (
    <div className={`fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-xs transition-all duration-300 ${isAnimating ? 'scale-105' : ''}`}>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Fechar"
      >
        ✕
      </button>
      
      <div className="flex items-center gap-3 mb-3">
        <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <h3 className="font-bold text-gray-800 text-lg leading-tight">{item.nome}</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded">
          <span className="text-gray-700 font-medium">
            {tipo === 'financeiro' ? 'Valor:' : 'Projetos:'}
          </span>
          <span className="font-bold text-blue-600 text-xl">{valorFormatado}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded">
          <span className="text-gray-700 font-medium">Percentual:</span>
          <span className="font-bold text-green-600 text-xl">{percent}%</span>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">Programa de Pesquisa</span>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.isVisible === nextProps.isVisible &&
    prevProps.isAnimating === nextProps.isAnimating &&
    prevProps.item?.value === nextProps.item?.value &&
    prevProps.color === nextProps.color
  );
});

InfoBox.displayName = 'InfoBox';

export default InfoBox;