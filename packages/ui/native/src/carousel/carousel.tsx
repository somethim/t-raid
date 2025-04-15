import { useIsFocused } from "@react-navigation/native";
import type { ClassList, UniqueIdentifier } from "@zenncore/types";
import { cn } from "@zenncore/utils";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import {
  type NativeScrollPoint,
  Pressable,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  type AnimatedProps,
  type AnimatedStyle,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import {
  type Direction,
  type UseCarouselReturn,
  useCarousel,
} from "./_hooks/use-carousel";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export type CarouselContextValue = {
  nativeId: UniqueIdentifier;
  instance: UseCarouselReturn;
  itemCount?: number;
  direction: Direction;
  gap: number;
  loop?: boolean;
};
const CarouselContext = createContext<CarouselContextValue | null>(null);

const useCarouselContext = () => {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error(
      "Carousel Compound Components should be used withing Carousel",
    );
  }

  return context;
};

export type CarouselStyle = Partial<
  | { paddingHorizontal: number; paddingLeft: number; paddingRight: number }
  | {
      paddingTop: number;
      paddingBottom: number;
      paddingVertical: number;
    }
>;

export type CarouselProps = PropsWithChildren<
  {
    activeItem?: number;
    onActiveItemChange?: (activeItem: number) => void;
    defaultActiveItem?: number;
    gap?: number;
    direction?: Direction;
  } & (
    | {
        loop: true;
        itemCount: number;
      }
    | {
        loop?: false;
        itemCount?: number;
      }
  )
