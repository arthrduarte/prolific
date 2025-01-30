import { useWindowDimensions, View, Text } from 'react-native';
import { LineChart as GiftedLineChart } from 'react-native-gifted-charts';
import { ChartContent, RichContentProps } from './rich_content.type';

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

export function LineChart({ richContent }: RichContentProps) {
  const { width: windowWidth } = useWindowDimensions();
  
  if (!richContent?.data) return null;
  
  const chartData = (richContent as ChartContent).data;
  
  return (
    <View>
      <GiftedLineChart
        data={chartData}
        areaChart
        width={windowWidth - 64}
        height={250}
        spacing={80}
        initialSpacing={20}
        endSpacing={20}
        color="#ffd43b"
        thickness={3}
        curved
        hideDataPoints={false}
        dataPointsColor="#ffd43b"
        dataPointsRadius={4}
        startFillColor="#ffd43b"
        endFillColor="#ffd43b20"
        startOpacity={0.9}
        endOpacity={0.2}
        backgroundColor="#fff"
        rulesColor="#e9ecef"
        rulesType="solid"
        yAxisColor="#e9ecef"
        xAxisColor="#e9ecef"
        xAxisLabelTextStyle={{ color: '#868e96', fontSize: 12 }}
        yAxisTextStyle={{ color: '#868e96', fontSize: 12 }}
      />
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