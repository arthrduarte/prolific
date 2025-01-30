import { useWindowDimensions, View, Text } from 'react-native';
import { BarChart as GiftedBarChart } from 'react-native-gifted-charts';
import { ChartContent, RichContentProps } from './rich_content.type';
import React from 'react';

const DEFAULT_COLORS = [
  '#ffd43b', // matching LineChart primary color
  '#74c0fc',
  '#63e6be',
  '#ff8787',
  '#da77f2',
];

export function BarChart({ richContent }: RichContentProps) {
  const { width: windowWidth } = useWindowDimensions();
  
  if (!richContent?.data) return null;
  
  // Shuffle the colors array to get random colors
  const shuffledColors = [...DEFAULT_COLORS].sort(() => Math.random() - 0.5);
  
  // Transform the data to include colors
  const chartData = (richContent as ChartContent).data.map((item, index) => ({
    value: item.value,
    label: item.label,
    frontColor: shuffledColors[index % shuffledColors.length],
    focused: item.focused,
  }));

  return (
    <View style={{ backgroundColor: '#fff' }}>
      <View>
        <GiftedBarChart
          data={chartData}
          width={windowWidth - 64}
          height={250}
          spacing={40}
          initialSpacing={20}
          endSpacing={20}
          noOfSections={3}
          barWidth={32}
          xAxisThickness={1}
          yAxisThickness={1}
          yAxisColor={'#e9ecef'}
          xAxisColor={'#e9ecef'}
          yAxisTextStyle={{ color: '#868e96', fontSize: 12 }}
          xAxisLabelTextStyle={{ color: '#868e96', fontSize: 12 }}
          barBorderRadius={4}
        />
      </View>
      {richContent.title && (
        <Text style={{ 
          fontSize: 14, 
          fontWeight: '600', 
          color: '#495057',
          marginTop: 16,
          textAlign: 'center' 
        }}>
          {richContent.title}
        </Text>
      )}
    </View>
  );
}
