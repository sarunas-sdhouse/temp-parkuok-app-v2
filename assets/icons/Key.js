import * as React from "react"
import Svg, { Path } from "react-native-svg"

const Key = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#28A745"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m21 2-2 2m0 0 3 3-3.5 3.5-3-3M19 4l-3.5 3.5m-4.11 4.11a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777l.001-.001Zm0 0L15.5 7.5"
    />
  </Svg>
)
export default Key