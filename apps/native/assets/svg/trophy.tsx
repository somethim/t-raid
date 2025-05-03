import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export const TrophyIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <Path
      stroke="#525252"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M20 28.333c-2.79 0-5.217 2.109-6.47 5.219-.6 1.486.26 3.115 1.401 3.115h10.137c1.142 0 2-1.63 1.402-3.115-1.253-3.11-3.681-5.219-6.47-5.219Z"
    />
    <Path
      stroke="#525252"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M30.834 8.333h2.003c2.002 0 3.002 0 3.525.63.522.628.305 1.572-.13 3.46l-.65 2.832c-.98 4.26-4.564 7.426-8.915 8.078M9.166 8.333H7.163c-2.002 0-3.003 0-3.525.63-.522.628-.305 1.572.13 3.46l.65 2.832c.98 4.26 4.564 7.426 8.915 8.078"
    />
    <Path
      stroke="#525252"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M20 28.333c5.035 0 9.275-7.77 10.55-18.348.352-2.926.529-4.388-.405-5.52-.933-1.132-2.44-1.132-5.456-1.132h-9.378c-3.014 0-4.522 0-5.455 1.132-.934 1.132-.758 2.594-.405 5.52C10.725 20.563 14.966 28.333 20 28.333Z"
    />
  </Svg>
);
