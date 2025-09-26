'use client';

import { memo } from 'react';

const renderLabel = memo((entry: { percent: number }) => 
  `${(entry.percent * 100).toFixed(1)}%`
);
renderLabel.displayName = 'RenderLabel';

export default renderLabel;