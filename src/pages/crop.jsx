import React, { useState, useRef } from "react"
import dog from "../images/labrador.jpg"

const style = {
  width: "50px",
}

const cStyle = {
  position: "absolute",
  right: "100px",
}

const naturalHeight = 500
const naturalWidth = 500

const Crop = () => {
  const canvasRef = useRef(null)
  const buttonRef = useRef(null)
  const imgRef = useRef(null)
  const handleClick = () => {
    const { current: canvas } = canvasRef
    const { current: button } = buttonRef
    const dataURL = canvas.toDataURL("image/png")
    button.href = dataURL
  }
  const [isLoaded, setLoaded] = useState(false)
  const [A, setA] = useState(0)
  const [B, setB] = useState(0)
  const [C, setC] = useState(naturalWidth)
  const [D, setD] = useState(naturalHeight)
  const [E, setE] = useState(0)
  const [F, setF] = useState(0)
  const [G, setG] = useState(300)
  const [H, setH] = useState(300)
  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(300)
  const [src, setSrc] = useState(null)
  const { current: img } = imgRef
  console.log("IMG", img)
  if (isLoaded) {

    console.log("HEIGHT", height)
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    canvas.height = height
    canvas.width = width
    ctx.drawImage(img, A, B, C, D, E, F, G, H)
  }
  return (
    <div>
      <div style={cStyle}>
        <canvas id="canvas" ref={canvasRef}></canvas>
      </div>
      <img src={dog} id="img" onLoad={() => setLoaded(true)} ref={imgRef} width="300px" height="300px" />
      <div>
        <a
          href="#"
          download="myImage.jpg"
          id="button"
          onClick={handleClick}
          ref={buttonRef}
        >
          Download
        </a>
      </div>
      <div>
        <span>
          A
          <input
            type="number"
            value={A}
            onChange={e => setA(Number(e.target.value))}
            style={style}
          />
        </span>
        <span>
          B
          <input
            type="number"
            value={B}
            onChange={e => setB(Number(e.target.value))}
            style={style}
          />
        </span>
        <span>
          C
          <input
            type="number"
            value={C}
            onChange={e => setC(Number(e.target.value))}
            style={style}
          />
        </span>
        <span>
          D
          <input
            type="number"
            value={D}
            onChange={e => setD(Number(e.target.value))}
            style={style}
          />
        </span>
        <span>
          E
          <input
            type="number"
            value={E}
            onChange={e => setE(Number(e.target.value))}
            style={style}
          />
        </span>
        <span>
          F
          <input
            type="number"
            value={F}
            onChange={e => setF(Number(e.target.value))}
            style={style}
          />
        </span>
        <span>
          G
          <input
            type="number"
            value={G}
            onChange={e => setG(Number(e.target.value))}
            style={style}
          />
        </span>
        <span>
          H
          <input
            type="number"
            value={H}
            onChange={e => setH(Number(e.target.value))}
            style={style}
          />
        </span>
        <div>
        <span>
          Width
          <input
            type="number"
            value={width}
            onChange={e => setWidth(Number(e.target.value))}
            style={style}
          />
        </span>
        <span>
          Height
          <input
            type="number"
            value={height}
            onChange={e => setHeight(Number(e.target.value))}
            style={style}
          />
        </span>

        </div>
      </div>
    </div>
  )
}

export default Crop
