import React, { useState } from "react";
import { Text, View } from "react-native";
import { PieChart } from "react-native-svg-charts";

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

  if (!data || data.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No data available</Text>
      </View>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const pieData = data.map((item, index) => {
    const isSelected = selectedIndex === index;

    return {
      value: item.value,
      svg: {
        fill: item.color,
        onPress: () => {
          console.log(`Direct slice press: ${item.name} (index: ${index})`);
          setSelectedIndex(selectedIndex === index ? null : index);
        },
      },
      key: `${item.name}-${index}`,
      arc: {
        outerRadius: isSelected ? "105%" : "100%",
        padAngle: isSelected ? 0.03 : 0.02,
        innerRadius: "50%",
      },
    };
  });

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={{ width: "100%", height: "100%", position: "relative" }}>
        <PieChart
          style={{ height: "100%", width: "100%" }}
          data={pieData}
          innerRadius="50%"
          animate={false}
          valueAccessor={({ item }) => item.value}
          outerRadius="100%"
          padAngle={0.02}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {selectedIndex !== null && data[selectedIndex]
              ? data[selectedIndex].value
              : total}
          </Text>
          <Text style={{ fontSize: 14, color: "#666" }}>
            {selectedIndex !== null && data[selectedIndex]
              ? data[selectedIndex].name
              : "ALL"}
          </Text>
        </View>
      </View>
    </View>
  );
};
