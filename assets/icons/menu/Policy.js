import * as React from "react"
import Svg, { Path } from "react-native-svg"

const Policy = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    fill="none"
    {...props}
  >
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.7}
      strokeWidth={1.2}
      d="M2.5 1.879h10a1.25 1.25 0 0 1 1.25 1.25v3.75a6.25 6.25 0 0 1-12.5 0v-3.75a1.25 1.25 0 0 1 1.25-1.25Z"
    />
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.7}
      strokeWidth={1.2}
      d="m5 6.254 2.5 2.5 2.5-2.5"
    />
  </Svg>
)
export default Policy
