import * as React from "react"
import Svg, { Path } from "react-native-svg"
const Check = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m1 9 6.667 8L21 1"
    />
  </Svg>
)
export default Check