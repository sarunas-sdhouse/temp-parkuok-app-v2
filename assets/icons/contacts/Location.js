import * as React from "react"
import Svg, { Path } from "react-native-svg"

const Location = (props) => (
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
      d="M34 23c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"
    />
    <Path
      stroke="#42B705"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M25 26a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
    />
  </Svg>
)
export default Location
