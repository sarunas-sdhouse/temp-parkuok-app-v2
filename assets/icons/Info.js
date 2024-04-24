import * as React from "react"
import Svg, { Path } from "react-native-svg"

const Info = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      enableBackground: "new 0 0 20 20",
    }}
    viewBox="0 0 20 20"
    height={20}
    width={20}
    {...props}
  >
    <Path
      d="M9 7h2V5H9m1 13c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8m0-18C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0M9 15h2V9H9v6z"
      style={{
        fill: "#ffdd31",
      }}
    />
  </Svg>
)
export default Info