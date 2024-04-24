import * as React from "react"
import Svg, { Path } from "react-native-svg"
const location = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={26}
    height={28}
    fill="none"
    {...props}
  >
    <Path
      stroke="#4DBB13"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.759 14.446a3.253 3.253 0 1 0 0-6.506 3.253 3.253 0 0 0 0 6.506Z"
    />
    <Path
      stroke="#42B705"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.518 10.759c0 7.59-9.759 14.096-9.759 14.096S1 18.35 1 10.76a9.759 9.759 0 0 1 19.518 0Z"
    />
    <Path
      fill="#CDECD6"
      d="M25.397 22.307a5.693 5.693 0 1 1-11.385 0 5.693 5.693 0 0 1 11.385 0Zm-3.241-2.73a.812.812 0 0 0-1.116.28l-1.903 3.17-.89-.889a.814.814 0 1 0-1.151 1.152l1.259 1.257a1.22 1.22 0 0 0 1.909-.234l2.171-3.62a.815.815 0 0 0-.28-1.117Z"
    />
  </Svg>
)
export default location