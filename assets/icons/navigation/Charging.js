import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

const Charging = ({focused}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
  >
    <Circle
      cx={20}
      cy={20}
      r={20}
      fill={`${focused ? '#28a745' : '#EEF8F0'}`}
      // style={{
      //   fill: "#28a745",
      // }}
    />
    <Path
      stroke={`${focused ? 'white' : '#33363F'}`}
      d="m25.3 19 .8-.5c.4.6.3 1.2.1 1.7-.1.5-.4 1-.7 1.6v.1l-3.2 6.6c-.2.3-.3.7-.5.9-.1.1-.2.3-.4.4-.2.2-.6.4-1 .3-.5-.1-.7-.4-.8-.7-.1-.2-.1-.4-.1-.6v-5.5H18.1c-.7 0-1.3 0-1.7-.1-.5-.1-1.1-.3-1.5-.9M25.3 19l.8-.5c-.4-.6-1-.8-1.5-.9-.5-.1-1.1-.1-1.7-.1H21.5V12c0-.1 0-.4-.1-.6-.1-.2-.3-.6-.8-.7-.5-.1-.8.1-1 .3-.2.1-.3.3-.4.4-.1.2-.3.6-.5.9l-3.2 6.6v.1c-.3.6-.5 1.1-.7 1.6-.2.5-.2 1.1.1 1.7m5.2 6.1zm1.4.3zm-2-16.4zm1.4.3z"
      style={{
        fill: "none",
        strokeWidth: 2,
      }}
    />
  </Svg>
)
export default Charging