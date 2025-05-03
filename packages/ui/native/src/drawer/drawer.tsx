import { useControllableState } from "@zenncore/hooks";
import type { ClassList, UniqueIdentifier } from "@zenncore/types";
import type { Tuple } from "@zenncore/types/utilities";
import { cn } from "@zenncore/utils";
import { cssInterop } from "nativewind";
import {
  type ComponentProps,
  createContext,
  forwardRef,
  type PropsWithChildren,
  type Ref,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  Dimensions,
  FlatList,
  type GestureResponderEvent,
  type LayoutRectangle,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable as RNPressable,
  type PressableProps as RNPressableProps,
  ScrollView,
  View,
  type ViewProps,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  type PanGesture,
  Pressable,
  type PressableProps,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  type LayoutAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Portal } from "../portal";
import { Pressable as PressableSlot } from "../slot";
import type {
  ForceMountable,
  PressableRef,
  SlottablePressableProps,
} from "../types";
import {
  drawerAnimationConfig,
  type SnapPoint,
  useDrawer,
  type UseDrawerParams,
  type UseDrawerReturn,
} from "./_hooks/use-drawer";
import { useDrawerRootContext } from "./providers/drawer-root-provider";

// todo: add drawer classList,disabled

const INIT_SNAP_POINTS = ["0%", "80%"] satisfies Tuple<SnapPoint, 2>;

type DrawerContextValue = {
  openState: [boolean, (open: boolean) => void];
  nativeId: UniqueIdentifier;
  instance: UseDrawerReturn<typeof INIT_SNAP_POINTS>;
  draggable?: boolean;
  dismissible: boolean;
  onDrawerContentLayout: (contentLayout: LayoutRectangle) => void;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

const useDrawerContext = () => {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error("Drawer Compound Components should be used withing Drawer");
  }

  return context;
};

const screenHeight = Dimensions.get("screen").height; // workaround for useWindowDimensions height being incorrect in android

export type DrawerProps = PropsWithChildren<{
  open?: boolean;
  defaultOpen?: boolean;
  snapAt?: SnapPoint;
  scaleRoot?: boolean;
  dynamicSnapPoint?: boolean;
  draggable?: boolean;
  dismissible?: boolean;
  overDragDisabled?: boolean;
  overDragResistanceFactor?: number;
  onOpenChange?: (open: boolean) => void;
}> &
  Pick<UseDrawerParams<Tuple<SnapPoint>>, "onMove" | "onDrag">;

export type DrawerRef = {
  // open: () => void;
  // offset: SharedValue<number>;
  snapTo: UseDrawerReturn<Tuple<SnapPoint>>["snapTo"];
  open: () => void;
  collapse: () => void;
  close: () => void;
  // collapse: () => void;
};

export const Drawer = forwardRef<DrawerRef, DrawerProps>(
  (
    {
      open: openProp,
      defaultOpen = false,
      children,
      snapAt,
      scaleRoot = true,
      dynamicSnapPoint,
      draggable = true,
      dismissible = true,
      overDragDisabled,
      overDragResistanceFactor,
      onMove,
      onDrag,
      onOpenChange,
    },
    ref,
  ) => {
    const scale = useDrawerRootContext();
    const nativeId = useId();
    const [snapPoints, setSnapPoints] = useState<Tuple<SnapPoint, 2>>([
      INIT_SNAP_POINTS[0],
      snapAt ?? INIT_SNAP_POINTS[1],
    ]);

    const handleDrawerMove = (offset: number) => {
      onMove?.(offset);

      if (!scaleRoot) return;

      scale.value = interpolate(
        offset,
        instance.snapOffsets,
        [1, 0.9],
        Extrapolation.CLAMP,
      );
    };

    const instance = useDrawer({
      snapPoints,
      startAt: defaultOpen ? snapPoints[1] : snapPoints[0],
      draggable,
      overDragDisabled,
      overDragResistanceFactor,
      onDrag,
      onMove: handleDrawerMove,
      onSnap: (_, snapOffset) => {
        if (snapOffset >= screenHeight) setOpen(false);
      },
    });

    const handleOpenChange = (open: boolean) => {
      const closeSnapPoint = snapPoints[0];
      const openSnapPoint = snapPoints[1];

      const updatedSnapPoint = open ? openSnapPoint : closeSnapPoint;
      instance.snapTo(updatedSnapPoint);
      onOpenChange?.(open);
    };

    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange: (value) => handleOpenChange(value),
    });

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      collapse: () => instance.snapTo(snapPoints[0]),
      close: () => setOpen(false),
      snapTo: instance.snapTo,
    }));

    const handleDrawerContentLayout = (contentLayout: LayoutRectangle) => {
      if (!dynamicSnapPoint) return;

      const dynamicSnapPointValue = contentLayout.height;

      instance.snapTo(dynamicSnapPointValue);
      setSnapPoints((prevSnapPoints) => {
        return [prevSnapPoints[0], dynamicSnapPointValue];
      });
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      if (openProp) handleOpenChange(openProp);
    }, [openProp]);

    return (
      <DrawerContext.Provider
        value={{
          nativeId,
          openState: [open, setOpen],
          instance,
          draggable,
          dismissible,
          onDrawerContentLayout: handleDrawerContentLayout,
        }}
      >
        {children}
      </DrawerContext.Provider>
    );
  },
);

