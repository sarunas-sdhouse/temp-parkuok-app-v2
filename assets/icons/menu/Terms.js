import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

const Terms = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    fill="none"
    {...props}
  >
    <G
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.7}
      strokeWidth={1.2}
      clipPath="url(#a)"
    >
      <Path d="M8.75 1.254h-5a1.25 1.25 0 0 0-1.25 1.25v10a1.25 1.25 0 0 0 1.25 1.25h7.5a1.25 1.25 0 0 0 1.25-1.25v-7.5l-3.75-3.75Z" />
      <Path d="M8.75 1.254v3.75h3.75M10 8.129H5M10 10.629H5M6.25 5.629H5" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 .004h15v15H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default Terms
