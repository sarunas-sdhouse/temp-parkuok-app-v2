import * as React from "react"
import Svg, { Path } from "react-native-svg"

const ParkingLots = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    id="Layer_1"
    x={0}
    y={0}
    width={30}
		height={18}
    viewBox="0 0 40 24"
    {...props}
  >
    <Path
      d="M9.6 10.7H5.3V5.3h4.3c1.5 0 2.7 1.2 2.7 2.7s-1.2 2.7-2.7 2.7M9.3 0H0v24h5.3v-8h4c4.4 0 8-3.6 8-8s-3.6-8-8-8z"
      style={{
        fill: "#28a745",
      }}
    />
    <Path d="M22.1 0h1v24h-1z" className="st1" style={{
        fill: "#28a745",
      }}/>
    <Path
      d="M22.244 11.597 32.992.85l.707.707-10.748 10.748zM22.292 23.277 33.04 12.53l.707.708-10.748 10.747z"
      className="st1"
			style={{
        fill: "#28a745",
      }}
    />
  </Svg>
)
export default ParkingLots