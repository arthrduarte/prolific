export interface ChartDataPoint {
  value: number;
  label: string;
  focused?: boolean;
}

export interface ChartContent {
  type: 'line' | 'bar' | 'pie';
  data: ChartDataPoint[];
  title?: string;
}

export interface TableContent {
  type: 'table';
  head: string[];
  data: (string | number)[][];
  title?: string;
}

export type RichContent = ChartContent | TableContent;

export interface RichContentProps {
  richContent: RichContent;
} 