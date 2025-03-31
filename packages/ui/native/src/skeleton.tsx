import { cn } from "@zenncore/utils";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const duration = 1000;

export const Skeleton = ({
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof Animated.View>, "style">) => {
  const sv = useSharedValue(1);

  // biome-ignore lint/correctness/useExhaustiveDependencies: sv is only used as a setter
  useEffect(() => {
    sv.value = withRepeat(
      withSequence(withTiming(0.5, { duration }), withTiming(1, { duration })),
      -1,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: sv.value,
  }));

  return (
    <Animated.View
      style={style}
      className={cn("rounded-md bg-secondary dark:bg-muted", className)}
      {...props}
    />
  );
};
