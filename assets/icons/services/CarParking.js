import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

const CarParking = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      enableBackground: "new 0 0 50 50",
    }}
    viewBox="0 0 50 50"
    width={50}
    height={50}
    {...props}
  >
    <Circle
      cx={25}
      cy={25}
      r={25}
      style={{
        opacity: 0.99,
        fill: props.disabled ? "#EBEBEB" : "#28A745",
      }}
    />
    <Path
      d="M25 40c-8.27 0-15-6.73-15-15s6.73-15 15-15 15 6.73 15 15-6.73 15-15 15zm0-28c-7.17 0-13 5.83-13 13s5.83 13 13 13 13-5.83 13-13-5.83-13-13-13zm-3.5 21.5c-.55 0-1-.45-1-1v-13c0-1.1.9-2 2-2h4c2.76 0 5 2.24 5 5s-2.24 5-5 5h-4v5c0 .55-.45 1-1 1zm1-8h4c1.65 0 3-1.35 3-3s-1.35-3-3-3h-4v6z"
      style={{
        fill: props.disabled ? "#828282" : "#fff",
      }}
    />
  </Svg>
)
export default CarParking
