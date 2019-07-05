import React, { Component } from "react"
import * as tf from "@tensorflow/tfjs"
import fish from "../images/fish3.jpg"

const url =
  "https://jk-fish-test.s3.us-east-2.amazonaws.com/fish_rcnn_2/model.json"

class CustomDetection extends Component {
  state = {
    detected: false,
  }
  drawBoxes = boxes => {
    const img = document.getElementById("img")
    const { width: imgW, height: imgH } = img
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = imgW
    canvas.height = imgH
    ctx.drawImage(img, 0, 0, img.width, img.height)
    console.log("WIDTH", imgW)
    console.log("HEIGHT", imgH)
    /*
      top_left = (int(box[1]*image_w), int(box[0]*image_h))
      bottom_right = (int(box[3]*image_w), int(box[2]*image_h))
      cv2.rectangle(image_np, top_left, bottom_right, (0,255,0), 3)
    */
    //  let [boxY, boxX, boxH, boxW] = topBox
    boxes.forEach(topBox => {
      const topLeft = [topBox[1] * imgW, topBox[0] * imgH]
      const bottomRight = [topBox[3] * imgW, topBox[2] * imgH]
      const boxW = bottomRight[0] - topLeft[0]
      const boxH = bottomRight[1] - topLeft[1]
      const boxX = topLeft[0]
      const boxY = topLeft[1]

      ctx.lineWidth = 2
      ctx.fillStyle = "red"
      ctx.strokeStyle = "red"
      ctx.rect(boxX, boxY, boxW, boxH)
      console.log({ boxX, boxY, boxW, boxH })
    })
    ctx.stroke()
  }

  formatData = tensors => {
    const [
      raw_detection_scores,
      detection_scores,
      detection_boxes,
      raw_detection_boxesXX,
      num_detections,
      detection_classes,
    ] = tensors
    const boxes = []
    for (let i = 0; i < 8; i++) {
      const n = i * 4
      const box = detection_boxes.values.slice(n, n + 4)
      console.log("BOX", box)
      boxes.push(box)
    }
    this.drawBoxes(boxes)
  }

  loadModel = async () => {
    const tensors = {}
    const tensorOrder = [
      "raw_detection_scores",
      "detection_scores",
      "detection_boxes?",
      "raw_detection_boxes?",
      "num_detections",
      "detection_classes",
    ]
    try {
      const model = await tf.loadGraphModel(url)
      console.log("model", model)
      const img = document.getElementById("img")

      const tfImg = tf.browser.fromPixels(img).toFloat()
      const expanded = tfImg.expandDims(0)

      const res = await model.executeAsync(expanded)
      const tensors = await Promise.all(
        res.map(async (ts, i) => {
          return await ts.buffer()
        })
      )
      console.log("CALLING")
      this.formatData(tensors)
      console.log("TENSORS", tensors)
    } catch (err) {
      console.log("ERR", err)
    }
  }

  onLoad = () => {
    console.log("LOADED")
    // this.justTesting()
    this.loadModel()
  }
  render() {
    console.log("RENDER")
    return (
      <div>
        <canvas id="canvas"></canvas>
        <img src={fish} onLoad={this.onLoad} id="img" />
        <div>RCNN</div>
      </div>
    )
  }
}

export default CustomDetection
