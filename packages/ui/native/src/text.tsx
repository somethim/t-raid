import { cn } from "@zenncore/utils";
import { type ElementRef, createContext, forwardRef, useContext } from "react";
import { Text as TextPrimitive } from "react-native";
import { Text as TextSlot } from "./slot";
import type { SlottableTextProps } from "./types";

export const TextClassContext = createContext<string | undefined>(undefined);

export type TextProps = SlottableTextProps;

export const Text = forwardRef<ElementRef<typeof TextSlot>, TextProps>(
  (
    { suppressHighlighting = true, className, asChild = false, ...props },
    ref,
  ) => {
    const textClass = useContext(TextClassContext);
    const Component = asChild ? TextSlot : TextPrimitive;

    return (
      <Component
        // allowFontScaling={false}
        maxFontSizeMultiplier={1.2}
        suppressHighlighting={suppressHighlighting}
        className={cn(
          "font-body text-base text-foreground",
          textClass,
          className,
        )}
        // style={{
        //   lineHeight: Platform.OS === "ios" ? 0 : undefined,
        //   ...(typeof props.style === "object" ? props.style : {}),
        // }}
        {...props}
      />
    );
  },
);
