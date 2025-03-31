import { useGenericKeyboardHandler } from "react-native-keyboard-controller";
import { useSharedValue } from "react-native-reanimated";

export const useAnimatedKeyboard = () => {
  const height = useSharedValue(0);

  useGenericKeyboardHandler(
    {
      onMove: (event) => {
        "worklet";

        // eslint-disable-next-line react-compiler/react-compiler
        height.value = event.height;
      },
      onEnd: (event) => {
        "worklet";

        height.value = event.height;
      },
    },
    [],
  );

  return height;
};
