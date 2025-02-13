'use client';

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContent, RichContentProps } from './rich_content.type';

const DEFAULT_COLORS = [
  '#ffd43b', // matching LineChart primary color
  '#74c0fc',
  '#63e6be',
  '#ff8787',
  '#da77f2',
];

export default function BarChart({ richContent }: RichContentProps) {
  if (!richContent?.data) return null;
  
  // Shuffle the colors array to get random colors
  const shuffledColors = [...DEFAULT_COLORS].sort(() => Math.random() - 0.5);
  
  // Transform the data to include colors
  const chartData = (richContent as ChartContent).data.map((item, index) => ({
    value: item.value,
    label: item.label,
    color: shuffledColors[index % shuffledColors.length],
    focused: item.focused,
  }));

  return (
    <div className="w-full bg-white">
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
            <XAxis
              dataKey="label"
              tick={{ fill: '#868e96', fontSize: 12 }}
              stroke="#e9ecef"
            />
            <YAxis
              tick={{ fill: '#868e96', fontSize: 12 }}
              stroke="#e9ecef"
            />
            <Bar
              dataKey="value"
              fill="#ffd43b"
              radius={[4, 4, 0, 0]}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
      {richContent.title && (
        <p className="text-sm font-semibold text-gray-600 mt-4 text-center">
          {richContent.title}
        </p>
      )}
    </div>
  );
} 