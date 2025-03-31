import type { IconProps } from "@zenncore/types/components";

export const DateTimeIcon = (props: IconProps) => (
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
    <path
      d="M16.5 2V5.5M7.5 2V5.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 12.5V11.5C21 7.72876 21 5.84315 19.8284 4.67157C18.6568 3.5 16.7712 3.5 13 3.5H11C7.22876 3.5 5.34315 3.5 4.17157 4.67157C3 5.84315 3 7.72876 3 11.5V13.5C3 17.2712 3 19.1569 4.17157 20.3284C5.34315 21.5 7.22876 21.5 11 21.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M3.5 9H20.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle
      cx="17"
      cy="18"
      r="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M18 19L17 18V16" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
