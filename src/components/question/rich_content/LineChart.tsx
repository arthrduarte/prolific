import { View, useWindowDimensions } from "react-native";
import { LineChart as GiftedLineChart } from "react-native-gifted-charts";
import { RichContentProps } from "./rich_content.type";

interface DataPoint extends Record<string, unknown> {
  x: string;
  y: number;
}

export function LineChart({ richContent }: RichContentProps) {
  const { width: windowWidth } = useWindowDimensions();
  
  if (!richContent?.data) return null;
  
  const data = richContent.data as DataPoint[];
  
  const chartData = data.map(point => ({
    label: point.x,
    value: point.y,
  }));

  return (
    <View style={{ 
      marginVertical: 10,
      marginHorizontal: 'auto',
      backgroundColor: '#fffff',
      borderRadius: 16,
      padding: 0,
    }}>
      <GiftedLineChart
        data={chartData}
        // width={windowWidth - 88} // accounting for padding
        // height={220}
        // spacing={40}
        initialSpacing={20}
        color="#FF0000"
        thickness={3}
        maxValue={Math.max(...data.map(point => point.y)) * 1.2}
        noOfSections={5}
        yAxisTextStyle={{ color: '#000' }}
        xAxisLabelTextStyle={{ color: '#000' }}
        hideDataPoints
        // curved
      />
    </View>
  );
}