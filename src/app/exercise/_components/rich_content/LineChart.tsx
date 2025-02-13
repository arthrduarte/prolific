'use client';

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area } from 'recharts';
import { ChartContent, RichContentProps } from './rich_content.type';

export default function LineChart({ richContent }: RichContentProps) {
  if (!richContent?.data) return null;
  
  const chartData = (richContent as ChartContent).data;

  return (
    <div className="w-full bg-white">
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffd43b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ffd43b" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ffd43b"
              fillOpacity={1}
              fill="url(#colorValue)"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#ffd43b"
              strokeWidth={3}
              dot={{ r: 4, fill: "#ffd43b", stroke: "#ffd43b" }}
              activeDot={{ r: 6 }}
            />
          </RechartsLineChart>
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