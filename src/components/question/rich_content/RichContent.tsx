import React from 'react';
import { Animated } from 'react-native';
import { Table } from './Table';

interface RichContentProps {
  content: any;
  animation: Animated.Value;
}

export const RichContent = ({ content, animation }: RichContentProps) => {
  if (!content) return null;

  // Handle different types of rich content
  switch (content.type) {
    case 'table':
      return <Table richContent={content} richContentAnim={animation} />;
    // Add more cases for different types of rich content
    default:
      console.warn(`Unsupported rich content type: ${content.type}`);
      return null;
  }
}; 