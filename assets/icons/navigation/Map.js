import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
const Map = ({ focused }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
  >
    <Circle cx={20} cy={20} r={20} fill={`${focused ? '#28a745' : '#EEF8F0'}`} />
    <Path
      stroke={`${focused ? 'white' : '#33363F'}`}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 14v16l7-4 8 4 7-4V10l-7 4-8-4-7 4ZM16 10v16M24 14v16"
    />
  </Svg>
)
export default Map