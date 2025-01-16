import * as React from "react";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { RichContentProps } from "./rich_content.type";

interface DataPoint extends Record<string, unknown> {
  x: string;
  y: number;
}

export function LineChart({ richContent, richContentAnim }: RichContentProps) {
  if (!richContent?.data) return null;

  return (
    <CartesianChart<DataPoint, "x", "y">
     data={richContent.data} xKey="x" yKeys={["y"]}>
      {({ points }) => (
        //👇 pass a PointsArray to the Line component, as well as options.
        <Line
          points={points.y}
          color="red"
          strokeWidth={3}
        //   animate={{ type: "timing", duration: 300 }}
        />
      )}
    </CartesianChart>

  );
}