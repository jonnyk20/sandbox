import React, { useEffect } from "react"
import "./HomeScreen.scss"
import scatterDots from "../utils/scatterDots"

const HomeScreen = () => {
  useEffect(scatterDots)
  return (
    <div className="container">
      <div className="grid">
        {/* <div className="edge" /> */}
        <div className="cell" />
        <div className="cell">
          <div className="circle" />
        </div>
        <div className="cell" />
        <div className="cell top-left">
          <div className="circle" />
        </div>
        <div className="cell" />
        <div className="cell top-right">
          <div className="circle" />
        </div>
        <div className="cell" />
        <div className="cell avatar">
          <div className="circle" />
        </div>
        <div className="cell" />
        <div className="cell bottom-left">
          <div className="circle" />
        </div>
        <div className="cell" />
        <div className="cell bottom-right">
          <div className="circle" />
        </div>
        <div className="cell" />
        <div className="cell">
          <div className="circle" />
        </div>
        <div className="cell" />
        {/* <div className="edge" /> */}
      </div>
    </div>
  )
}

export default HomeScreen
