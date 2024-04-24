import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

const Target = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    data-name="Layer 1"
    viewBox="0 0 40 40"
    width={40}
    height={40}
  >
    <Circle
      cx={20}
      cy={20}
      r={20}
      style={{
        strokeWidth: 0,
        fill: "#28a745",
      }}
    />
    <Path
      d="M18.37 3.69v3.38c-5.9.75-10.55 5.4-11.3 11.3H3.69v3.26h3.38c.75 5.9 5.4 10.55 11.3 11.3v3.38h3.26v-3.38c5.9-.75 10.55-5.4 11.3-11.3h3.38v-3.26h-3.38c-.75-5.9-5.4-10.55-11.3-11.3V3.69m-3.26 6.65v3.13h3.26v-3.12c4.08.67 7.34 3.93 8.03 8.01h-3.13v3.26h3.12c-.67 4.08-3.93 7.34-8.01 8.03v-3.13h-3.26v3.12c-4.08-.67-7.34-3.93-8.03-8.01h3.13v-3.26h-3.12c.67-4.08 3.93-7.34 8.01-8.03M20 18.37a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z"
      style={{
        fill: "#fff",
        strokeWidth: 0,
      }}
    />
  </Svg>
)
export default Target