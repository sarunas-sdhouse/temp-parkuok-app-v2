import * as React from "react"
import Svg, { Path, Circle } from "react-native-svg"

const Home = ({ focused }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
  >
    <Circle cx={20} cy={20} r={20} fill={`${focused ? '#28a745' : '#EEF8F0'}`} />
    <Path
      stroke={`${focused ? 'white' : '#33363F'}`}
      strokeWidth={2}
      d="M10 19.677c0-2.03 0-3.046.41-3.938.41-.893 1.182-1.553 2.723-2.875l1.496-1.281C17.415 9.194 18.809 8 20.469 8c1.659 0 3.052 1.194 5.838 3.583l1.496 1.281c1.541 1.322 2.312 1.982 2.723 2.875.41.892.41 1.907.41 3.938v6.341c0 2.82 0 4.23-.876 5.106-.876.876-2.286.876-5.106.876h-8.972c-2.82 0-4.23 0-5.106-.876C10 30.248 10 28.838 10 26.018v-6.341Z"
    />
    <Path
      stroke={`${focused ? 'white' : '#33363F'}`}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M24.207 32v-7.973a1 1 0 0 0-1-1H17.73a1 1 0 0 0-1 1V32"
    />
  </Svg>
)
export default Home
