import React, { useState } from "react"
import "./ProgressBar.css"

const ProgressBar = ({ progress }) => {
  return (
    <div>
      <div className="progress-bar">
        <div
          className="progress-bar__filler"
          style={{ width: `${parseInt(progress * 100)}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