export type DrawerContentClassListKey = "content";

export type DrawerContentProps = {
  classList?: ClassList<DrawerContentClassListKey>;
  contentStyle?: ViewProps["style"];
} & ViewProps;

export const DrawerContent = ({
  children,
  className,
  classList,
  contentStyle,
  ...props
}: DrawerContentProps) => {
  const scale = useDrawerRootContext();
  const {
    instance,
    openState: [open],
    onDrawerContentLayout,
  } = useDrawerContext();
  // const { height: screenHeight } = useWindowDimensions();

  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: instance.offset.value }],
    };
  });

  const DrawerExitAnimation = (): LayoutAnimation => {
    "worklet";

    const initialValues = {
      transform: [{ translateY: instance.offset.value }],
    };
    const animations = {
      transform: [
        { translateY: withTiming(screenHeight, drawerAnimationConfig) },
      ],
    };

    const callback = (finished: boolean) => {};

    return {
      initialValues,
      animations,
      callback,
    };
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return () => {
      scale.value = withTiming(1, drawerAnimationConfig);
    };
  }, []);

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <GestureDetector
        gesture={instance.drawerGesture}
        enableContextMenu
        touchAction="pan-y"
      >
        <Animated.View
          {...props}
          exiting={DrawerExitAnimation}
          style={[{ height: screenHeight }, props.style, style]}
          className={cn(
            "absolute inset-x-0 bottom-0 z-50 w-full rounded-t-3xl bg-accent",
            className,
            classList?.root,
          )}
        >
          <View
            className={classList?.content}
            style={contentStyle}
            onLayout={(event) => {
              props?.onLayout?.(event);

              onDrawerContentLayout(event.nativeEvent.layout);
            }}
          >
            {children}
          </View>
        </Animated.View>
      </GestureDetector>
    </DrawerPortal>
  );
};

type DrawerHandleClassListKey = "root" | "handle";
export type DrawerHandleProps = {
  className?: string;
  classList?: ClassList<DrawerHandleClassListKey>;
};

export const DrawerHandle = ({ className, classList }: DrawerHandleProps) => {
  return (
    <View className={cn("py-6", className, classList?.root)}>
      <View
        className={cn(
          "mx-auto h-1.5 w-1/4 rounded-full bg-background-rich",
          classList?.handle,
        )}
      />
    </View>
  );
};

export type DrawerTriggerProps = {
  ref?: Ref<PressableRef>;
} & SlottablePressableProps;

export const DrawerTrigger = forwardRef<PressableRef, DrawerTriggerProps>(
  ({ children, asChild, onPress, ...props }: DrawerTriggerProps, ref) => {
    const {
      openState: [open, setOpen],
    } = useDrawerContext();

    const handleOpen = (event: GestureResponderEvent) => {
      setOpen(true);
      onPress?.(event);
    };

    const Component = asChild ? PressableSlot : RNPressable;

    return (
      <Component ref={ref} onPress={handleOpen} {...props}>
        {children}
      </Component>
    );
  },
);

type DialogPortalProps = PropsWithChildren<
  {
    hostName?: string;
  } & ForceMountable
>;

const DrawerPortal = ({
  forceMount,
  hostName,
  children,
}: DialogPortalProps) => {
  const context = useDrawerContext();

  const {
    openState: [open],
  } = context;

  if (!forceMount && !open) return null;

  return (
    <Portal hostName={hostName} name={`${context.nativeId}_portal`}>
      <DrawerContext.Provider value={context}>
        {children}
      </DrawerContext.Provider>
    </Portal>
  );
};

const AnimatedRNPressable = Animated.createAnimatedComponent(RNPressable);

type DrawerOverlayProps = RNPressableProps & ForceMountable;

// todo: overlay composable component, add props: dismissOnPress, visibleOnSnapPointIndex, hiddenOnSnapPointIndex

const DrawerOverlay = ({
  forceMount,
  className,
  children,
  ...props
}: DrawerOverlayProps) => {
  const {
    nativeId,
    instance,
    dismissible,
    openState: [_, setOpen],
  } = useDrawerContext();

  const style = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        instance.offset.value,
        instance.snapOffsets,
        [0, 1],
        Extrapolation.CLAMP,
      ),
    };
  }, [instance.offset, instance.snapOffsets]);

  const handleDismiss = () => {
    if (!dismissible) return;

    setOpen(false);
  };

  const DrawerOverlayExitAnimation = (): LayoutAnimation => {
    "worklet";

    const initialValues = {
      opacity: interpolate(
        instance.offset.value,
        instance.snapOffsets,
        [0, 1],
        Extrapolation.CLAMP,
      ),
    };
    const animations = {
      opacity: withTiming(0, drawerAnimationConfig),
    };

    return {
      initialValues,
      animations,
    };
  };

  return (
    <AnimatedRNPressable
      {...props}
      key={`${nativeId}_overlay`}
      style={[props.style, style]}
      exiting={DrawerOverlayExitAnimation}
      onPress={handleDismiss}
      className={cn("absolute inset-0 size-full bg-black/60", className)}
    />
  );
};

