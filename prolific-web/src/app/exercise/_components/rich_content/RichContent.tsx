'use client';

import React from 'react';
import Table from './Table';
import LineChart from './LineChart';
import { RichContentProps } from './rich_content.type';
import PieChart from './PieChart';
import BarChart from './BarChart';

export default function RichContent({ richContent }: RichContentProps) {
  if (!richContent) return null;

  // Handle different types of rich content
  switch (richContent.type) {
    case 'table':
      return <Table richContent={richContent} />;
    case 'line':
      return <LineChart richContent={richContent} />;
    case 'pie':
      return <PieChart richContent={richContent} />;
    case 'bar':
      return <BarChart richContent={richContent} />;
    default:
      console.warn('Unsupported rich content type');
      return null;
  }
} 