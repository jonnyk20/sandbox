import React, { Component, createRef } from "react"
import getOrientation from "../utils/getOrientation"
import * as tf from "@tensorflow/tfjs"

const url =
  "https://jk-fish-test.s3.us-east-2.amazonaws.com/fish_mobilenet2/model.json"

class FishMobilenet extends Component {
  state = {
    modelLoaded: false,
    detected: false,
    model: null,
    downloadProgress: 0,
    predicted: false,
    resizedSrc: null,
    hiddenRef: null,
  }
  canvasRef = createRef()
  hiddenRef = createRef()
  rotationCanvasRef = createRef()

  drawBoxes = boxes => {
    const { current: img } = this.rotationCanvasRef
    const { width: imgW, height: imgH } = img
    const { current: canvas } = this.canvasRef
    const ctx = canvas.getContext("2d")
    canvas.width = imgW
    canvas.height = imgH
    ctx.drawImage(img, 0, 0, img.width, img.height)
    boxes.forEach(topBox => {
      const topLeft = [topBox[1] * imgW, topBox[0] * imgH]
      const bottomRight = [topBox[3] * imgW, topBox[2] * imgH]
      const boxW = bottomRight[0] - topLeft[0]
      const boxH = bottomRight[1] - topLeft[1]
      const boxX = topLeft[0]
      const boxY = topLeft[1]

      ctx.lineWidth = 2
      ctx.fillStyle = "green"
      ctx.strokeStyle = "green"
      ctx.rect(boxX, boxY, boxW, boxH)
      console.log({ boxX, boxY, boxW, boxH })
    })
    ctx.stroke()
  }

  formatData = tensors => {
    const [
      raw_detection_scores,
      raw_detection_boxes,
      detection_scores,
      detection_boxes,
      num_detections,
      detection_classes,
    ] = tensors

    const boxes = []
    for (let i = 0; i < num_detections.values[0]; i++) {
      const n = i * 4
      const box = detection_boxes.values.slice(n, n + 4)
      console.log("BOX", box)
      if (detection_scores.values[i] > 0.1) {
        boxes.push(box)
      }
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
      const model = await tf.loadGraphModel(url, {
        onProgress: (a, b, c) => {
          console.log("a", a)
          console.log("b", b)
          console.log("c", c)
        },
      })
      this.setState({ model, modelLoaded: true })
      console.log("model", model)
    } catch (err) {
      console.log("ERR", err)
    }
  }

  makePrediction = async () => {
    const { current: img } = this.rotationCanvasRef
    let fail = false
    try {
      const tfImg = tf.browser.fromPixels(img).toFloat()
      const expanded = tfImg.expandDims(0)
      const res = await this.state.model.executeAsync(expanded)
      const detection_boxes = res[2]
      const arr = await detection_boxes.array()
      const tensors = await Promise.all(
        res.map(async (ts, i) => {
          return await ts.buffer()
        })
      )
      this.formatData(tensors)
    } catch (err) {
      console.log("ERROR ON INFERENCE", err)
      fail = true
    }
    this.setState({
      predicted: true,
      fail,
    })
  }

  handleLoad = () => {
    console.log("ONLOAD 2")
    const { orientation } = this.state
    const { current: img } = this.hiddenRef
    const width = img.width,
      height = img.height

    const { current: canvas } = this.rotationCanvasRef
    const ctx = canvas.getContext("2d")

    // set proper canvas dimensions before transform & export
    if (4 < orientation && orientation < 9) {
      canvas.width = height
      canvas.height = width
    } else {
      canvas.width = width
      canvas.height = height
    }

    // transform context before drawing image
    switch (orientation) {
      case 2:
        ctx.transform(-1, 0, 0, 1, width, 0)
        break
      case 3:
        ctx.transform(-1, 0, 0, -1, width, height)
        break
      case 4:
        ctx.transform(1, 0, 0, -1, 0, height)
        break
      case 5:
        ctx.transform(0, 1, 1, 0, 0, 0)
        break
      case 6:
        ctx.transform(0, 1, -1, 0, height, 0)
        break
      case 7:
        ctx.transform(0, -1, -1, 0, height, width)
        break
      case 8:
        ctx.transform(0, -1, 1, 0, 0, width)
        break
      default:
        break
    }
    this.drawResized(img, canvas, ctx)
  }

  drawResized = (img, canvas, ctx) => {
    const { innerWidth: maxWidth } = window
    let { height, width } = img
    if (width > maxWidth) {
      const ratio = width / height
      width = maxWidth
      height = maxWidth / ratio
    }
    canvas.width = width
    canvas.height = height
    ctx.drawImage(img, 0, 0, width, height)
    this.setState({
      resized: true,
    })
  }

  handleChange = event => {
    const hiddenSrc = URL.createObjectURL(event.target.files[0])
    getOrientation(event.target.files[0], orientation => {
      this.setState({
        orientation,
        hiddenSrc,
      })
    })
  }

  reset = () => {
    this.setState({
      predicted: false,
      resized: false,
    })
  }
  render() {
    const { modelLoaded, predicted, resized, hiddenSrc, fail } = this.state
    const hidden = {
      display: "none",
    }
    return (
      <div>
        {fail && <div>Failed to find fish</div>}
        <img
          id="hidden-upload-placeholder"
          src={hiddenSrc}
          ref={this.hiddenRef}
          style={hidden}
          onLoad={this.handleLoad}
        />
        <canvas
          ref={this.rotationCanvasRef}
          style={resized && !predicted ? {} : hidden}
          id="adjusted-image"
        />
        <canvas
          ref={this.canvasRef}
          style={predicted ? {} : hidden}
          id="prediction-output"
        />
        <div>SSD</div>
        {modelLoaded ? (
          <button onClick={this.makePrediction}>Predict</button>
        ) : (
          <button onClick={this.loadModel}>Load Model</button>
        )}
        <input
          type="file"
          accept="image/*"
          capture="camera"
          onChange={this.handleChange}
        />
        {predicted && <button onClick={this.reset}>Reset</button>}
      </div>
    )
  }
}

export default FishMobilenet

// export default () => <div>hi</div>
