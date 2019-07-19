import React, { useState, useRef } from "react"
import * as tf from "@tensorflow/tfjs"
import getOrientation from "../utils/getOrientation"
import DragBoxes from "../components/DragBoxes"
import ProgressBar from "../components/ProgressBar"
import DragBoxWithState from "../components/DragBoxWithState"
import "./fish-demo.css"
require("react-dom")
window.React2 = require("react")
console.log(window.React1 === window.React2)

const url =
  "https://jk-fish-test.s3.us-east-2.amazonaws.com/fish_mobilenet2/model.json"

const FishDemo = () => {
  const [modelLoaded, setModelLoaded] = useState(false)
  const [model, setModel] = useState(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [predicted, setPredicted] = useState(false)
  const [hiddenSrc, setHiddenSrc] = useState(null)
  const [fail, setFail] = useState(false)
  const [resized, setResized] = useState(false)
  const [orientation, setOrientation] = useState(-1)
  const [predictions, setPredictions] = useState([])
  const [divWidth, setDivWith] = useState("auto")
  const inputRef = useRef()
  const hiddenRef = useRef()
  const rotationCanvasRef = useRef()

  const drawBoxes = boxes => {
    const { current: img } = rotationCanvasRef
    const { width: imgW, height: imgH } = img
    const newPredictions = []
    boxes.forEach((topBox, index) => {
      const topLeft = [topBox[1] * imgW, topBox[0] * imgH]
      const bottomRight = [topBox[3] * imgW, topBox[2] * imgH]
      const boxW = bottomRight[0] - topLeft[0]
      const boxH = bottomRight[1] - topLeft[1]
      const boxX = topLeft[0]
      const boxY = topLeft[1]
      const newPrediction = {
        index,
        x: boxX,
        y: boxY,
        w: boxW,
        h: boxH,
      }
      newPredictions.push(newPrediction)
    })
    setPredictions(newPredictions)
  }

  const formatData = tensors => {
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
      if (detection_scores.values[i] > 0.1) {
        boxes.push(box)
      }
    }
    drawBoxes(boxes)
  }

  const loadModel = async () => {
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
      const loadedModel = await tf.loadGraphModel(url, {
        onProgress: downloadProgress => {
          setDownloadProgress(downloadProgress)
        },
      })
      setModel(loadedModel)
      setModelLoaded(true)
    } catch (err) {
      console.log("ERR", err)
    }
  }

  const makePrediction = async () => {
    const { current: img } = rotationCanvasRef
    let predictionFailed = false
    try {
      const tfImg = tf.browser.fromPixels(img).toFloat()
      const expanded = tfImg.expandDims(0)
      const res = await model.executeAsync(expanded)
      const detection_boxes = res[2]
      const arr = await detection_boxes.array()
      const tensors = await Promise.all(
        res.map(async (ts, i) => {
          return await ts.buffer()
        })
      )
      formatData(tensors)
    } catch (err) {
      console.log("ERROR ON INFERENCE", err)
      predictionFailed = true
    }
    setPredicted(true)
    setFail(predictionFailed)
  }

  const handleLoad = () => {
    console.log("ONLOAD 2")
    const { current: img } = hiddenRef
    const width = img.width,
      height = img.height

    const { current: canvas } = rotationCanvasRef
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
    drawResized(img, canvas, ctx)
  }

  const drawResized = (img, canvas, ctx) => {
    const { innerWidth: maxWidth } = window
    let { height, width } = img
    if (width > maxWidth) {
      const ratio = width / height
      width = maxWidth
      height = maxWidth / ratio
    }
    canvas.width = width
    canvas.height = height
    setDivWith(width)
    ctx.drawImage(img, 0, 0, width, height)
    setResized(true)
  }

  const handleChange = event => {
    const hiddenSrc = URL.createObjectURL(event.target.files[0])
    getOrientation(event.target.files[0], orientation => {
      setOrientation(orientation)
      setHiddenSrc(hiddenSrc)
    })
  }

  const reset = () => {
    setPredicted(false)
    setResized(false)
  }

  const triggerInput = () => {
    inputRef.current.click()
  }

  // const { modelLoaded, predicted, resized, hiddenSrc, fail } = state
  const hidden = {
    display: "none",
  }
  const showProgress = downloadProgress !== 0 && downloadProgress !== 1
  const controlActiveClass = resized ? "control--active" : ""
  return (
    <div className="wrapper" style={resized ? { width: divWidth } : {}}>
      {fail && <div>Failed to find fish</div>}
      <img
        id="hidden-upload-placeholder"
        src={hiddenSrc}
        ref={hiddenRef}
        style={hidden}
        onLoad={handleLoad}
      />
      <canvas
        ref={rotationCanvasRef}
        style={resized ? {} : hidden}
        id="adjusted-image"
      />
      {resized && <div className="overlay" />}
      {predictions.length > 0 && <DragBoxes boxes={predictions} />}

      <div className={`control ${controlActiveClass}`}>
        <DragBoxWithState>
          {modelLoaded ? (
            <button onClick={makePrediction} className="control__button">
              Predict
            </button>
          ) : (
            <button onClick={loadModel} className="control__button">
              Load Model
            </button>
          )}
          {showProgress && <ProgressBar progress={downloadProgress} />}

          <button href="#" onClick={triggerInput} className="control__button">
            Take a Photo
          </button>
          {predicted && (
            <button onClick={reset} className="control__button">
              Reset
            </button>
          )}

          <input
            type="file"
            accept="image/*"
            capture="camera"
            onChange={handleChange}
            ref={inputRef}
            id="file-input"
            className="control__input"
          />
        </DragBoxWithState>
      </div>
    </div>
  )
}

export default FishDemo
