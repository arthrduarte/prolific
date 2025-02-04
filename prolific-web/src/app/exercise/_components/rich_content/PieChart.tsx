'use client';

import { PieChart as RechartsPieChart, Pie, ResponsiveContainer, Cell, Legend } from 'recharts';
import { ChartContent, RichContentProps } from './rich_content.type';

const DEFAULT_COLORS = [
  '#ffd43b', // matching LineChart primary color
  '#74c0fc',
  '#63e6be',
  '#ff8787',
  '#da77f2',
];

export default function PieChart({ richContent }: RichContentProps) {
  if (!richContent?.data || richContent.type !== 'pie') return null;
  
  // Now TypeScript knows this is ChartContent
  const chartContent = richContent as ChartContent;
  
  // Shuffle the colors array to get random colors
  const shuffledColors = [...DEFAULT_COLORS].sort(() => Math.random() - 0.5);
  
  // Transform the data to include colors and calculate percentages
  const total = chartContent.data.reduce((sum, item) => sum + item.value, 0);
  const chartData = chartContent.data.map((item, index) => ({
    value: item.value,
    name: item.label,
    color: shuffledColors[index % shuffledColors.length],
    focused: item.focused,
    percentage: Math.round((item.value / total) * 100)
  }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomLegend = () => (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {chartData.map((entry, index) => (
        <div key={index} className="flex items-center">
          <div 
            className="w-2.5 h-2.5 rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-600">
            {`${entry.name}: ${entry.percentage}%`}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-white">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              innerRadius={40}
              outerRadius={80}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      <CustomLegend />
      {richContent.title && (
        <p className="text-sm font-semibold text-gray-600 mt-4 text-center">
          {richContent.title}
        </p>
      )}
    </div>
  );
} 