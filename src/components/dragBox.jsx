import React from "react"
import PropTypes from "prop-types"
import { Rnd } from "react-rnd"

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
      className="drag-box"
      size={{ width: w, height: h }}
      position={{ x, y }}
      onDragStop={handleDragStop}
      onResize={handleResize}
    >
      <div onDoubleClick={() => {}}>+</div>
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
