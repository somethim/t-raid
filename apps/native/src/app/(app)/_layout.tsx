import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { NAVBAR, ROUTES } from "@/lib/constants";
import { Navbar } from "@/components/layout/navbar";
import { usePathname } from "expo-router";

export default () => {
  const pathname = usePathname();
  const isNavbarVisible = !pathname.includes("/chatbot");

  return (
    <>
      <Tabs>
        <TabSlot />
        <Navbar routes={NAVBAR} isVisible={isNavbarVisible} />
        <TabList>
          {Object.values(ROUTES).map((route) => (
            <TabTrigger href={route.href} name={route.name} key={route.name} />
          ))}
        </TabList>
      </Tabs>
    </>
  );
};
