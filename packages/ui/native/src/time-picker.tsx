import { useControllableState } from "@zenncore/hooks";
import type { PropsWithClassName } from "@zenncore/types/components";
import { cn } from "@zenncore/utils";
import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  useContext,
} from "react";
import { View } from "react-native";
import Animated, {
  Extrapolation,
  FadeIn,
  interpolate,
  LayoutAnimationConfig,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselItemAnimateProps,
  type CarouselItemProps,
} from "./carousel";
import { Drawer, DrawerContent, DrawerHandle, DrawerTrigger } from "./drawer";
import { Text } from "./text";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const getInputRange = (index: number) => {
  "worklet";
  return [index - 2, index - 1, index, index + 1, index + 2];
};

export type TimePickerValue = { hour: number; minute: number };

type TimePickerContextValue = {
  minutesDisabled: boolean;
  value: TimePickerValue;
  setValue: Dispatch<SetStateAction<TimePickerValue>>;
  hours: number[];
  minutes: number[];
};
const TimePickerContext = createContext<TimePickerContextValue | null>(null);

const useTimePickerContext = () => {
  const context = useContext(TimePickerContext);

  if (!context) {
    throw new Error("TimePicker context is not available");
  }

  return context;
};

export type TimePickerProps = PropsWithChildren<{
  minutesDisabled?: boolean;
  value?: TimePickerValue;
  defaultValue?: TimePickerValue;
  hours?: number[];
  minutes?: number[];
  startAt?: {
    hour: number;
    minute: number;
  };
  endAt?: {
    hour: number;
    minute: number;
  };
  onChange?: (value: TimePickerValue) => void;
}>;

type GetCarouselItemsParams = {
  hours: TimePickerProps["hours"];
  minutes: TimePickerProps["minutes"];
  startTime: TimePickerProps["startAt"];
  endTime: TimePickerProps["endAt"];
};

const getCarouselItems = ({
  hours = HOURS,
  minutes = MINUTES,
  startTime,
  endTime,
}: GetCarouselItemsParams) => {
  if (!startTime && !endTime) return { hours, minutes };

  const carouselHours = hours.filter(
    (hour) =>
      hour >= (startTime?.hour ?? HOURS[0]!) &&
      hour <= (endTime?.hour ?? HOURS[HOURS.length - 1]!),
  );
  const carouselMinutes = minutes.filter(
    (minute) =>
      minute >= (startTime?.minute ?? MINUTES[0]!) &&
      minute <= (endTime?.minute ?? MINUTES[MINUTES.length - 1]!),
  );

  return { hours: carouselHours, minutes: carouselMinutes };
};

export const TimePicker = ({
  children,
  minutesDisabled = false,
  onChange,
  value: valueProp,
  defaultValue,
  hours: hoursProp = HOURS,
  minutes: minutesProp = MINUTES,
  startAt,
  endAt,
}: TimePickerProps) => {
  const fallback = getDefaultValue(minutesDisabled);
  const { hours, minutes } = getCarouselItems({
    hours: hoursProp,
    minutes: minutesDisabled ? [0] : minutesProp,
    startTime: startAt,
    endTime: endAt,
  });
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? fallback,
    onChange,
  });

  return (
    <TimePickerContext.Provider
      value={{
        minutesDisabled,
        value,
        setValue,
        hours,
        minutes,
      }}
    >
      <Drawer snapAt={"32%"} overDragResistanceFactor={20} scaleRoot={false}>
        {children}
      </Drawer>
    </TimePickerContext.Provider>
  );
};

const getDefaultValue = (isMinuteSelectionDisabled = false) => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  return isMinuteSelectionDisabled ? { hour, minute: 0 } : { hour, minute };
};

type TimePickerContentProps = PropsWithClassName;

