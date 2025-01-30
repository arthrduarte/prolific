// This represents how the column rich_content (jsonb) is structured
// const rich_content_example = {
//   data: [
//   { value: 100, label: 'Jan' },
//   { value: 150, label: 'Feb' },
//   { value: 200, label: 'Mar' },
//   { value: 250, label: 'Apr' },
//   { value: 300, label: 'May' },
// ],
//   type:"line"
// }

import { Animated } from "react-native";

export interface RichContentProps {
  richContent: any;
  richContentAnim: Animated.Value;
}

interface DataPoint {
  value: number;
  label: string;
  focused?: boolean;
}

export interface ChartContent {
  data: DataPoint[];
  title?: string;
  type: string;
}

export interface TableContent {
  data: string[][];
  head: string[];
  type: string;
}