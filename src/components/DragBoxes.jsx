import React, { useState } from "react"
import DragBox from "./Dragbox"

export default ({ boxes }) => {
  const [dragBboxes, setDragBoxes] = useState(boxes)
  const resizeBox = (e, direction, ref, delta, position, index) => {
    const { width: w, height: h } = ref.style
    const { x, y } = position
    const newBoxes = boxes.map((box, i) => {
      const val = box.index === index ? { ...box, x, y, h, w } : box
      console.log("VAL", val)
      return val
    })
    setDragBoxes(newBoxes)
  }

  const repositionBox = (e, d, index) => {
    const { x, y } = d
    const newBoxes = boxes.map((box, i) =>
      box.index === index ? { ...box, x, y } : box
    )
    setDragBoxes(newBoxes)
  }
  return dragBboxes.map(box => (
    <DragBox
      box={box}
      key={box.index}
      repositionBox={repositionBox}
      resizeBox={resizeBox}
    />
  ))
}
//
