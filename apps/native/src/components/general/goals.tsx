import { H3 } from "@zennui/native/typography";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type Goal = {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  endDate: string;
  priority: "high" | "medium" | "low";
};

const sampleGoals: Goal[] = [
  {
    id: "1",
    name: "Vacations",
    currentAmount: 200,
    targetAmount: 1000,
    endDate: "21st July, 2023",
    priority: "medium",
  },
];

export const Goals = () => {
  const CircularProgress = ({ progress }: { progress: number }) => {
    const size = 40;
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F0F0F0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FFE5A3"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    );
  };

  return (
    <>
      <H3 className={"mx-7"}>Goals</H3>
      <View style={styles.container}>
        {sampleGoals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;

          return (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.leftContent}>
                <CircularProgress progress={progress} />
                <View style={styles.goalInfo}>
                  <Text style={styles.goalName}>{goal.name}</Text>
                  <Text style={styles.amounts}>
                    {goal.currentAmount} / {goal.targetAmount} ALL
                  </Text>
                </View>
              </View>
              <View style={styles.rightContent}>
                <Text style={[styles.priority, styles[goal.priority]]}>
                  {goal.priority}
                </Text>
                <Text style={styles.remaining}>{remaining} ALL left</Text>
                <Text style={styles.completionDate}>
                  Goal will be completed on
                </Text>
                <Text style={styles.date}> {goal.endDate}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  goalCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightContent: {
    flex: 1,
    alignItems: "flex-end",
  },
  goalInfo: {
    marginLeft: 12,
  },
  goalName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  amounts: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  priority: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: "hidden",
    textTransform: "capitalize",
  },
  high: {
    backgroundColor: "#FFE5E5",
    color: "#FF7675",
  },
  medium: {
    backgroundColor: "#FFF5D6",
    color: "#FFB344",
  },
  low: {
    backgroundColor: "#E5F9F9",
    color: "#81ECEC",
  },
  remaining: {
    fontSize: 12,
    color: "#4CAF50",
    marginTop: 4,
  },
  completionDate: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
  },
  date: {
    color: "#FF7675",
  },
});
