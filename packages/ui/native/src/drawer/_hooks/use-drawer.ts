import type { Tuple } from "@zenncore/types/utilities";
import { useCallback, useEffect, useMemo } from "react";
import { Dimensions } from "react-native";
import { Gesture, type PanGesture } from "react-native-gesture-handler";
import {
  type AnimationCallback,
  Easing,
  ReduceMotion,
  type SharedValue,
  type WithTimingConfig,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export const drawerAnimationConfig = {
  duration: 300,
  easing: Easing.inOut(Easing.quad),
  reduceMotion: ReduceMotion.System,
};

const getSurroundingSnapOffsets = (
  offset: number,
  snapOffsets: number[],
): [number, number] => {
  "worklet";

  if (snapOffsets.length < 2) {
    throw new Error("There should be at least 2 snapPoint");
  }

  if (offset >= snapOffsets[0]!) {
    return [snapOffsets[0]!, snapOffsets[1]!];
  }

  const lastSnapOffset = snapOffsets[snapOffsets.length - 1]!;

  if (offset <= lastSnapOffset) {
    return [snapOffsets[snapOffsets.length - 2]!, lastSnapOffset];
  }

  for (let i = 0; i < snapOffsets.length - 1; i++) {
    if (offset < snapOffsets[i]! && offset > snapOffsets[i + 1]!) {
      return [snapOffsets[i]!, snapOffsets[i + 1]!];
    }
  }

  // This point should never be reached, but added as a safeguard
  // throw new Error("Unexpected input or logic error.");

  return [snapOffsets[0]!, snapOffsets[1]!];
};

const getTargetSnapOffset = (
  offset: number,
  snapOffsets: number[],
  velocity: number,
) => {
  "worklet";

  if (snapOffsets.length === 1) return snapOffsets[0]!;

  const surroundingSnapOffsets = getSurroundingSnapOffsets(offset, snapOffsets);

  const [lowerSnapPointOffset, higherSnapPointOffset] = surroundingSnapOffsets;

  if (offset >= lowerSnapPointOffset) return lowerSnapPointOffset;
  if (offset <= higherSnapPointOffset) return higherSnapPointOffset;

  const direction = velocity > 0 ? "down" : "up";

  const distanceFromLowerSnapPoint = Math.abs(offset - lowerSnapPointOffset);
  const distanceFromHigherSnapPoint = Math.abs(offset - higherSnapPointOffset);

  // const directionBias = 0.5; => (1 - directionBias)

  if (direction === "up") {
    // When moving up, favor the higher snap point
    return distanceFromHigherSnapPoint - Math.abs(velocity) <=
      distanceFromLowerSnapPoint
      ? higherSnapPointOffset
      : lowerSnapPointOffset;
  }

  // When moving down, favor the lower snap point
  return distanceFromLowerSnapPoint - Math.abs(velocity) <=
    distanceFromHigherSnapPoint
    ? lowerSnapPointOffset
    : higherSnapPointOffset;
};

const getSnapPointOffset = (snapPoint: SnapPoint, screenHeight: number) => {
  "worklet";

  if (typeof snapPoint === "number") {
    return Math.max(0, screenHeight - snapPoint);
  }

  const percentage = Number(snapPoint.replace("%", ""));

  return Math.max(0, screenHeight - (screenHeight * percentage) / 100);
};

const screenHeight = Dimensions.get("screen").height;

export type SnapPoint = number | `${number}%`;

export type UseDrawerParams<T extends Tuple<SnapPoint>> = {
  snapPoints: T;
  animationConfig?: WithTimingConfig;
  startAt?: T[number]; //defaultSnapPoint
  draggable?: boolean;
  overDragResistanceFactor?:
    | {
        top?: number;
        bottom?: number;
      }
    | number;
  overDragDisabled?:
    | {
        top?: boolean;
        bottom?: boolean;
      }
    | boolean;
  onDrag?: (offset: number) => void;
  onSnap?: (snapPoint: T[number], snapOffset: number) => void;
  onMove?: (offset: number) => void;
};
export type UseDrawerReturn<T extends Tuple<SnapPoint>> = {
  snapOffsets: number[];
  offset: SharedValue<number>;
  drawerGesture: PanGesture;
  snapTo: (
    snapPoint: T[number] | "close",
    callback?: AnimationCallback,
  ) => void;
  // activeSnapPoint: T[number];
};

export const useDrawer = <T extends Tuple<SnapPoint>>({
  snapPoints,
  animationConfig = drawerAnimationConfig,
  startAt = 0, // defaultSnapPoint
  draggable = true,
  overDragDisabled,
  overDragResistanceFactor,
  onDrag,
  onMove,
  onSnap,
}: UseDrawerParams<T>): UseDrawerReturn<T> => {
  // const { height: screenHeight } = useWindowDimensions();
  const context = useSharedValue(screenHeight);
  const offset = useSharedValue(screenHeight);

  if (snapPoints.length === 0) throw new Error("No snap point specified");

  const snapOffsets = useMemo(
    () =>
      snapPoints.map((snapPoint) =>
        getSnapPointOffset(snapPoint, screenHeight),
      ),
    [snapPoints],
  );

  const lowestSnapPointOffset = snapOffsets[0]!;
  const highestSnapPointOffset = snapOffsets[snapOffsets.length - 1]!;

  const animateDrawerTo = (
    targetOffset: number,
    onAnimationEnd?: AnimationCallback,
  ) => {
    "worklet";

    if (targetOffset >= screenHeight) {
      offset.value = withTiming(screenHeight, animationConfig, onAnimationEnd);
      return;
    }

    offset.value = withSpring(
      targetOffset,
      {
        mass: 0.5,
        damping: 12,
        stiffness: 100,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 2,
      },
      onAnimationEnd,
    );
  };

  const handleDrawerMoveEnd = (offset: number) => {
    const index = snapOffsets.findIndex(
      (snapOffset) => Math.abs(snapOffset - offset) < 0.1,
    );

    const snapPoint = snapPoints[index]! ?? highestSnapPointOffset;
    onSnap?.(snapPoint, offset);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const snapTo: UseDrawerReturn<T>["snapTo"] = useCallback(
    (targetSnapPoint, onAnimationComplete?: AnimationCallback) => {
      const targetOffset =
        targetSnapPoint === "close"
          ? screenHeight
          : getSnapPointOffset(targetSnapPoint, screenHeight);

      animateDrawerTo(targetOffset, () => {
        "worklet";

        runOnJS(handleDrawerMoveEnd)(targetOffset);
        if (onAnimationComplete) runOnJS(onAnimationComplete)();
      });
    },
    [offset, animationConfig, screenHeight],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const drawerGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(draggable)
        .onStart(() => {
          context.value = offset.value;
        })
        .onUpdate(({ translationY }) => {
          const currentOffset = translationY + context.value;
          const isOverDraggingTop = currentOffset < highestSnapPointOffset;
          const isOverDraggingBottom = currentOffset > lowestSnapPointOffset;
          const isOverDragging = isOverDraggingTop || isOverDraggingBottom;

          const isTopOverdragDisabled =
            typeof overDragDisabled === "object"
              ? overDragDisabled.top
              : overDragDisabled;
          const isBottomOverdragDisabled =
            typeof overDragDisabled === "object"
              ? overDragDisabled.bottom
              : overDragDisabled;

          if (
            (isOverDraggingTop && isTopOverdragDisabled) ||
            (isOverDraggingBottom && isBottomOverdragDisabled)
          ) {
            return;
          }

          if (overDragResistanceFactor && isOverDragging) {
            const boundarySnapPoint = isOverDraggingTop
              ? highestSnapPointOffset
              : lowestSnapPointOffset;
            const overdragAmount = currentOffset - boundarySnapPoint;

            const resistanceFactor =
              typeof overDragResistanceFactor === "object"
                ? isOverDraggingTop
                  ? (overDragResistanceFactor.top ?? 0)
                  : (overDragResistanceFactor.bottom ?? 0)
                : overDragResistanceFactor;

            const resistedOverdrag = overdragAmount / (resistanceFactor || 1); // Prevent division by 0
            offset.value = boundarySnapPoint + resistedOverdrag;
          } else {
            offset.value = currentOffset;
          }

          if (onDrag) runOnJS(onDrag)(offset.value);
        })
        .onEnd(({ velocityY }) => {
          const targetSnapOffset = getTargetSnapOffset(
            offset.value,
            snapOffsets,
            velocityY,
          );

          animateDrawerTo(targetSnapOffset, () => {
            "worklet";
            runOnJS(handleDrawerMoveEnd)(targetSnapOffset);
          });

          if (onDrag) runOnJS(onDrag)(offset.value);
        }),
    [snapPoints, overDragResistanceFactor, overDragDisabled, onDrag],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: this useEffect needs to run only on mount
  useEffect(() => {
    if (!startAt) return;
    const startSnapPointOffset = getSnapPointOffset(startAt, screenHeight);

    animateDrawerTo(startSnapPointOffset);
  }, []);

  useAnimatedReaction(
    () => offset.value,
    (drawerOffset, previousDrawerOffset) => {
      const isDrawerMoving =
        previousDrawerOffset !== null && drawerOffset !== previousDrawerOffset;

      // const direction = drawerOffset < previousValue ? "up" : "down";

      if (!isDrawerMoving) return;

      if (onMove) runOnJS(onMove)(drawerOffset);
    },
  );

  return {
    drawerGesture,
    snapTo,
    snapOffsets,
    offset,
    // activeSnapPoint: memoizedNormalizeSnapPoint()
  };
};