export const TimePickerContent = ({ className }: TimePickerContentProps) => {
  const { value, setValue, hours, minutes } = useTimePickerContext();

  return (
    <DrawerContent className={cn("border-none bg-transparent px-4", className)}>
      <DrawerHandle />
      <View
        className={cn(
          "h-[200px] flex-row items-center overflow-hidden rounded-3xl border border-accent-dimmed bg-accent",
          className,
        )}
      >
        <View
          className={
            "-mt-1.5 -translate-y-1/2 -z-50 absolute top-1/2 h-[52px] w-full items-center justify-center border-border border-y bg-primary/20"
          }
        >
          <Text className={"text-5xl"}>:</Text>
        </View>
        <Carousel
          direction={"vertical"}
          itemCount={hours.length}
          activeItem={Math.max(0, hours.indexOf(value.hour))}
          onActiveItemChange={(activeHourIndex) => {
            const updatedActiveHour = hours[activeHourIndex]!;

            setValue((previousValue = value) => ({
              ...previousValue,
              hour: updatedActiveHour,
            }));
          }}
        >
          <CarouselContent align="center">
            <LayoutAnimationConfig skipEntering>
              {hours.map((hour, index) => (
                <TimePickerItem value={hour} index={index} key={hour} />
              ))}
            </LayoutAnimationConfig>
          </CarouselContent>
        </Carousel>
        <Carousel
          activeItem={Math.max(0, minutes.indexOf(value.minute))}
          itemCount={minutes.length}
          defaultActiveItem={Math.max(0, minutes.indexOf(value.minute))}
          direction={"vertical"}
          onActiveItemChange={(activeMinuteIndex) => {
            const updatedActiveMinute = minutes[activeMinuteIndex]!;

            if (updatedActiveMinute === undefined) return;

            setValue((previousValue = value) => ({
              ...previousValue,
              minute: updatedActiveMinute,
            }));
          }}
        >
          <CarouselContent align="center">
            <LayoutAnimationConfig skipEntering>
              {minutes.map((minute, index) => (
                <TimePickerItem value={minute} index={index} key={minute} />
              ))}
            </LayoutAnimationConfig>
          </CarouselContent>
        </Carousel>
      </View>
    </DrawerContent>
  );
};

type TimePickerItemProps = {
  value: number;
} & CarouselItemProps;

const TimePickerItem = ({ index, value, className }: TimePickerItemProps) => {
  const scale = useSharedValue(1);
  const handleAnimation = (props: CarouselItemAnimateProps) => {
    "worklet";

    const { itemSize, scrollOffset, index, gap } = props;
    const input = scrollOffset / (itemSize + gap);
    const inputRange = getInputRange(index);

    scale.value = interpolate(
      input,
      inputRange,
      [0.3, 0.5, 1, 0.5, 0.3],
      Extrapolation.CLAMP,
    );

    return animate(props);
  };

  const styles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      entering={FadeIn}
      // exiting={FadeOut} // todo: fix item going behind time picker after reopening
    >
      <CarouselItem
        index={index}
        animate={handleAnimation}
        className={"w-32 items-center justify-center px-2"}
      >
        <Animated.View style={styles}>
          <Text
            className={cn("font-body text-foreground text-6xl", className)}
            // style={{}}
          >
            {String(value).padStart(2, "0")}
          </Text>
        </Animated.View>
      </CarouselItem>
    </Animated.View>
  );
};

export const TimePickerTrigger = DrawerTrigger;

const animate = ({
  scrollOffset,
  itemSize,
  index,
  gap,
}: CarouselItemAnimateProps) => {
  "worklet";

  const input = scrollOffset / (itemSize + gap);
  const inputRange = getInputRange(index);

  // const rotateX = interpolate(
  //   input,
  //   inputRange,
  //   [-200, -90, -60, -25, 0, 25, 60, 90, 200],
  //   Extrapolation.CLAMP,
  // );

  const opacity = interpolate(
    input,
    inputRange,
    [0.25, 0.6, 1, 0.6, 0.25],
    Extrapolation.CLAMP,
  );

  const translateY = interpolate(
    input,
    inputRange,
    [-itemSize * 0.4, -itemSize * 0.09, 0, itemSize * 0.09, itemSize * 0.4],
    Extrapolation.CLAMP,
  );

  return {
    transform: [{ translateY }],
    opacity,
  };
};
