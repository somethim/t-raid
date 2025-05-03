import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export const RocketIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <Path
      stroke="#525252"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m14.752 8.112 1.857-1.857c2.09-2.091 4.828-2.958 7.725-3.1 1.127-.055 1.69-.083 2.142.37.452.45.424 1.014.369 2.141-.142 2.897-1.009 5.634-3.1 7.725l-1.857 1.857c-1.53 1.53-1.964 1.964-1.643 3.623.317 1.267.624 2.494-.298 3.416-1.117 1.117-2.137 1.117-3.255 0l-8.979-8.98c-1.117-1.117-1.117-2.137 0-3.254.922-.922 2.149-.615 3.416-.298 1.659.32 2.093-.114 3.623-1.643Z"
    />
    <Path
      stroke="#525252"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21.245 8.75h.011"
    />
    <Path
      stroke="#525252"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="m3.125 26.875 6.25-6.25M10.625 26.875l2.5-2.5M3.125 19.375l2.5-2.5"
    />
  </Svg>
);
