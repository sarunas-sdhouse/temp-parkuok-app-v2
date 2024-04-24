import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

const Avatar = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={60}
    height={60}
    fill="none"
    {...props}
  >
    <Circle cx={30} cy={30} r={29.5} fill="#fff" stroke="#00A758" />
    <Path
      stroke="#00A758"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M38 39v-2a4 4 0 0 0-4-4h-8a4 4 0 0 0-4 4v2M30 29a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
    />
  </Svg>
)
export default Avatar
