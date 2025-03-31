import { cn } from "@zenncore/utils";
import type { ComponentProps, Ref } from "react";
import { TextInput } from "react-native";

export type TextareaProps = {
  ref: Ref<TextInput>;
  disabled?: boolean;
} & Omit<ComponentProps<typeof TextInput>, "editable">;

export const Textarea = ({
  className,
  multiline = true,
  numberOfLines = 4,
  placeholderClassName,
  disabled,
  ...props
}: TextareaProps) => {
  return (
    <TextInput
      className={cn(
        "min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-foreground leading-[1.25] placeholder:text-foreground-dimmed",
        disabled && "opacity-50",
        className,
      )}
      placeholderClassName={cn("text-foreground-dimmed", placeholderClassName)}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      editable={!disabled}
      {...props}
    />
  );
};