>;
export const Carousel = ({
  direction = "horizontal",
  itemCount,
  gap = 4,
  activeItem,
  defaultActiveItem = 0,
  onActiveItemChange,
  loop,
  children,
}: CarouselProps) => {
  const nativeId = useId();
  const instance = useCarousel({
    direction,
    gap,
    activeItem,
    defaultActiveItem,
    itemCount,
    onActiveItemChange,
  });

  return (
    <CarouselContext.Provider
      value={{
        instance,
        nativeId,
        itemCount,
        direction,
        gap,
        loop,
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
};
// const isCarouselItem = (child: React.ReactNode): boolean => {
//   if (!isValidElement(child)) return false;

//   // Direct match
//   if (child.type === CarouselItem) return true;

//   // Check if it's a component that renders CarouselItem
//   if (typeof child.type === "function") {
//     const renderedElement = child.type;
//     return isCarouselItem(renderedElement);
//   }

//   return false;
// };

type CarouselContentClassListKey = "content";

export type CarouselContentProps = ViewProps & {
  align?: "start" | "center";
  classList?: ClassList<CarouselContentClassListKey>;
  style?: CarouselStyle;
};
export const CarouselContent = ({
  align,
  children,
  style,
  className,
  classList,
  ...props
}: CarouselContentProps) => {
  const {
    instance,
    direction,
    itemCount,
    gap,
    loop: loopProp,
  } = useCarouselContext();
  const [loop, setLoop] = useState(loopProp);
  const isFocused = useIsFocused();

  const offset = useDerivedValue<NativeScrollPoint | undefined>(() => {
    return {
      x: direction === "horizontal" ? instance.scrollOffset.value : 0,
      y: direction === "vertical" ? instance.scrollOffset.value : 0,
    };
  });

  // const carouselItems = Children.toArray(children).filter(
  //   (child) => isValidElement(child) && child.type === CarouselItem,
  // );

  const paddingAxis = direction === "horizontal" ? "Horizontal" : "Vertical";
  const padding = (instance.size - instance.itemSize) / 2;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!loop || !isFocused) return;

    const interval = setInterval(() => {
      if (itemCount && instance.activeItem === itemCount - 1) {
        instance.scrollTo(0);
        return;
      }
      instance.scrollNext();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [loop, instance.activeItem, itemCount, isFocused]);

  return (
    <AnimatedScrollView
      {...props}
      horizontal={direction === "horizontal"}
      decelerationRate={"fast"}
      scrollEventThrottle={1}
      // snapToAlignment={align === "center" ? "center" : "start"}
      scrollToOverflowEnabled
      overScrollMode={"never"}
      snapToInterval={instance.itemSize + gap}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentOffset={offset}
      onLayout={instance.handleLayout}
      onScroll={instance.handleScroll}
      onTouchMove={(event) => {
        if (loop) setLoop(false);
        props.onTouchMove?.(event);
      }}
      className={classList?.root}
      contentContainerClassName={cn(
        "items-center",
        align === "center" && "justify-center",
        className,
        classList?.content,
      )}
      contentContainerStyle={[
        style,
        {
          ...(align === "center" && {
            [`padding${paddingAxis}`]: padding,
          }),
          gap,
        },
      ]}
    >
      {children}
    </AnimatedScrollView>
  );
};

type CarouselIndicatorClassListKey = "root" | "item";
type CarouselIndicatorProps = {
  growthFactor?: number;
  classList?: ClassList<CarouselIndicatorClassListKey>;
} & ViewProps;

export const CarouselIndicator = ({
  growthFactor,
  className,
  classList,
  ...props
}: CarouselIndicatorProps) => {
  const { itemCount } = useCarouselContext();

  if (!itemCount) throw new Error("Carousel item count is required");

  return (
    <View
      className={cn(
        "w-full flex-row items-center justify-center gap-2",
        className,
        classList?.root,
      )}
      {...props}
    >
      {Array.from({ length: itemCount ?? 0 }, (_, i) => i).map((index) => (
        <CarouselIndicatorItem
          key={index}
          index={index}
          growthIndex={growthFactor}
          className={classList?.item}
        />
      ))}
    </View>
  );
};

const clamp = (value: number, min: number, max: number) => {
  "worklet";
  return Math.min(Math.max(min, value), max);
};

type CarouselIndicatorItemProps = {
  index: number;
  growthIndex?: number;
  className?: string;
};
export const CarouselIndicatorItem = ({
  index,
  growthIndex = 3,
  className,
}: CarouselIndicatorItemProps) => {
  const { instance, itemCount } = useCarouselContext();
  const itemWidth = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    const scrollOffset = instance.scrollOffset.value;

    const input =
      scrollOffset === 0
        ? 0
        : clamp(scrollOffset / instance.itemSize, 0, itemCount! - 1);
    const inputRange = [
      index - 3,
      index - 2,
      index - 1,
      index,
      index + 1,
      index + 2,
      index + 3,
    ];

    const activeIndicatorIndex = Math.abs(Math.round(input));

    const isEdgeIndicatorActive =
      activeIndicatorIndex === 0 || activeIndicatorIndex >= itemCount! - 1;

    const smallIndicatorEdgeDistance = 2;

    const isSmallIndicator =
      isEdgeIndicatorActive &&
      (index === smallIndicatorEdgeDistance ||
        index === itemCount! - 1 - smallIndicatorEdgeDistance);

    const outputRange = [
      0,
      itemWidth.value * (isSmallIndicator ? 1 : 0.75),
      itemWidth.value,
      itemWidth.value * growthIndex,
      itemWidth.value,
      itemWidth.value * (isSmallIndicator ? 1 : 0.75),
      0,
    ];

    const width = interpolate(
      input,
      inputRange,
      outputRange,
      Extrapolation.CLAMP,
    );

    return {
      width,
      ...(Math.abs(activeIndicatorIndex - index) >= smallIndicatorEdgeDistance
        ? {
            // height: width,
            aspectRatio: 1 / 1, // square
          }
        : {
            // height: "auto",
            aspectRatio: "auto",
          }),
      opacity: interpolate(
        width,
        [
          0,
          itemWidth.value * 0.75,
          itemWidth.value,
          itemWidth.value * growthIndex,
        ],
        [0, 0.07, 0.15, 1],
        Extrapolation.CLAMP,
      ),
    };
  });

  return (
    <Pressable onPress={() => instance.scrollTo(2)}>
      <Animated.View
        key={index}
        className={cn("rounded-full bg-foreground", className)}
        style={animatedStyles}
      >
        <View
          className={cn("size-3", className, "opacity-0")}
          onLayout={({ nativeEvent }) => {
            if (itemWidth.value > 0) return;

            itemWidth.value = nativeEvent.layout.width;
          }}
        />
      </Animated.View>
    </Pressable>
  );
};

export type CarouselItemAnimateProps = {
  scrollOffset: number;
  index: number;
  itemSize: number;
  gap: number;
};

export type CarouselItemProps = {
  index: number;
  animate?: (
    animation: CarouselItemAnimateProps,
  ) => StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
} & AnimatedProps<ViewProps>;
export const CarouselItem = ({
  index,
  children,
  animate,
  style,
  ...props
}: CarouselItemProps) => {
  const { instance, gap } = useCarouselContext();

  const animated = useAnimatedStyle(() => {
    return (animate?.({
      scrollOffset: instance.scrollOffset.value,
      index,
      itemSize: instance.itemSize,
      gap,
    }) ?? {}) as ViewStyle;
  });

  return (
    <Animated.View
      key={index}
      style={[style, animated]}
      onLayout={index === 0 ? instance.handleItemLayout : undefined}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

// export const animateScale = (
//   scrollOffset: SharedValue<number>,
//   index: number,
//   itemWidth: number,
// ) => {
//   return useAnimatedStyle(() => {
//     const input = scrollOffset.value / itemWidth;
//     const inputRange = [index - 1, index, index + 1];
//     const scaleX = interpolate(
//       input,
//       inputRange,
//       [0.95, 1, 0.95],
//       Extrapolation.CLAMP,
//     );
//     const scaleY = interpolate(
//       input,
//       inputRange,
//       [0.95, 1, 0.95],
//       Extrapolation.CLAMP,
//     );
//     return {
//       transform: [{ scaleX }, { scaleY }],
//     } as DefaultStyle;
//   });
// };
