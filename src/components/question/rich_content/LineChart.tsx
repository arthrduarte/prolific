import { View, useWindowDimensions } from "react-native";
import { LineChart as RNLineChart } from "react-native-chart-kit";
import { RichContentProps } from "./rich_content.type";

interface DataPoint extends Record<string, unknown> {
  x: string;
  y: number;
}

export function LineChart({ richContent }: RichContentProps) {
  const { width: windowWidth } = useWindowDimensions();
  
  if (!richContent?.data) return null;
  
  const data = richContent.data as DataPoint[];
  
  const chartData = {
    labels: data.map(point => point.x),
    datasets: [
      {
        data: data.map(point => point.y),
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // red color
        strokeWidth: 3,
      },
    ],
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <RNLineChart
        data={chartData}
        width={windowWidth - 16} // -16 for some padding
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
}