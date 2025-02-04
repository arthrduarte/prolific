import { useWindowDimensions, View, Text } from 'react-native';
import { PieChart as GiftedPieChart } from 'react-native-gifted-charts';
import { ChartContent, RichContentProps } from './rich_content.type';
import React from 'react';

const DEFAULT_COLORS = [
  '#ffd43b', // matching LineChart primary color
  '#74c0fc',
  '#63e6be',
  '#ff8787',
  '#da77f2',
];

export function PieChart({ richContent }: RichContentProps) {
  const { width: windowWidth } = useWindowDimensions();
  
  if (!richContent?.data) return null;
  
  // Shuffle the colors array to get random colors
  const shuffledColors = [...DEFAULT_COLORS].sort(() => Math.random() - 0.5);
  
  // Transform the data to include colors and calculate percentages
  const total = richContent.data.reduce((sum, item) => sum + item.value, 0);
  const chartData = (richContent as ChartContent).data.map((item, index) => ({
    value: item.value,
    label: item.label,
    color: shuffledColors[index % shuffledColors.length],
    focused: item.focused,
    text: `${Math.round((item.value / total) * 100)}%`
  }));

  const renderLegend = () => {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 16 }}>
        {chartData.map((item, index) => (
          <View 
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 16,
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: item.color,
                marginRight: 8,
              }}
            />
            <Text style={{ color: '#868e96', fontSize: 12 }}>
              {`${item.label}: ${item.text}`}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: '#fff' }}>
      <View style={{ padding: 20, alignItems: 'center' }}>
        <GiftedPieChart
          data={chartData}
          donut
          radius={windowWidth / 4}
          innerRadius={windowWidth / 7}
          innerCircleColor="#fff"
          textSize={12}
          centerLabelComponent={() => {
            const mainValue = chartData.find(item => item.focused)?.text || chartData[0].text;
            const mainLabel = chartData.find(item => item.focused)?.label || chartData[0].label;
            return (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#495057' }}>
                  {mainValue}
                </Text>
                <Text style={{ fontSize: 14, color: '#868e96' }}>
                  {mainLabel}
                </Text>
              </View>
            );
          }}
        />
      </View>
      {renderLegend()}
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
