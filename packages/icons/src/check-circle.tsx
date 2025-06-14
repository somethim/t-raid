import type { IconProps } from "@zenncore/types/components";

export const CheckCircleIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={"currentColor"}
    fill={"none"}
    stroke="currentColor"
    strokeWidth="1.5"
    {...props}
  >
    <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" />
    <path
      d="M8 12.5L10.5 15L16 9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
