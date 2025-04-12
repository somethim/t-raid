import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { Navbar } from "@/components/layout/navbar";
import { ROUTES } from "@/lib/constants";

export default function AppLayout() {
  return (
    <Tabs>
      <TabSlot />
      <Navbar routes={ROUTES} />
      <TabList className="hidden">
        {Object.values(ROUTES).map((route) => (
          <TabTrigger href={route.href} name={route.name} key={route.name} />
        ))}
      </TabList>
    </Tabs>
  );
}
