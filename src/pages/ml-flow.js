import React, { Component } from "react"
import * as tf from "@tensorflow/tfjs"
import { Rnd } from "react-rnd"
import yolo from "tfjs-yolo"
let canvas
let ctx
let myYolo

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 3px #ddd",
  background: "transparent",
}

function disablePageDrag() {
  document.body.style.overflow = "hidden"
  console.log("Another one")
  document.addEventListener(
    "touchmove",
    function(e) {
      console.log("HAAAA")
      e.preventDefault()
    },
    { passive: false }
  )
}

class MLFlow extends Component {
  state = {
    detections: [],
    width: 100,
    height: 100,
    x: 10,
    y: 10,
  }
  componentDidMount() {
    disablePageDrag()
  }
  runDetection = async () => {
    console.log("RUN")
    console.log("Start with tensors: " + tf.memory().numTensors)
    const boxes = await myYolo.predict(canvas)
    console.log(boxes)
    boxes.map(box => {
      const { left, top, width, height, class: label } = box
      console.log("BOX", box)
      ctx.lineWidth = 2
      ctx.fillStyle = "red"
      ctx.strokeStyle = "red"
      ctx.rect(left, top, width, height)
      ctx.fillText(label, left + 5, top + 10)
      ctx.stroke()
    })
    if (boxes.length > 0) {
      const { left: x, top: y, width, height } = boxes[0]
      this.setState({
        width,
        height,
        x,
        y,
      })
    }

    console.log("End with tensors: " + tf.memory().numTensors)
  }
  initiateDetector = async () => {
    console.log("MAIN")
    try {
      myYolo = await yolo.v2tiny()
      console.log("myYolo", myYolo)
      var img = new Image()
      img.onload = async () => {
        canvas.height = img.height
        canvas.width = img.width
        ctx.drawImage(img, 0, 0, img.width, img.height)
        await this.runDetection()
      }
      img.src = this.state.file // dog
    } catch (e) {
      console.error(e)
    }
  }

  handleChange = event => {
    console.log("EVENT", event.target.files)
    const { innerWidth: maxWidth, innerHeight: maxHeight } = window
    const style = {
      maxWidth,
      maxHeight,
    }
    const file = URL.createObjectURL(event.target.files[0])
    this.setState(
      {
        file,
        style,
      },
      () => {
        canvas = document.getElementById("canvas")
        ctx = canvas.getContext("2d")
        this.initiateDetector(file)
      }
    )
  }
  render() {
    return (
      <div>
        <canvas id="canvas"></canvas>
        <div>Upload here</div>
        <input
          type="file"
          accept="image/*"
          capture="camera"
          onChange={this.handleChange}
        ></input>
        <Rnd
          style={style}
          size={{ width: this.state.width, height: this.state.height }}
          position={{ x: this.state.x, y: this.state.y }}
          onDragStop={(e, d) => {
            this.setState({ x: d.x, y: d.y })
          }}
          onResize={(e, direction, ref, delta, position) => {
            this.setState({
              width: ref.style.width,
              height: ref.style.height,
              ...position,
            })
          }}
        >
          <div>version 16</div>
        </Rnd>
      </div>
    )
  }
}

export default MLFlow
