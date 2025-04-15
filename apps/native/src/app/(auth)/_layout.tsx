import { useConvexAuth } from "convex/react";
import { Stack } from "expo-router";

export default () => {
  const { isAuthenticated } = useConvexAuth();

  if (!isAuthenticated) {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};
