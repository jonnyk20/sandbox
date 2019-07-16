import React, { useState } from "React"
import PropTypes from "prop-types"
import { Rnd } from "react-rnd"

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 3px #ddd",
  background: "rgba(75, 62, 217, 0.27058823529411763)",
}

const DragBox = ({ box, resizeBox, repositionBox }) => {
  const { x, y, h, w, index } = box
  console.log("BOX.", box)

  const handleDragStop = (e, d) => {
    repositionBox(e, d, index)
  }

  const handleResize = (e, direction, ref, delta, position) => {
    resizeBox(e, direction, ref, delta, position, index)
  }

  return (
    <Rnd
      // onMouseDown={this.crop}
      style={style}
      size={{ width: w, height: h }}
      position={{ x, y }}
      onDragStop={handleDragStop}
      onResize={handleResize}
    >
      <div onDoubleClick={() => console.log("hi")}>Box</div>
    </Rnd>
  )
}

DragBox.propTypes = {
  box: PropTypes.shape({}),
}

DragBox.defaultProps = {
  box: {
    index: 0,
    x: 100,
    y: 100,
    w: 100,
    h: 100,
  },
}

export default DragBox
