'use client';

import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartDataItem, TipoVisualizacao } from '../types';
import { COLORS } from '../constants';
import MemoizedPieChart from './MemoizedPieChart';
import ChartLegend from './ChartLegend';
import InfoBox from '../InfoBox';

interface ChartCardProps {
  title: string;
  anoSelecionado: number;
  data: ChartDataItem[];
  activeIndex: number | null;
  hoveredIndex: number | null;
  animatingIndex: number | null;
  showInfo: number | null;
  tipo: TipoVisualizacao;
  onSliceClick: (index: number) => void;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
  onInfoClose: () => void;
}

export default function ChartCard({
  title,
  anoSelecionado,
  data,
  activeIndex,
  hoveredIndex,
  animatingIndex,
  showInfo,
  tipo,
  onSliceClick,
  onMouseEnter,
  onMouseLeave,
  onInfoClose
}: ChartCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg md:text-xl">
          {title} - {anoSelecionado === 0 ? 'Todos os Anos' : anoSelecionado}
        </CardTitle>
        <p className="text-sm text-gray-500">Clique nas fatias para destacar</p>
      </CardHeader>
      <CardContent className="relative">
        {/* Info Box */}
        {showInfo !== null && (() => {
          const item = data[showInfo];
          return item && (
            <InfoBox
              item={{ nome: item.name, value: item.value, totalSum: item.totalSum }}
              isVisible={showInfo !== null}
              onClose={onInfoClose}
              color={COLORS[showInfo % COLORS.length]}
              isAnimating={animatingIndex === showInfo}
              tipo={tipo}
            />
          );
        })()}
        
        {/* Chart */}
        <Suspense fallback={<div className="h-80 animate-pulse bg-gray-200 rounded" />}>
          <MemoizedPieChart
            data={data}
            onSliceClick={onSliceClick}
            activeIndex={activeIndex}
            hoveredIndex={hoveredIndex}
            animatingIndex={animatingIndex}
            tipo={tipo}
          />
        </Suspense>

        {/* Legend */}
        <ChartLegend
          data={data}
          activeIndex={activeIndex}
          hoveredIndex={hoveredIndex}
          tipo={tipo}
          onItemClick={onSliceClick}
          onItemMouseEnter={onMouseEnter}
          onItemMouseLeave={onMouseLeave}
        />
      </CardContent>
    </Card>
  );
}