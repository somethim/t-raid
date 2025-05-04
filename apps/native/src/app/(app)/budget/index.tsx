import { View } from "react-native";
import { UserIcon } from "@zennui/icons";
import { H4 } from "@zennui/native/typography";
import { InteractivePieChart } from "@/components/general/pie";
import { Goals } from "@/components/general/goals";

const data = [
  { value: 100, color: "#fbd203", name: "Food" },
  { value: 150, color: "#ffb300", name: "Clothes" },
  { value: 50, color: "#ff9100", name: "Entertainment" },
  { value: 60, color: "#ff6c00", name: "Other" },
];

export default () => {
  return (
    <View style={{ flex: 1, paddingTop: 36, marginTop: 24 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginHorizontal: 24,
          marginBottom: 24,
        }}
      >
        <UserIcon />
        <H4>Hi, Emily!</H4>
      </View>
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 24,
          margin: 24,
          padding: 24,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <H4>Insights</H4>
        <View style={{ aspectRatio: 1 }}>
          <InteractivePieChart data={data} />
        </View>
      </View>

      <Goals />
    </View>
  );
};
