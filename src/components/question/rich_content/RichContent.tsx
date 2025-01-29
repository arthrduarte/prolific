import React from 'react';
import { Animated } from 'react-native';
import { Table } from './Table';
import { LineChart } from './LineChart';
import { RichContentProps } from './rich_content.type';
import { PieChart } from './PieChart';

export const RichContent = ({ richContent, richContentAnim }: RichContentProps) => {
  if (!richContent) return null;

  // Handle different types of rich content
  switch (richContent.type) {
    case 'table':
      return <Table richContent={richContent} richContentAnim={richContentAnim} />;
    case 'line':
      return <LineChart richContent={richContent} richContentAnim={richContentAnim} />;
    case 'pie':
      return <PieChart richContent={richContent} richContentAnim={richContentAnim} />;
    default:
      console.warn(`Unsupported rich content type: ${richContent.type}`);
      return null;
  }
}; 