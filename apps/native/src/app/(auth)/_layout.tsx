import { Stack } from "expo-router";

export default () => {
  // const {isAuthenticated} = useConvexAuth();
  // const router = useRouter();
  //
  //
  // if (isAuthenticated) {
  //     return router.replace("(app)")

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};
