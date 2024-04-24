import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

const CreditCard = ({ focused }) => (
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
      d="M29 11H11c-1.105 0-2 1.007-2 2.25v13.5c0 1.243.895 2.25 2 2.25h18c1.105 0 2-1.007 2-2.25v-13.5c0-1.243-.895-2.25-2-2.25ZM9 17h22"
    />
    <Path
      stroke={`${focused ? 'white' : '#33363F'}`}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M22.5 20v5M20 22.5h5"
    />
  </Svg>
)
export default CreditCard
