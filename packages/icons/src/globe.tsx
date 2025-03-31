import type { IconProps } from "@zenncore/types/components";

export const GlobeIcon = (props: IconProps) => (
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
    <circle cx="12" cy="12" r="10" />
    <path
      d="M8 12C8 18 12 22 12 22C12 22 16 18 16 12C16 6 12 2 12 2C12 2 8 6 8 12Z"
      strokeLinejoin="round"
    />
    <path d="M21 15H3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 9H3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
