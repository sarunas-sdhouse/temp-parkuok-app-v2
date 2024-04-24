import * as React from "react"
import Svg, { Path } from "react-native-svg"

const Phone = (props) => (
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
      fill="#28A745"
      fillOpacity={0.08}
      stroke="#42B705"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M32.5 28.73v2.258a1.501 1.501 0 0 1-1.026 1.433c-.199.067-.41.092-.619.073a14.944 14.944 0 0 1-6.508-2.31 14.693 14.693 0 0 1-4.526-4.517 14.878 14.878 0 0 1-2.315-6.526 1.504 1.504 0 0 1 1.501-1.64h2.263a1.51 1.51 0 0 1 1.508 1.294c.095.722.273 1.432.528 2.115a1.503 1.503 0 0 1-.34 1.588l-.957.956a12.055 12.055 0 0 0 4.525 4.516l.958-.956a1.51 1.51 0 0 1 1.591-.338 9.701 9.701 0 0 0 2.12.526 1.509 1.509 0 0 1 1.296 1.528Z"
    />
  </Svg>
)
export default Phone
