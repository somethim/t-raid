import { STEP_FORM_CONTINUE_BUTTON_OFFSET } from "@/lib/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigationMenuHeight } from "./use-bottom-nav-height";

type InsetsConfig = {
  applyHeaderTopOffset?: boolean;
  applyNavbarBottomOffset?: boolean;
  applyStepFormBottomOffset?: boolean;
  applyNavigationBarBottomOffset?: boolean;
};

const defaultInsetsConfig = {
  applyHeaderTopOffset: true,
  applyNavbarBottomOffset: true,
  applyStepFormBottomOffset: false,
  applyNavigationBarBottomOffset: false,
} satisfies InsetsConfig;

type UseInsetsParams = InsetsConfig;

export const useInsets = (config: UseInsetsParams = {}) => {
  const { top, bottom } = useSafeAreaInsets();
  const bottomNavBarHeight = useNavigationMenuHeight();

  const { applyHeaderTopOffset, applyNavbarBottomOffset } = {
    ...defaultInsetsConfig,
    ...config,
  };

  //className version: pt-[calc(env(safe-area-inset-top)+40)]
  const TOP_OFFSET = Math.max(top, 40) + (applyHeaderTopOffset ? 80 : 0);
  const BOTTOM_OFFSET = (() => {
    let bottomOffset = applyNavbarBottomOffset ? 24 * 4 : Math.max(bottom, 20);

    if (config.applyStepFormBottomOffset) {
      bottomOffset += STEP_FORM_CONTINUE_BUTTON_OFFSET;
    }

    if (config.applyNavigationBarBottomOffset) {
      bottomOffset += bottomNavBarHeight;
    }

    return bottomOffset;
  })();

  return {
    top: TOP_OFFSET,
    bottom: BOTTOM_OFFSET,
  };
};
