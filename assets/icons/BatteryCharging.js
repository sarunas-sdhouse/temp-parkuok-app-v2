import * as React from "react"
import Svg, { Path } from "react-native-svg"

const BatteryCharging = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <Path
      fill="#BDDFC7"
      d="M17.972 4.815a.938.938 0 0 1 .424 1.087L16.27 12.81H20a.938.938 0 0 1 .682 1.58l-10 10.626a.937.937 0 0 1-1.58-.919l2.129-6.909H7.5a.938.938 0 0 1-.682-1.58l10-10.626a.938.938 0 0 1 1.154-.169v.002Z"
    />
    <Path
      fill="#42B705"
      d="M3.75 7.5h8.123L10.11 9.375H3.75a1.875 1.875 0 0 0-1.875 1.875v7.5a1.875 1.875 0 0 0 1.875 1.875h4.463L7.635 22.5H3.75A3.75 3.75 0 0 1 0 18.75v-7.5A3.75 3.75 0 0 1 3.75 7.5Z"
    />
    <Path
      fill="#42B705"
      d="M3.75 11.25h4.594l-2.891 3.073a2.813 2.813 0 0 0 .759 4.427H3.75v-7.5ZM19.866 7.5l-.578 1.875H22.5a1.875 1.875 0 0 1 1.875 1.875v7.5a1.875 1.875 0 0 1-1.875 1.875h-5.108L15.626 22.5H22.5a3.75 3.75 0 0 0 3.75-3.75v-7.5A3.75 3.75 0 0 0 22.5 7.5h-2.634Z"
    />
    <Path
      fill="#42B705"
      d="M22.5 18.75h-3.344l2.892-3.073c.181-.193.333-.409.451-.638v3.711Zm0-6.289V11.25h-1.212c.52.268.943.691 1.211 1.211ZM30 15a2.812 2.812 0 0 1-2.813 2.813v-5.625A2.812 2.812 0 0 1 29.999 15Z"
    />
  </Svg>
)
export default BatteryCharging
