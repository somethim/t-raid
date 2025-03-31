import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";

/**
 * Hook that returns app state, and takes a callback that is called on active state changes
 *
 * @param callback If defined, it will be called with the "activating" parameter = true when entering active state,
 * false when leaving active state
 *
 * @returns one of 'active', 'background', 'inactive', or 'unknown'
 */
export const useAppState: (
  callback?: (activating: boolean) => void,
) => AppStateStatus = (callback) => {
  const appState = useRef(AppState.currentState);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (updatedAppState) => {
        // Foregrounding
        if (
          callback &&
          appState.current !== "active" &&
          updatedAppState === "active"
        ) {
          callback(true);
        }

        // Backgrounding
        if (
          callback &&
          appState.current === "active" &&
          updatedAppState !== "active"
        ) {
          callback(false);
        }
        appState.current = updatedAppState;
      },
    );

    return subscription.remove;
  }, [callback]);

  return appState.current;
};
