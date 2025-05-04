import { View } from "react-native";
import { UserIcon } from "@zennui/icons";
import { H3, H4 } from "@zennui/native/typography";
import { InteractivePieChart } from "@/components/general/pie";
import { Goals } from "@/components/general/goals";

const data = [
  { value: 100, color: "#03acfb", name: "Food" },
  { value: 150, color: "#ff00c3", name: "Clothes" },
  { value: 50, color: "#ff0000", name: "Entertainment" },
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
      <H3 className={"mx-7"}>Insights</H3>
      <View className={"my-6 px-6 aspect-square"}>
        <InteractivePieChart data={data} />
      </View>

      <Goals />
    </View>
  );
};
