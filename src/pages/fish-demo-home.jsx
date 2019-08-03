import React from "react"
import { connect } from "react-redux"
import { toggleDarkMode } from "../state/app"
import HomeScreen from "../components/HomeScreen"

const FishDemoHome = ({ isDarkMode, dispatch }) => {
  return <HomeScreen />
  // return (
  //   <div>
  //     <div>DARK MODE: {isDarkMode ? "ON" : "OFF"}</div>
  //     <button onClick={() => dispatch(toggleDarkMode(!isDarkMode))}>
  //       Switch
  //     </button>
  //   </div>
  // )
}

const mapStateToProps = state => ({ isDarkMode: state.app.isDarkMode })

export default connect(mapStateToProps)(FishDemoHome)
