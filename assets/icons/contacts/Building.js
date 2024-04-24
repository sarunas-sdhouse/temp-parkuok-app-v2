import * as React from "react"
import Svg, { Path } from "react-native-svg"

const Building = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
    {...props}
  >
    <Path
      fill="#28A745"
      fillOpacity={0.08}
      d="M50 25c0 13.807-11.193 25-25 25S0 38.807 0 25 11.193 0 25 0s25 11.193 25 25Z"
    />
    <Path
      fill="#42B705"
      d="M18.5 19h1.625v3H18.5v-3ZM18.5 23.5h1.625v3H18.5v-3ZM23.373 19h1.625v3h-1.625v-3ZM23.373 23.5h1.625v3h-1.625v-3ZM18.5 28.001h1.625v3H18.5v-3ZM23.373 28.001h1.625v3h-1.625v-3Z"
    />
    <Path
      fill="#42B705"
      d="M36.375 23.5c0-.398-.171-.78-.476-1.061a1.696 1.696 0 0 0-1.149-.44h-4.875v-6c0-.397-.171-.779-.476-1.06a1.696 1.696 0 0 0-1.149-.44h-13c-.431 0-.844.159-1.149.44a1.444 1.444 0 0 0-.476 1.06v19.5h22.75v-12ZM15.25 16h13v18h-13V16Zm14.625 18V23.5h4.875V34h-4.875Z"
    />
  </Svg>
)
export default Building
