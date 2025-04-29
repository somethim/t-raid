import { useColorScheme } from "@zenncore/hooks/native";
import type { Tuple } from "@zenncore/types/utilities";
import {
  LinearGradient as LinearGradientPrimitive,
  type LinearGradientProps as LinearGradientPrimitiveProps,
} from "expo-linear-gradient";

type LinearGradientProps = {
  colors?: Tuple<string, 2>;
  variant?: "primary" | "default" | "accent";
  inverted?: boolean;
} & Omit<LinearGradientPrimitiveProps, "colors">;

const getGradientStops = (
  {
    colorScheme,
    variant,
    inverted,
  }: Partial<{
    colorScheme: "dark" | "light" | "system";
    variant: LinearGradientProps["variant"];
    inverted?: boolean;
  }> = {
    colorScheme: "system",
    variant: "default",
  },
): Tuple<string, 2> => {
  if (variant === "primary") {
    return inverted
      ? ["hsla(128,52%,47%,0)", "hsla(128,52%,47%,1)"]
      : ["hsla(128,52%,47%,1)", "hsla(128,52%,47%,0)"];
  }

  if (variant === "accent") {
    switch (colorScheme) {
      case "dark":
        return inverted
          ? ["hsla(0,0%,9%,0)", "hsla(0,0%,9%,1)"]
          : ["hsla(0,0%,9%,1)", "hsla(0,0%,9%,0)"];
      default: // light
        return inverted
          ? ["hsla(0,0%,95%,0)", "hsla(0,0%,95%,1)"]
          : ["hsla(0,0%,95%,1)", "hsla(0,0%,95%,0)"];
    }
  }

  switch (colorScheme) {
    case "dark":
      return inverted
        ? ["hsla(0,0%,10%,0)", "hsla(0,0%,10%,1)"]
        : ["hsla(0,0%,10%,1)", "hsla(0,0%,10%,0)"];
    default: // light
      return inverted
        ? ["hsla(0,0%,98%,0)", "hsla(0,0%,98%,1)"]
        : ["hsla(0,0%,98%,1)", "hsla(0,0%,98%,0)"];
  }
};

export const LinearGradient = ({
  colors: colorProp,
  variant,
  inverted,
  ...props
}: LinearGradientProps) => {
  const { colorScheme } = useColorScheme();

  const colors =
    colorProp ?? getGradientStops({ colorScheme, variant, inverted });

  return <LinearGradientPrimitive {...props} colors={colors} />;
};
