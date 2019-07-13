import React, { Component, createRef } from "react"
import * as tf from "@tensorflow/tfjs"
import fish from "../images/fish3.jpg"

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
  resizedsRef = createRef()
  hiddenRef = createRef()
  imgRef = createRef()
  testCanvasRef = createRef()

  drawBoxes = boxes => {
    const { current: img } = this.testCanvasRef
    const { width: imgW, height: imgH } = img
    const { current: canvas } = this.canvasRef
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
      ctx.fillStyle = "green"
      ctx.strokeStyle = "green"
      ctx.rect(boxX, boxY, boxW, boxH)
      console.log({ boxX, boxY, boxW, boxH })
    })
    ctx.stroke()
  }

  formatData2 = tensors => {
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

  formatData = tensors => {
    const [
      raw_detection_scores,
      detection_scores,
      detection_boxes,
      raw_detection_boxesXX,
      num_detections,
      detection_classes,
    ] = tensors
    console.log("TENSORS", tensors)
    const boxes = []
    for (let i = 0; i < 1; i++) {
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
    const { current: img } = this.testCanvasRef
    const { resizedSrc } = this.state

    const tfImg = tf.browser.fromPixels(img).toFloat()
    const expanded = tfImg.expandDims(0)

    const res = await this.state.model.executeAsync(expanded)
    console.log("RES", res)
    const detection_boxes = res[2]
    const arr = await detection_boxes.array()
    console.log("ARRAY", arr)
    const tensors = await Promise.all(
      res.map(async (ts, i) => {
        return await ts.buffer()
      })
    )
    console.log("CALLING")
    this.formatData2(tensors)
    console.log("TENSORS", tensors)
    this.setState({
      predicted: true,
    })
  }
  handleChange = event => {
    console.log("EVENT", event.target.files)

    const { innerWidth: maxWidth, innerHeight: maxHeight } = window
    const style = {
      maxWidth,
      maxHeight,
    }
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
      style,
      maxHeight,
      maxWidth,
    })
  }

  resize = () => {
    const { current: canvas } = this.testCanvasRef
    const { current: img } = this.hiddenRef
    const { innerWidth: maxWidth } = window
    let { height, width } = img
    console.log("ORIGINAN", width, height, width / height)
    if (width > maxWidth) {
      const ratio = width / height
      width = maxWidth
      height = maxWidth / ratio
    }
    console.log("SIZE", width, height, width / height)
    const ctx = canvas.getContext("2d")
    canvas.width = width
    canvas.height = height
    ctx.drawImage(img, 0, 0, width, height)
    // const resizedSrc = canvas.toDataUrl("image/png")
    // this.setState({
    //   resizedW,
    //   resizedH,
    // })
  }

  onUpload = event => {
    console.log("ON UPLOAD")
    const image = URL.createObjectURL(event.target.files[0])
    const { current: img } = this.hiddenRef
    img.src = image
  }

  reset = () => {
    this.setState({
      predicted: false,
    })
  }
  render() {
    console.log("RENDER")
    const { modelLoaded, file, predicted, maxWidth } = this.state
    const hidden = {
      display: "none",
    }
    const imgStyle = predicted
      ? {
          display: "none",
        }
      : {}
    const canvasStyle = predicted
      ? {}
      : {
          display: "none",
        }
    return (
      <div>
        <img
          id="resized"
          ref={this.resizedsRef}
          src={this.resized}
          src={this.resizeSrc}
        />
        <img
          src={this.hiddemSrc}
          ref={this.hiddenRef}
          style={hidden}
          onLoad={this.resize}
        />
        <canvas ref={this.canvasRef} style={canvasStyle}></canvas>
        <img
          src={file}
          onLoad={this.onLoad}
          id="img"
          ref={this.imgRef}
          style={hidden}
        />
        {!predicted && <canvas ref={this.testCanvasRef} id="resized" />}
        <div>SSD</div>
        {modelLoaded ? (
          <button onClick={this.makePrediction}>Make Predition</button>
        ) : (
          <button onClick={this.loadModel}>Load Model</button>
        )}
        <input
          type="file"
          accept="image/*"
          capture="camera"
          onChange={this.onUpload}
        />
        {predicted && <button onClick={this.reset}>Reset</button>}
      </div>
    )
  }
}

export default FishMobilenet

// export default () => <div>hi</div>
