import { useConvexAuth } from "convex/react";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default () => {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return;
    if (router.canDismiss()) router.dismissAll();
    router.replace("/home");
  }, [isAuthenticated, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};
