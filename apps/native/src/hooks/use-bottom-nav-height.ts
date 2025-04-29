import {
  Dimensions,
  Platform,
  StatusBar,
  useWindowDimensions,
} from "react-native";

export const useNavigationMenuHeight = () => {
  const { height: windowHeight } = useWindowDimensions();

  const SCREEN_HEIGHT = Dimensions.get("screen").height;
  const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;

  return Platform.OS === "android"
    ? SCREEN_HEIGHT - windowHeight - STATUS_BAR_HEIGHT
    : 0;
};
