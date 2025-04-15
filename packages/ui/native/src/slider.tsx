import { useControllableState } from "@zenncore/hooks";
import { useControllableSharedValue } from "@zenncore/hooks/native";
import type { ClassList } from "@zenncore/types";
import { cn } from "@zenncore/utils";
import { useEffect } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

const clamp = (value: number, min: number, max: number) => {
  "worklet";
  return Math.min(Math.max(min, value), max);
};

const getValueSlideOffset = (
  value: number,
  min: number,
  max: number,
  trackWidth: number,
) => {
  "worklet";
  const thumbSlideProgress = (value - min) / (max - min);
  const thumbOffset = trackWidth * thumbSlideProgress;

  return thumbOffset;
};

const getStepSlideValue = (
  value: number,
  min: number,
  max: number,
  step: number,
) => {
  "worklet";
  // Calculate how many steps from min
  if (step <= 0) return value; // handle invalid step

  const rounded = Math.round(value / step) * step;
  return Math.min(Math.max(rounded, min), max);
};

type SliderClassListKey = "root" | "track" | "range" | "thumb";
export type SliderProps = {
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange?: (value: number[]) => void;
  onAnimatedChange?: (value: number[]) => void;
  className?: string;
  classList?: ClassList<SliderClassListKey>;
};

export const Slider = ({
  value: valueProp,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  onChange,
  onAnimatedChange,
  className,
  classList,
}: SliderProps) => {
  const initValue = valueProp
    ? [...valueProp]
        .sort((a, b) => a - b)
        .map((value) => clamp(value, min, max))
    : undefined;
  const initDefaultValue = defaultValue
    ? [...defaultValue]
        .sort((a, b) => a - b)
        .map((value) => clamp(value, min, max))
    : [min];

  const [value, setValue] = useControllableState({
    prop: initValue,
    defaultProp: initDefaultValue,
    onChange,
  });

  const testValue = useControllableSharedValue({
    value: value,
    // defaultValue: [0, 1],
    onChange: () => {
      console.log("change");
    },
  });

  useAnimatedReaction(
    () => testValue.value,
    (value) => {
      console.log("value", value);
    },
  );

  const animatedValue = useSharedValue([...value]);
  const thumbsValue = useSharedValue([...value]);
  const trackWidth = useSharedValue(0);

  const createSliderGesture = (index: number) => {
    const pan = Gesture.Pan()
      // .minPointers(1)
      // .maxPointers(1)
      .onChange(({ changeX, translationX }) => {
        const minSlideOffset = 0;
        const maxSlideOffset = trackWidth.value;
        const clamppedStep = clamp(step, 0.01, max);

        const thumbOffset = getValueSlideOffset(
          thumbsValue.value[index]!,
          min,
          max,
          trackWidth.value,
        );

        const updatedSlideOffset = clamp(
          thumbOffset + changeX,
          minSlideOffset,
          maxSlideOffset,
        );
        const updatedThumbOffset = updatedSlideOffset / maxSlideOffset;

        const rawThumbValue = min + (max - min) * updatedThumbOffset;

        const updatedValue = getStepSlideValue(rawThumbValue, min, max, step);

        const updatedThumbValue = Math.round(
          min + (max - min) * updatedThumbOffset,
        );

        const updatedThumbsValue = [...thumbsValue.value];
        const prevThumb = updatedThumbsValue[index - 1];
        const nextThumb = updatedThumbsValue[index + 1];

        // const minThumbDistance = Math.max(step, (max - min) * 0.04);
        const minThumbDistance = (max - min) * 0.04;

        if (
          (prevThumb !== undefined &&
            updatedThumbValue <= prevThumb + minThumbDistance) ||
          (nextThumb !== undefined &&
            updatedThumbValue >= nextThumb - minThumbDistance)
        ) {
          return;
        }

        const updatedAnimatedValue = [...animatedValue.value];
        updatedAnimatedValue[index] = updatedValue;
        animatedValue.value = updatedAnimatedValue;

        updatedThumbsValue[index] = updatedThumbValue;
        thumbsValue.value = [...updatedThumbsValue];

        onAnimatedChange?.(animatedValue.value);
      })
      .onEnd(() => {
        runOnJS(setValue)(animatedValue.value);
      });

    return pan;
  };

  const rangeStyles = useAnimatedStyle(() => {
    const firstThumbValue = thumbsValue.value[0];

    const startOffset =
      thumbsValue.value.length > 1
        ? getValueSlideOffset(firstThumbValue!, min, max, trackWidth.value)
        : 0;

    const lastThumbValue = thumbsValue.value[thumbsValue.value.length - 1] ?? 0;
    const lastThumbOffset = getValueSlideOffset(
      lastThumbValue,
      min,
      max,
      trackWidth.value,
    );

    const rangeOffset = lastThumbOffset - startOffset;

    return {
      width: rangeOffset > trackWidth.value ? trackWidth.value : rangeOffset,
      transform: [{ translateX: startOffset }],
    };
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect doesn't trigger on shared values
  useEffect(() => {
    animatedValue.value = withTiming(value, { duration: 200 });
    thumbsValue.value = withTiming(value, { duration: 200 });
  }, [value]);

  return (
    <View
      className={cn(
        "flex-row items-center",
        className,
        classList?.root,
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <View
        onLayout={({ nativeEvent: { layout } }) => {
          trackWidth.value = layout.width;
        }}
        className={cn(
          "h-4 w-full overflow-hidden rounded-full bg-accent-rich",
          classList?.track,
        )}
      >
        <Animated.View
          className={cn("h-full w-3/5 bg-primary", classList?.range)}
          style={rangeStyles}
        />
      </View>

      {value.map((_, index) => {
        const pan = createSliderGesture(index);

        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <GestureDetector key={index} gesture={pan}>
            <SliderThumb
              index={index}
              value={thumbsValue}
              max={max}
              min={min}
              trackWidth={trackWidth}
              className={classList?.thumb}
            />
          </GestureDetector>
        );
      })}
    </View>
  );
};

type SliderThumbProps = {
  index: number;
  max: number;
  min: number;
  value: SharedValue<number[]>;
  trackWidth: SharedValue<number>;
  className?: string;
};

const SliderThumb = ({
  index,
  value,
  max,
  min,
  trackWidth,
  className,
}: SliderThumbProps) => {
  const thumbWidth = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    const thumbValue = value.value[index]!;
    const thumbSlideProgress = (thumbValue - min) / (max - min);
    const thumbOffset = trackWidth.value * thumbSlideProgress;
    const thumbRangeDistance =
      thumbWidth.value * clamp(thumbSlideProgress, 0.1, 0.9);

    return {
      transform: [
        {
          translateX: thumbOffset - thumbRangeDistance,
        },
      ],
    };
  });

  return (
    <Animated.View
      onLayout={({ nativeEvent: { layout } }) => {
        thumbWidth.value = layout.width;
      }}
      className={cn(
        "absolute size-6 rounded-full bg-background p-2 shadow-sm dark:bg-foreground",
        className,
      )}
      style={[style]}
    />
  );
};
