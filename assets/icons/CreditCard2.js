import * as React from "react"
import Svg, { Path } from "react-native-svg"
const CrditCard2 = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={25}
    fill="none"
    {...props}
  >
    <Path
      fill="#42B705"
      d="M0 6.25a3.125 3.125 0 0 1 3.125-3.125h18.75A3.125 3.125 0 0 1 25 6.25v12.5a3.125 3.125 0 0 1-3.125 3.125H3.125A3.125 3.125 0 0 1 0 18.75V6.25Zm3.125-1.563A1.562 1.562 0 0 0 1.562 6.25v1.563h21.875V6.25a1.563 1.563 0 0 0-1.562-1.563H3.125Zm20.313 6.25H1.563v7.813a1.563 1.563 0 0 0 1.562 1.563h18.75a1.563 1.563 0 0 0 1.563-1.563v-7.813Z"
    />
    <Path
      fill="#CDECD6"
      d="M3.125 15.625a1.563 1.563 0 0 1 1.563-1.563H6.25a1.563 1.563 0 0 1 1.563 1.563v1.563A1.563 1.563 0 0 1 6.25 18.75H4.687a1.563 1.563 0 0 1-1.562-1.563v-1.562Z"
    />
  </Svg>
)
export default CrditCard2