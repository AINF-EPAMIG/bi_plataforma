'use client';

import { memo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ChartDataItem, TipoVisualizacao } from '../types';
import { COLORS } from '../constants';
import CustomTooltip from './CustomTooltip';
import renderLabel from './renderLabel';

interface MemoizedPieChartProps {
  data: ChartDataItem[];
  onSliceClick: (index: number) => void;
  activeIndex: number | null;
  hoveredIndex: number | null;
  animatingIndex: number | null;
  tipo: TipoVisualizacao;
}

const MemoizedPieChart = memo(function MemoizedPieChart({ 
  data, 
  onSliceClick, 
  activeIndex, 
  hoveredIndex, 
  animatingIndex, 
  tipo 
}: MemoizedPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={380}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={2}
          labelLine={false}
          label={renderLabel}
          fill="#8884d8"
          dataKey="value"
          onClick={(event: unknown, index: number) => onSliceClick(index)}
          style={{ cursor: 'pointer' }}
        >
          {data.map((_, index) => {
            const isActive = activeIndex === index;
            const isHovered = hoveredIndex === index;
            const isAnimating = animatingIndex === index;
            
            return (
              <Cell 
                key={`cell-${tipo}-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke={isHovered || isActive ? '#333' : 'transparent'}
                strokeWidth={isHovered || isActive ? 3 : 0}
                style={{
                  filter: isHovered ? 'brightness(1.2)' : isActive ? 'brightness(1.15)' : isAnimating ? 'brightness(1.3)' : 'none',
                  opacity: isHovered || isActive ? 1 : 0.9,
                }}
              />
            );
          })}
        </Pie>
        <Tooltip content={<CustomTooltip tipo={tipo} />} />
      </PieChart>
    </ResponsiveContainer>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.data === nextProps.data &&
    prevProps.activeIndex === nextProps.activeIndex &&
    prevProps.hoveredIndex === nextProps.hoveredIndex &&
    prevProps.animatingIndex === nextProps.animatingIndex
  );
});

MemoizedPieChart.displayName = 'MemoizedPieChart';

export default MemoizedPieChart;