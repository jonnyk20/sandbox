import React, { Component, createRef } from "react"
import * as tf from "@tensorflow/tfjs"
import ExifOrientationImg from "react-exif-orientation-img"
import fish from "../images/fish3.jpg"

const url =
  "https://jk-fish-test.s3.us-east-2.amazonaws.com/fish_mobilenet2/model.json"

const getOrientation = (file, callback) => {
  console.log("FILE", file)
  var reader = new FileReader()
  reader.onload = e => {
    var view = new DataView(e.target.result)
    if (view.getUint16(0, false) != 0xffd8) {
      return callback(-2)
    }
    var length = view.byteLength,
      offset = 2
    while (offset < length) {
      if (view.getUint16(offset + 2, false) <= 8) return callback(-1)
      var marker = view.getUint16(offset, false)
      offset += 2
      if (marker == 0xffe1) {
        if (view.getUint32((offset += 2), false) != 0x45786966) {
          return callback(-1)
        }

        var little = view.getUint16((offset += 6), false) == 0x4949
        offset += view.getUint32(offset + 4, little)
        var tags = view.getUint16(offset, little)
        offset += 2
        for (var i = 0; i < tags; i++) {
          if (view.getUint16(offset + i * 12, little) == 0x0112) {
            return callback(view.getUint16(offset + i * 12 + 8, little))
          }
        }
      } else if ((marker & 0xff00) != 0xff00) {
        break
      } else {
        offset += view.getUint16(offset, false)
      }
    }
    return callback(-1)
  }
  reader.readAsArrayBuffer(file)
}

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
  rotatedRef = createRef()
  rotationCanvasRef = createRef()

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
    console.log("RESIZING")
    const { current: canvas } = this.testCanvasRef
    const { current: img } = this.rotatedRef
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
    console.log("IMG", img)
    ctx.drawImage(img, 0, 0, width, height)
    // const resizedSrc = canvas.toDataUrl("image/png")
    // this.setState({
    //   resizedW: ,
    //   resizedH,
    // })
  }

  onLoad2 = () => {
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

    // this.setState({
    //   hiddenSrc: img,
    // })

    // draw image
    ctx.drawImage(img, 0, 0)
    // this.resize(img)

    // // export base64
    // callback(canvas.toDataURL());
    // canvas.toBlob(blob => {
    this.setState({
      rotatedSrc: canvas.toDataURL(),
    })
    // })
  }

  onUpload = event => {
    console.log("ON UPLOAD")
    const hiddenSrc = URL.createObjectURL(event.target.files[0])
    const { current: img } = this.hiddenRef
    getOrientation(event.target.files[0], orientation => {
      this.setState({
        orientation,
        hiddenSrc,
      })
      console.log("orientation: " + orientation)
    })
  }

  reset = () => {
    this.setState({
      predicted: false,
    })
  }
  render() {
    console.log("RENDER")
    console.log(this.state)
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
          id="rotated-visible"
          ref={this.rotatedRef}
          src={this.state.rotatedSrc}
          onLoad={this.resize}
          style={hidden}
        />
        <img id="resized-visible" ref={this.resizedsRef} src={this.resizeSrc} />
        <img
          id="upload-hidden"
          src={this.state.hiddenSrc}
          ref={this.hiddenRef}
          style={hidden}
          onLoad={this.onLoad2}
        />
        <canvas ref={this.rotationCanvasRef} style={hidden} />
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
