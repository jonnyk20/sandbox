import React, { Component } from "react"
import yolo from "tfjs-yolo"
import * as tf from "@tensorflow/tfjs"
import dog from "../images/dog.jpg"

let canvas
let ctx
let myYolo

const main = async file => {
  console.log("MAIN")
  try {
    myYolo = await yolo.v2tiny()
    console.log("myYolo", myYolo)
    var img = new Image()
    img.onload = async function() {
      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0, img.width, img.height)
      await run()
    }
    img.src = file // dog
  } catch (e) {
    console.error(e)
  }
}

const run = async () => {
  console.log("RUN")
  console.log("Start with tensors: " + tf.memory().numTensors)
  const boxes = await myYolo.predict(canvas)
  console.log(boxes)
  boxes.map(box => {
    ctx.lineWidth = 2
    ctx.fillStyle = "red"
    ctx.strokeStyle = "red"
    ctx.rect(box["left"], box["top"], box["width"], box["height"])
    ctx.fillText(box["class"], box["left"] + 5, box["top"] + 10)
    ctx.stroke()
  })
  console.log("End with tensors: " + tf.memory().numTensors)
}

class Detection extends Component {
  state = {
    file: null,
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
        main(file)
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
      </div>
    )
  }
}

export default Detection
