import * as React from "react"
import Svg, { Path } from "react-native-svg"

const ClockBig = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={79}
    height={79}
    fill="none"
    {...props}
  >
    <Path
      stroke="#59C027"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M39.5 72.417c18.18 0 32.917-14.738 32.917-32.917 0-18.18-14.737-32.917-32.916-32.917C21.32 6.583 6.584 21.32 6.584 39.5s14.737 32.917 32.917 32.917Z"
    />
    <Path
      stroke="#59C027"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M39.5 19.75V39.5l13.167 6.583"
    />
  </Svg>
)
export default ClockBig
