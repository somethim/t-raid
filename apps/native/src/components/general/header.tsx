import type { ClassList } from "@zenncore/types";
import type { Tuple } from "@zenncore/types/utilities";
import { cn } from "@zenncore/utils";
import { ChevronLeftIcon } from "@zennui/icons";
import { Text } from "@zennui/native/text";
import { useRouter } from "expo-router";
import { forwardRef } from "react";
import {
  type GestureResponderEvent,
  Pressable,
  View,
  type ViewProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "./linear-gradient";

type HeaderClassListKey = "root" | { button: "icon" } | "title";

export type HeaderProps = {
  title?: string;
  backButtonHidden?: boolean;
  locations?: Tuple<number, 2>;
  top?: number;
  variant?: "primary" | "default";
  gradient?: {
    start: string;
    end: string;
  };
  onBackButtonPres?: (event: GestureResponderEvent) => void;
  className?: string;
  classList?: ClassList<HeaderClassListKey>;
} & ViewProps;

export const Header = forwardRef<View, HeaderProps>(
  (
    {
      children,
      title,
      backButtonHidden,
      top: topProp,
      gradient,
      locations = [0.2, 1],
      variant,
      onBackButtonPres,
      className,
      classList,
      style,
      ...props
    },
    ref,
  ) => {
    const router = useRouter();
    const { top } = useSafeAreaInsets();

    const headerTopOffset = topProp ?? top;

    return (
      <View
        ref={ref}
        className={"absolute z-10 w-full"}
        style={{
          height: headerTopOffset + 64,
        }}
      >
        <LinearGradient
          locations={locations}
          variant={variant}
          colors={gradient ? [gradient.start, gradient.end] : undefined}
          inverted={false}
          className="absolute top-0 size-full"
        />

        <View
          className={cn(
            "h-12 flex-row items-center gap-2 px-4",
            className,
            classList?.root,
          )}
          style={[{ top: headerTopOffset }, style]}
          {...props}
        >
          {!backButtonHidden && (
            <Pressable
              hitSlop={{
                left: 20,
                right: 20,
                top: 10,
                bottom: 10,
              }}
              onPress={onBackButtonPres ?? router.back}
              className={cn("rounded-full", classList?.button?.root)}
            >
              <ChevronLeftIcon
                className={cn(
                  "size-8 text-foreground-dimmed",
                  variant === "primary" && "text-white",
                  classList?.button?.icon,
                )}
              />
            </Pressable>
          )}
          {children ?? (
            <Text
              className={cn(
                "text-center font-header-bold text-4xl text-primary",
                variant === "primary" && "text-white",
                classList?.title,
              )}
            >
              {title}
            </Text>
          )}
        </View>
      </View>
    );
  },
);
