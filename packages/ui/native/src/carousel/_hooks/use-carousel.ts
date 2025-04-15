import { useControllableState } from "@zenncore/hooks";
import { useEffect, useState } from "react";
import { Dimensions, type LayoutChangeEvent } from "react-native";
import {
  type ScrollHandlerProcessed,
  type SharedValue,
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const clamp = (value: number, min: number, max: number) => {
  "worklet";
  return Math.min(Math.max(value, min), max);
};

export type Direction = "horizontal" | "vertical";
export type UseCarouselReturn = {
  activeItem: number;
  size: number;
  scrollPrevious: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  getCanScrollPrevious: () => boolean;
  getCanScrollNext: () => boolean;
  handleScroll: ScrollHandlerProcessed<Record<string, unknown>>;
  handleLayout: (event: LayoutChangeEvent) => void;
  handleItemLayout: (event: LayoutChangeEvent) => void;
  itemSize: number;
  scrollOffset: SharedValue<number>;
};

export type UseCarouselParams = {
  activeItem?: number;
  onActiveItemChange?: (active: number) => void;
  defaultActiveItem?: number;
  direction?: Direction;
  gap?: number;
  itemCount?: number;
};
export const useCarousel = ({
  activeItem: activeItemProp,
  onActiveItemChange,
  defaultActiveItem = 0,
  direction = "horizontal",
  gap = 0,
  itemCount = 0,
}: UseCarouselParams): UseCarouselReturn => {
  const initCarouselSize =
    Dimensions.get("screen")[direction === "horizontal" ? "width" : "height"];
  const scrollAxis = direction === "horizontal" ? "x" : "y";
  const [size, setSize] = useState(initCarouselSize);
  const [itemSize, setItemSize] = useState(0);
  const scrollOffset = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const [activeItem = 0, setActiveItem] = useControllableState({
    prop: activeItemProp,
    defaultProp: defaultActiveItem,
    onChange: onActiveItemChange,
  });

  const handleScroll = useAnimatedScrollHandler({
    onBeginDrag: () => {
      isDragging.value = true;
    },
    onScroll: ({ contentOffset }) => {
      if (!isDragging.value) return;
      scrollOffset.value = contentOffset[scrollAxis];
    },
    onMomentumEnd: ({ contentOffset }) => {
      isDragging.value = false;
      const currentScrollOffset = contentOffset[scrollAxis];
      const input = Math.round(currentScrollOffset / (itemSize + gap));

      const updatedActiveItem =
        itemCount > 0 ? clamp(input, 0, itemCount - 1) : Math.max(input, 0);

      runOnJS(setActiveItem)(updatedActiveItem);
    },
  });

  const scrollToIndex = (index: number) => {
    const scrollOffsetValue = itemSize * index + gap * index;

    scrollOffset.value = withTiming(scrollOffsetValue, { duration: 500 });
  };

  const getCanScrollPrevious = () => activeItem > 0;
  const getCanScrollNext = () => activeItem < itemCount;

  const scrollPrevious = () => {
    setActiveItem((previousActiveItem = 0) => {
      const updatedActiveItem =
        previousActiveItem > 0 ? previousActiveItem - 1 : previousActiveItem;

      scrollToIndex(updatedActiveItem);

      return updatedActiveItem;
    });
  };
  const scrollNext = () => {
    setActiveItem((previousActiveItem = 0) => {
      const updatedActiveItem = previousActiveItem + 1;

      scrollToIndex(updatedActiveItem);

      return updatedActiveItem;
    });
  };

  const scrollTo = (index: number) => {
    scrollToIndex(index);

    setActiveItem(index);
  };

  const handleLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    const carouselSize =
      layout[direction === "horizontal" ? "width" : "height"];
    setSize(carouselSize);
  };

  const handleItemLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    if (itemSize > 0) return; // todo: handle dynamic item size (isDragging)

    const updatedItemSize =
      layout[direction === "horizontal" ? "width" : "height"];

    const initialScrollOffset = updatedItemSize * activeItem + gap * activeItem;

    if (initialScrollOffset !== scrollOffset.value) {
      console.log("layout", initialScrollOffset);
      scrollOffset.value = updatedItemSize * activeItem + gap * activeItem;
    }
    setItemSize(updatedItemSize);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const currentScrollOffset =
      activeItemProp !== undefined && itemSize > 0
        ? itemSize * activeItemProp + gap * activeItemProp
        : undefined;

    if (
      activeItemProp === undefined ||
      currentScrollOffset === undefined ||
      currentScrollOffset === scrollOffset.value
    ) {
      return;
    }

    scrollOffset.value = withTiming(currentScrollOffset, { duration: 500 });
  }, [activeItemProp, gap, scrollAxis]);

  return {
    size,
    itemSize,
    activeItem,
    scrollOffset,
    getCanScrollPrevious,
    getCanScrollNext,
    scrollPrevious,
    scrollNext,
    scrollTo,
    handleScroll,
    handleLayout,
    handleItemLayout,
  };
};
