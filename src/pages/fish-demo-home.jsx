import React from "react"
import { connect } from "react-redux"
import { toggleDarkMode } from "../state/app"

const FishDemoHome = ({ isDarkMode, dispatch }) => {
  console.log("isDarkMode", isDarkMode)
  return (
    <div>
      <div>DARK MODE: {isDarkMode ? "ON" : "OFF"}</div>
      <button onClick={() => dispatch(toggleDarkMode(!isDarkMode))}>
        Switch
      </button>
    </div>
  )
}

const mapStateToProps = state => ({ isDarkMode: state.app.isDarkMode })

export default connect(mapStateToProps)(FishDemoHome)
