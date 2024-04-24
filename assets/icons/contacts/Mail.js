import * as React from "react"
import Svg, { Path } from "react-native-svg"

const Mail = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
    {...props}
  >
    <Path
      fill="#28A745"
      fillOpacity={0.08}
      d="M50 25c0 13.807-11.193 25-25 25S0 38.807 0 25 11.193 0 25 0s25 11.193 25 25Z"
    />
    <Path
      stroke="#42B705"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.667 17.666h14.667c1.008 0 1.833.825 1.833 1.834v11a1.839 1.839 0 0 1-1.833 1.833H17.667a1.839 1.839 0 0 1-1.833-1.833v-11c0-1.009.825-1.834 1.833-1.834Z"
    />
    <Path
      stroke="#42B705"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m34.167 19.5-9.166 6.417-9.167-6.417"
    />
  </Svg>
)
export default Mail
