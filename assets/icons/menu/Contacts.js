import * as React from "react"
import Svg, { Path } from "react-native-svg"

const Contacts = (props) => (
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
      d="M13.125 9.379a1.25 1.25 0 0 1-1.25 1.25h-7.5l-2.5 2.5v-10a1.25 1.25 0 0 1 1.25-1.25h8.75a1.25 1.25 0 0 1 1.25 1.25v6.25Z"
    />
  </Svg>
)
export default Contacts
