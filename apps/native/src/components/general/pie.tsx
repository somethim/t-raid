import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-svg-charts";
import { G, Text as SVGText } from "react-native-svg";

interface DataItem {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: DataItem[];
}

export const InteractivePieChart: React.FC<PieChartProps> = ({ data }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Ensure we have data to display
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No data available</Text>
      </View>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const pieData = data.map((item, index) => ({
    value: item.value,
    svg: {
      fill: item.color,
      onPress: () => setSelectedIndex(selectedIndex === index ? null : index),
    },
    key: `${item.name}-${index}`,
    arc: {
      outerRadius: selectedIndex === index ? "105%" : "100%",
      padAngle: 0.02,
    },
  }));

  const Labels = ({ slices }) => {
    return slices.map((slice, index) => {
      const { labelCentroid, pieCentroid, data } = slice;
      return (
        <G key={index}>
          <SVGText
            fill="white"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={12}
            x={pieCentroid[0]}
            y={pieCentroid[1]}
          >
            {((data.value / total) * 100).toFixed(0)}%
          </SVGText>
        </G>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <PieChart
          style={{ height: "100%", width: "100%" }}
          data={pieData}
          innerRadius="50%"
          animate
          paddingAngle={2}
          valueAccessor={({ item }) => item.value}
        >
          <Labels />
        </PieChart>
        <View style={[StyleSheet.absoluteFill, { zIndex: 1 }]}>
          {data.map((_, index) => {
            const startAngle = (index / data.length) * 2 * Math.PI;
            const endAngle = ((index + 1) / data.length) * 2 * Math.PI;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  StyleSheet.absoluteFill,
                  {
                    position: "absolute",
                    transform: [
                      { rotate: `${(startAngle + endAngle) / 2}rad` },
                    ],
                  },
                ]}
                onPress={() =>
                  setSelectedIndex(selectedIndex === index ? null : index)
                }
              />
            );
          })}
        </View>
        <View style={styles.centerLabel}>
          <Text style={styles.totalValue}>
            {selectedIndex !== null ? data[selectedIndex].value : total}
          </Text>
          <Text style={styles.totalLabel}>Visitors</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chartContainer: {
    flex: 1,
    width: "100%",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabel: {
    position: "absolute",
    alignItems: "center",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
  },
});
