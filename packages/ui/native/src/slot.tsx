import type { Props } from "@zenncore/types/components";
import {
  type ElementRef,
  Fragment,
  type PropsWithChildren,
  type Ref,
  cloneElement,
  forwardRef,
  isValidElement,
} from "react";
import {
  type Image as ImagePrimitive,
  type ImageStyle as ImagePrimitiveStyle,
  type ImageProps,
  type Pressable as PressablePrimitive,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  StyleSheet,
  type TextProps,
  type View as ViewPrimitive,
  type ViewProps,
} from "react-native";
import type { PressableRef, TextRef, ViewRef } from "./types";

export const Pressable = forwardRef<PressableRef, PressableProps>(
  ({ children, ...props }, ref) => {
    if (!isValidElement(children)) {
      console.log("Slot.Pressable - Invalid asChild element", children);
      return null;
    }

    return cloneElement<PressableProps, PressableRef>(
      isTextChildren(children) ? <Fragment /> : children,
      {
        ...mergeProps(props, children.props),
        ref: ref
          ? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            composeRefs(ref, (children as any).ref)
          : // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (children as any).ref,
      },
    );
  },
);

export const View = forwardRef<ViewRef, ViewProps>(
  ({ children, ...props }, ref) => {
    if (!isValidElement(children)) {
      console.log("Slot.View - Invalid asChild element", children);
      return null;
    }

    return cloneElement<ViewProps, ViewRef>(
      isTextChildren(children) ? <></> : children,
      {
        ...mergeProps(props, children.props),
        ref: ref
          ? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            composeRefs(ref, (children as any).ref)
          : // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (children as any).ref,
      },
    );
  },
);

export const Text = forwardRef<TextRef, TextProps>(
  ({ children, ...props }, ref) => {
    if (!isValidElement(children)) {
      console.log("Slot.Text - Invalid asChild element", children);
      return null;
    }

    return cloneElement<TextProps, TextRef>(
      isTextChildren(children) ? <></> : children,
      {
        ...mergeProps(props, children.props),
        ref: ref
          ? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            composeRefs(ref, (children as any).ref)
          : // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (children as any).ref,
      },
    );
  },
);

type ImageSlotProps = PropsWithChildren<ImageProps>;

export const Image = forwardRef<
  ElementRef<typeof ImagePrimitive>,
  ImageSlotProps
>(({ children, ...props }, ref) => {
  if (!isValidElement(children)) {
    console.log("Slot.Image - Invalid asChild element", children);
    return null;
  }

  return cloneElement<ImageSlotProps, ElementRef<typeof ImagePrimitive>>(
    isTextChildren(children) ? <></> : children,
    {
      ...mergeProps(props, children.props),
      ref: ref
        ? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          composeRefs(ref, (children as any).ref)
        : // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          (children as any).ref,
    },
  );
});

// This project uses code from WorkOS/Radix Primitives.
// The code is licensed under the MIT License.
// https://github.com/radix-ui/primitives/tree/main

export const composeRefs = <T,>(...refs: (Ref<T> | undefined)[]) => {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T>).current = node;
      }
    }
  };
};

const mergeProps = (slotProps: Props, childProps: Props) => {
  // all child props should override
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      // if the handler exists on both, we compose them
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          childPropValue(...args);
          slotPropValue(...args);
        };
      }
      // but if it exists only on the slot, we use only this one
      else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    }
    // if it's `style`, we merge them
    else if (propName === "style") {
      overrideProps[propName] = combineStyles(slotPropValue, childPropValue);
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue]
        .filter(Boolean)
        .join(" ");
    }
  }

  return { ...slotProps, ...overrideProps };
};

type PressableStyle = PressableProps["style"];
type ImageStyle = StyleProp<ImagePrimitiveStyle>;
type Style = PressableStyle | ImageStyle;

const combineStyles = (slotStyle?: Style, childValue?: Style) => {
  if (typeof slotStyle === "function" && typeof childValue === "function") {
    return (state: PressableStateCallbackType) => {
      return StyleSheet.flatten([slotStyle(state), childValue(state)]);
    };
  }
  if (typeof slotStyle === "function") {
    return (state: PressableStateCallbackType) => {
      return childValue
        ? StyleSheet.flatten([slotStyle(state), childValue])
        : slotStyle(state);
    };
  }
  if (typeof childValue === "function") {
    return (state: PressableStateCallbackType) => {
      return slotStyle
        ? StyleSheet.flatten([slotStyle, childValue(state)])
        : childValue(state);
    };
  }

  return StyleSheet.flatten([slotStyle, childValue].filter(Boolean));
};

export const isTextChildren = (
  children:
    | React.ReactNode
    | ((state: PressableStateCallbackType) => React.ReactNode),
) => {
  return Array.isArray(children)
    ? children.every((child) => typeof child === "string")
    : typeof children === "string";
};