export type DrawerCloseProps = SlottablePressableProps;

export const DrawerClose = ({
  onPress,
  asChild,
  ...props
}: DrawerCloseProps) => {
  const {
    openState: [, setOpen],
  } = useDrawerContext();

  const handlePress = (event: GestureResponderEvent) => {
    setOpen(false);
    onPress?.(event);
  };

  const Component = asChild ? PressableSlot : RNPressable;

  return <Component {...props} onPress={handlePress} />;
};

type UseDrawerGestureParams = {
  gesture?: PanGesture;
};

const useDrawerGesture = ({ gesture }: UseDrawerGestureParams) => {
  let dragGesture = gesture ?? Gesture.Pan();
  if (!gesture) {
    const { instance } = useDrawerContext();
    dragGesture = instance.drawerGesture;
  }

  return dragGesture;
};

export type DrawerPressableProps = PressableProps;

cssInterop(Pressable, {
  className: "style",
});

// const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const DrawerPressable = ({ ...props }: DrawerPressableProps) => {
  return (
    // <NativeViewGestureHandler>
    //   <Pressable {...props} />
    // </NativeViewGestureHandler>
    <Pressable {...props} />
  );
};

type ScrollableComponent = typeof ScrollView | typeof FlatList;
type ScrollableHandlerProps<T extends ScrollableComponent> = {
  drawerGesture?: PanGesture;
  shouldDragDrawerOnOverScroll?: boolean;
} & ComponentProps<T>;

export type DrawerScrollableContainerProps<T extends ScrollableComponent> = {
  Component: T;
} & ScrollableHandlerProps<T>;

const DrawerScrollableContainer = <T extends ScrollableComponent>(
  {
    Component,
    shouldDragDrawerOnOverScroll = true,
    drawerGesture,
    ...props
  }: DrawerScrollableContainerProps<T>,
  ref: T,
) => {
  const scrollOffset = useSharedValue(0);
  const [isOverScrolling, setIsOverScrolling] = useState(false);

  const dragGesture = useDrawerGesture({ gesture: drawerGesture });

  const scrollGesture = Gesture.Native()
    .enabled(shouldDragDrawerOnOverScroll)
    .shouldCancelWhenOutside(true);
  const panGesture = Gesture.Pan()
    .enabled(shouldDragDrawerOnOverScroll)
    .onUpdate(({ velocityY }) => {
      const scrollDirection = velocityY > 0 ? "up" : "down";
      if (scrollDirection === "up" && scrollOffset.value <= 0) {
        runOnJS(setIsOverScrolling)(true);
      }

      if (scrollDirection === "down") runOnJS(setIsOverScrolling)(false);
    });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const gesture = useMemo(() => {
    if (!shouldDragDrawerOnOverScroll) {
      return scrollGesture.blocksExternalGesture(dragGesture);
    }

    if (!isOverScrolling) {
      scrollGesture.simultaneousWithExternalGesture(dragGesture);
      panGesture
        .blocksExternalGesture(dragGesture)
        .simultaneousWithExternalGesture(dragGesture);
    }

    return isOverScrolling
      ? scrollGesture.blocksExternalGesture(dragGesture) // Android // or Gesture.Native()
      : Gesture.Simultaneous(scrollGesture, panGesture);
  }, [shouldDragDrawerOnOverScroll, isOverScrolling]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollOffset.value = offsetY;

    props.onScroll?.(event);
    // const isScrolledToBottom =
    //   layoutMeasurement.height + contentOffset.y >= contentSize.height - 10; // Tolerance of 10 for precision
  };

  return (
    <GestureDetector gesture={gesture}>
      <Component
        ref={ref}
        {...props}
        {...(shouldDragDrawerOnOverScroll && {
          bounces: isOverScrolling ? false : props.bounces,
          overScrollMode: "never",
          scrollEventThrottle: 16,
          onScroll: handleScroll,
          onScrollEndDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            setIsOverScrolling(false);
            props.onScrollEndDrag?.(event);
          },
        })}
      />
    </GestureDetector>
  );
};

const ForwardReffedDrawerScrollableContainer = forwardRef(
  DrawerScrollableContainer,
);

export const DrawerScrollView = forwardRef<
  ScrollView,
  ScrollableHandlerProps<typeof ScrollView>
>((props, ref) => {
  return (
    <ForwardReffedDrawerScrollableContainer
      Component={ScrollView}
      ref={ref}
      {...props}
    />
  );
});

export const DrawerFlatList = forwardRef<
  FlatList,
  ScrollableHandlerProps<typeof FlatList>
>((props, ref) => {
  return (
    <ForwardReffedDrawerScrollableContainer
      Component={FlatList}
      ref={ref}
      {...props}
    />
  );
});
