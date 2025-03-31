import type { IconProps } from "@zenncore/types/components";

export const PlusIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={"currentColor"}
    strokeWidth="1.5"
    stroke="currentColor"
    fill={"none"}
    {...props}
  >
    <path d="M12 4V20M20 12H4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
