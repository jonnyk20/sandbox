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

const DragBox = ({ children }) => {
  // const { x, y, h, w, index } = box
  const [x, setX] = useState(false)
  // const [y, setY] = useState(0)
  // const [w, setW] = useState(100)
  // const [h, setH] = useState(100)

  // const handleDragStop = (e, d) => {
  //   const { x, y } = d
  //   setX(x)
  //   setY(y)
  // }

  // const handleResize = (e, direction, ref, delta, position) => {
  //   const { width, height } = ref.style
  //   const { x, y } = position
  //   setW(width)
  //   setH(height)
  //   setX(x)
  //   setY(y)
  // }

  return (
    <Rnd
      // onMouseDown={this.crop}
      style={style}
      size={{ width: 100, height: 100 }}
      position={{ x: 0, y: 0 }}
      onDragStop={() => {}}
      onResize={() => {}}
    >
      <div onDoubleClick={() => console.log("hi")}>{children}</div>
    </Rnd>
  )
}

DragBox.propTypes = {
  children: PropTypes.node,
}

DragBox.defaultProps = {
  children: <div />,
}

export default DragBox
