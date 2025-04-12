import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import * as SecureStore from "expo-secure-store";
import type { PropsWithChildren } from "react";

const storage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL, {
  unsavedChangesWarning: false,
});

export const ConvexProvider = ({ children }: PropsWithChildren) => {
  return (
    <ConvexAuthProvider client={convex} storage={storage}>
      {children}
    </ConvexAuthProvider>
  );
};
