import type { IconProps } from "@zenncore/types/components";

export const ClockIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={"currentColor"}
    fill={"none"}
    stroke={"currentColor"}
    strokeWidth={"1.5"}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8V12L14 14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
