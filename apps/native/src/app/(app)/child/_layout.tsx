import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { CHILD_ROUTES } from "@/lib/constants";
import { Navbar } from "@/components/layout/navbar";

export default () => {
  return (
    <Tabs>
      <TabList>
        {Object.values(CHILD_ROUTES).map((route) => (
          <TabTrigger href={route.href} name={route.name} key={route.name} />
        ))}
      </TabList>
      <TabSlot />
      <Navbar routes={CHILD_ROUTES} />
    </Tabs>
  );
};
