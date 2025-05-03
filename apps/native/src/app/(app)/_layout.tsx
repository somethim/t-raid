import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { NAVBAR, ROUTES } from "@/lib/constants";
import { Navbar } from "@/components/layout/navbar";

export default () => {
  return (
    <>
      <Tabs>
        <TabSlot />
        <Navbar routes={NAVBAR} />
        <TabList>
          {Object.values(ROUTES).map((route) => (
            <TabTrigger href={route.href} name={route.name} key={route.name} />
          ))}
        </TabList>
      </Tabs>
    </>
  );
};
