import * as AvatarPrimitive from "@rn-primitives/avatar";
import { cn } from "@zenncore/utils";
import type { ComponentProps } from "react";

export type AvatarProps = ComponentProps<typeof AvatarPrimitive.Root>;

export const Avatar = ({ className, ...props }: AvatarProps) => (
  <AvatarPrimitive.Root
    className={cn("size-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
);

export type AvatarImageProps = ComponentProps<typeof AvatarPrimitive.Image>;

export const AvatarImage = ({ className, ...props }: AvatarImageProps) => (
  <AvatarPrimitive.Image
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
);

export type AvatarFallbackProps = ComponentProps<
  typeof AvatarPrimitive.Fallback
>;

export const AvatarFallback = ({
  className,
  ...props
}: AvatarFallbackProps) => (
  <AvatarPrimitive.Fallback
    className={cn(
      "size-full items-center justify-center rounded-full bg-background-dimmed",
      className,
    )}
    {...props}
  />
);
