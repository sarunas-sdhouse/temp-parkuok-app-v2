import * as React from "react"
import Svg, { Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: style, title */
const Visa = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    id="Layer_1"
    x={0}
    y={0}
    style={{
      enableBackground: "new 0 0 168.3 106.9",
    }}
    viewBox="0 0 168.3 106.9"
    {...props}
  >
    <Path
      d="M0 0h168.3v106.9H0z"
      style={{
        fill: "#fff",
      }}
    />
    <Path
      d="M2.8 89.5h162.7v14.6H2.8z"
      style={{
        fill: "#f7b600",
      }}
    />
    <Path
      d="M2.8 2.8h162.7v14.6H2.8zM67.9 33.5 51.1 73.6h-11l-8.3-32c-.5-2-.9-2.7-2.5-3.5-2.5-1.4-6.6-2.6-10.2-3.4l.2-1.2H37c2.2 0 4.3 1.5 4.8 4.1l4.4 23.2L57 33.5h10.9zm43 27c0-10.6-14.6-11.2-14.5-15.9 0-1.4 1.4-3 4.4-3.4 1.5-.2 5.6-.3 10.2 1.8l1.8-8.5c-2.5-.9-5.7-1.8-9.7-1.8-10.3 0-17.5 5.4-17.5 13.3-.1 5.8 5.2 9 9.1 10.9 4 2 5.4 3.2 5.4 5 0 2.7-3.2 3.9-6.2 3.9-5.2.1-8.2-1.4-10.7-2.5l-1.9 8.8c2.4 1.1 6.9 2.1 11.5 2.1 10.9 0 18.1-5.4 18.1-13.7M138 73.6h9.6l-8.4-40.1h-8.8c-2 0-3.7 1.2-4.4 2.9l-15.6 37.2h10.9l2.2-6h13.3l1.2 6zm-11.6-14.2 5.5-15.1 3.1 15.1h-8.6zM82.8 33.5l-8.6 40.1H63.8l8.6-40.1h10.4z"
      className="st2"
    />
  </Svg>
)
export default Visa
