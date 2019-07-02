import React, { useState } from "react"
import dog from "../images/dog.jpg"

const style = {
  width: "50px",
}

const cStyle = {
  position: "absolute",
  right: "100px",
}
const Crop = () => {
  const [isLoaded, setLoaded] = useState(false)
  const [A, setA] = useState(0)
  const [B, setB] = useState(0)
  const [C, setC] = useState(500)
  const [D, setD] = useState(500)
  const [E, setE] = useState(0)
  const [F, setF] = useState(0)
  const [G, setG] = useState(500)
  const [H, setH] = useState(500)
  const img = document.getElementById("img")
  console.log("IMG", img)
  if (isLoaded) {
    const x = 500
    const width = x + A
    const height = x + B
    console.log("HEIGHT", height)
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    canvas.height = height
    canvas.width = width
    ctx.drawImage(img, A, B, C, D, E, F, G, H)
  }
  return (
    <div>
      <div class="can" style={cStyle}>
        <canvas id="canvas"></canvas>
      </div>
      <img src={dog} id="img" onLoad={() => setLoaded(true)} />
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
      </div>
    </div>
  )
}

export default Crop
