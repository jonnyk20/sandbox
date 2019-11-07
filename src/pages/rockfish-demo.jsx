import React, { useState, useRef, useEffect, Fragment } from "react"
import * as tf from "@tensorflow/tfjs"
import getOrientation from "../utils/getOrientation"
import DragBoxes from "../components/DragBoxes"
import ProgressBar from "../components/ProgressBar"
import DragBoxWithState from "../components/DragBoxWithState"
import LoadingSpinner from "../components/LoadingSpinner"
import disablePageDrag from "../utils/disablePageDrag"
import sampleFishPhoto from "../images/sample-aquarium.jpeg"
import "./fish-demo.css"
import "./fish-demo.scss"

const url =
  "https://jk-fish-test.s3.us-east-2.amazonaws.com/fish_mobilenet2/model.json"

const RockfishDemo = () => {
  useEffect(disablePageDrag)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [model, setModel] = useState(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [predicted, setPredicted] = useState(false)
  const [isPredictig, setIsPredicting] = useState(false)
  const [hiddenSrc, setHiddenSrc] = useState(null)
  const [resizedSrc, setResizedSrc] = useState(null)
  const [fail, setFail] = useState(false)
  const [resized, setResized] = useState(false)
  const [orientation, setOrientation] = useState(0)
  const [predictions, setPredictions] = useState([])
  const [crops, setCrops] = useState([])
  const [croppedCanvases, setCroppedCanvases] = useState([]);
  const [divWidth, setDivWith] = useState("auto")
  const [divHeight, setDivHeight] = useState("auto")
  const inputRef = useRef()
  const hiddenRef = useRef()
  const resizedRef = useRef()
  const rotationCanvasRef = useRef()
  const hiddenCanvasRef = useRef()
  const cropRef = useRef()
  const [isClassifying, setIsClassifying] = useState(false);

  const drawBoxes = boxes => {
    const { current: img } = rotationCanvasRef
    const { width: imgW, height: imgH } = img
    const newPredictions = []
    const canvas = rotationCanvasRef.current;
    const ctx = canvas.getContext("2d")
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
      ctx.lineWidth = 2
      ctx.fillStyle = "green"
      ctx.strokeStyle = "green"
      ctx.rect(boxX, boxY, boxW, boxH)
    })
    ctx.stroke()
    setPredictions(newPredictions)
    setCrops(newPredictions)
    renderCropped(newPredictions)
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
      try {
        const warmupResult = await loadedModel.executeAsync(
          tf.zeros([1, 300, 300, 3])
        )
      } catch (err) {
        console.log("ERROR ON TEST RUN", err)
      }
    } catch (err) {
      console.log("ERROR ON LOAD", err)
    }
  }

  const makePrediction = async () => {
    const { current: img } = rotationCanvasRef
    let predictionFailed = false
    setIsPredicting(true)
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
      predictionFailed = true
    }
    setPredicted(true)
    setIsPredicting(false)
    setFail(predictionFailed)
  }

  const handleLoad = () => {
    const { current: img } = hiddenRef
    const width = img.width,
      height = img.height

    const { current: canvas } = hiddenCanvasRef
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
    ctx.drawImage(img, 0, 0)
    setResizedSrc(canvas.toDataURL())
    // drawResized(img, canvas, ctx)
  }

  const getFinal = results => {
    let predictionList = []
    for (let i = 0; i < results.length; i++) {
      predictionList.push({ value: results[i], index: i })
    }
    predictionList = predictionList.sort((a, b) => {
      return b.value - a.value
    })
  }

  const runCustom = async () => {
    const results = await Promise.all(croppedCanvases.map(async canvas => {
      console.log("RUNNING CLASSIFICATION")
      const MODEL_URL =
        "https://jk-fish-test.s3.us-east-2.amazonaws.com/test_fish_classifier/model.json"
      const model = await tf.loadGraphModel(MODEL_URL)
      const tfImg = tf.browser.fromPixels(canvas).toFloat()
      let input = tf.image.resizeBilinear(tfImg, [224, 224])
      const offset = tf.scalar(127.5)
      // Normalize the image
      input = input.sub(offset).div(offset)
  
      const global = input.expandDims(0)
      const results = model.predict(global)
      const ok = await results.buffer()
      return ok.values;
      // getFinal(ok.values)
    }))
    console.log('RESULTS', results);
  }

  useEffect(() => {
    if (croppedCanvases && croppedCanvases.length) {
      runCustom()
    }
  },[croppedCanvases])

  const renderCropped = boxes => {
    console.log('A', boxes);
    const canvases = [];
    boxes.forEach(box => {
      const { current: source } = rotationCanvasRef
      const canvas = document.createElement('canvas');
      const { x, width: w, height: h } = source.getBoundingClientRect()
      const A = box.x // x
      const B = box.y // y
      const C = w // w original
      const D = h // h original
      const E = 0
      const F = 0
      const G = w // w original (scale)
      const H = h // h original (scale)
      const ctx = canvas.getContext("2d")
      canvas.height = box.h // cropH
      canvas.width = box.w // cropW
      ctx.drawImage(source, A, B, C, D, E, F, G, H)
      canvases.push(canvas);
    })
    console.log('B', canvases);
    setCroppedCanvases(canvases);
  }

  const resize = () => {
    const { innerWidth: maxWidth } = window
    const { current: canvas } = rotationCanvasRef
    const ctx = canvas.getContext("2d")
    const { current: img } = resizedRef
    let { height, width } = img

    if (width > maxWidth) {
      const ratio = width / height
      width = maxWidth
      height = maxWidth / ratio
    }
    canvas.width = width
    canvas.height = height
    setDivWith(width)
    setDivHeight(height)
    ctx.drawImage(img, 0, 0, width, height)
    setResized(true)
  }

  const handleChange = event => {
    const { files } = event.target
    if (files.length > 0) {
      const hiddenSrc = URL.createObjectURL(event.target.files[0])
      getOrientation(event.target.files[0], orientation => {
        setOrientation(orientation)
        setHiddenSrc(hiddenSrc)
      })
    }
  }

  const getSamplePhoto = () => {
    setResizedSrc(sampleFishPhoto)
  }

  const reset = e => {
    e.stopPropagation()
    setPredicted(false)
    setResized(false)
    setPredictions([])
    setResizedSrc(null)
  }

  const triggerInput = () => {
    inputRef.current.click()
  }

  const hidden = {
    display: "none",
  }
  const showProgress = downloadProgress !== 0 && downloadProgress !== 1
  const controlActiveClass = resized ? "control--active" : ""
  
  return (
    <div
      className="wrapper"
      style={resized ? { width: divWidth, height: divHeight } : {}}
    >
      <img
        id="hidden-upload-placeholder"
        src={hiddenSrc}
        ref={hiddenRef}
        style={hidden}
        onLoad={handleLoad}
      />
      <img
        id="resized-placeholder"
        src={resizedSrc}
        ref={resizedRef}
        style={hidden}
        onLoad={resize}
      />
      <canvas ref={hiddenCanvasRef} id="hidden-canvas" style={hidden} />
      <canvas
        ref={rotationCanvasRef}
        style={resized ? {} : hidden}
        id="adjusted-image"
      />
      {resized && <div className="overlay" />}
      {/* {predictions.length > 0 && <DragBoxes boxes={predictions} />} */}

      <div className={`control ${controlActiveClass}`}>
        <DragBoxWithState>
          <div className="move-target">≡</div>
          {modelLoaded && resized && !isPredictig && !predicted && (
            <button onClick={makePrediction} className="control__button">
              Find Fish
            </button>
          )}
          {isPredictig && <LoadingSpinner />}
          {!modelLoaded && (
            <button onClick={loadModel} className="control__button">
              Load Model
            </button>
          )}
          {showProgress && <ProgressBar progress={downloadProgress} />}

          {modelLoaded && !isPredictig && !predicted && !resized && (
            <Fragment>
              <button
                href="#"
                onClick={triggerInput}
                className="control__button"
              >
                Find Fish with <br />
                Your Phone Camera
              </button>
              <div className="separator">- OR -</div>
              <button
                href="#"
                onClick={getSamplePhoto}
                className="control__button"
              >
                Use a Sample Photo
              </button>
            </Fragment>
          )}
          {fail && <div>Failed to Find Fish</div>}
          <br />
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
      <canvas className="cropped" ref={cropRef} style={hidden} />
    </div>
  )
}

export default RockfishDemo
