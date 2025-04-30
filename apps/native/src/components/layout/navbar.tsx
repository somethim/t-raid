import type { Route, Routes } from "@/lib/constants";
import { cn } from "@zenncore/utils";
import { View } from "@zennui/native/slot";
import { Text } from "@zennui/native/text";
import { usePathname } from "expo-router";
import { TabTrigger } from "expo-router/ui";
import { forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  useWindowDimensions,
  View as NativeView,
} from "react-native";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type NavbarProps = {
  routes: Routes;
};

export const Navbar = ({ routes }: NavbarProps) => {
  const { width } = useWindowDimensions();

  return (
    <View
      className={cn(
        "absolute android:bottom-0 bottom-3 left-0 z-50 w-full px-6 py-4 ",
        width > 400 ? "px-6" : "px-2",
      )}
    >
      <View className="w-full max-w-[400px] flex-row justify-between self-center rounded-full bg-background-dimmed p-3 shadow shadow-emphasis-dimmed/20 dark:shadow-emphasis-dimmed/5">
        {Object.values(routes).map((route) => (
          <NavbarItem {...route} key={route.name} />
        ))}
      </View>
    </View>
  );
};

type NavbarItemProps = Route;

const NavbarItem = forwardRef<NativeView, NavbarItemProps>(
  ({ href, Icon, name, subRoutes }, ref) => {
    const { t } = useTranslation();
    const pathname = usePathname();
    const [isActiveItem, setActiveItem] = useState<boolean>(
      pathname.startsWith(href as string),
    );
    const [isItemAnimating, setIsItemAnimating] = useState<boolean>(false);
    const itemRef = useAnimatedRef<NativeView>();
    const itemNameWidth = useSharedValue(0);
    const opacity = useDerivedValue(() => {
      const targetOpacity = Number(isActiveItem);

      return withTiming(targetOpacity, {
        duration: 100,
      });
    });

    const styles = useAnimatedStyle(() => {
      const width = withTiming(
        itemNameWidth.value * Number(isActiveItem),
        {
          duration: 200,
        },
        () => {
          runOnJS(setIsItemAnimating)(false);
        },
      );

      return {
        width: width,
        opacity: opacity.value,
      };
    });

    const buttonStyles = useAnimatedStyle(() => {
      return {
        paddingHorizontal: interpolate(opacity.value, [0, 1], [8, 16]),
      };
    });

    useEffect(() => {
      const subRoutePaths = subRoutes?.map(({ href }) => href) ?? [];
      const routes = [href, ...subRoutePaths];

      const isRootRoute = href === "/home";
      const isActiveItem = isRootRoute
        ? pathname === href
        : routes.some((route) => pathname.startsWith(route as string));

      setActiveItem(isActiveItem);
      setIsItemAnimating(true);
    }, [pathname, href, subRoutes]);

    return (
      <TabTrigger name={name} hitSlop={10} asChild>
        <AnimatedPressable
          key={name}
          ref={ref}
          className={cn(
            "h-auto flex-row items-center gap-0 overflow-hidden rounded-full border-0 py-2",
            isActiveItem && "gap-2 bg-primary",
          )}
          style={buttonStyles}
        >
          {Icon && (
            <Icon
              className={cn("text-primary", isActiveItem && "text-foreground")}
            />
          )}
          <Animated.View
            style={styles}
            className={cn("items-center justify-center")}
          >
            <Animated.View
              ref={itemRef}
              collapsable={false}
              className="absolute h-full items-center justify-center"
              onLayout={({ nativeEvent: { layout } }) => {
                if (isItemAnimating && itemNameWidth.value > 0) return;

                itemNameWidth.value = layout.width;
              }}
            >
              <Text className="w-full text-xl">{t(`routes.${name}`)}</Text>
            </Animated.View>
          </Animated.View>
        </AnimatedPressable>
      </TabTrigger>
    );
  },
);
