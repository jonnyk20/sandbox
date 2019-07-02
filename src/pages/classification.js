import React, { Component } from "react"
import * as tf from "@tensorflow/tfjs"
import * as mobilenet from "@tensorflow-models/mobilenet"
import dog from "../images/dog.jpg"
import { getRegisteredOp } from "@tensorflow/tfjs-converter/dist/src/operations/custom_op/register"

const runMobilenet = async () => {
  const img = document.getElementById("img")
  // // Load the model.
  const model = await mobilenet.load()

  // Classify the image.
  const predictions = await model.classify(img)

  console.log("Predictions: ")
  console.log(predictions)
}

function preprocess(img) {
  let tensor = tf.fromPixels(img).toFloat()

  const offset = tf.scalar(127.5)
  // Normalize the image
  const normalized = tensor.sub(offset).div(offset)

  //We add a dimension to get a batch shape [1,224,224,3]
  const batched = normalized.expandDims(0)
  return batched
}

// function predict(input) {
//   //get predictions
//   let pred = mobilenet.predict(input)
//   //retreive the highest probability class label
//   let idx = pred.argMax().buffer().values[0]
//   return idx
// }

const getFinal = results => {
  let predictionList = []
  for (let i = 0; i < results.length; i++) {
    predictionList.push({ value: results[i], index: i })
  }
  predictionList = predictionList.sort((a, b) => {
    return b.value - a.value
  })

  console.log("HAI", predictionList)
}

const runCustom = async () => {
  const MODEL_URL =
    "https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2_1.0_224/model.json"
  const model = await tf.loadGraphModel(MODEL_URL)
  const img = document.getElementById("img")
  const tfImg = tf.browser.fromPixels(img).toFloat()
  let input = tf.image.resizeBilinear(tfImg, [224, 224])
  const offset = tf.scalar(127.5)
  // Normalize the image
  input = input.sub(offset).div(offset)

  const global = input.expandDims(0)
  console.log(global.shape)
  const results = model.predict(global)
  const ok = await results.buffer()

  console.log("OK", ok.values)
  // const best = results.buffer() //.buffer().values[0]
  // const x = await best.buffer()
  // console.log("BEST", x.values)
  getFinal(ok.values)
}

class Classification extends Component {
  handleLoad = async () => {
    // runMobilenet()
    runCustom()
  }
  render() {
    return (
      <div>
        <div>Classification</div>
        <div>
          <img src={dog} onLoad={this.handleLoad} id="img" />
        </div>
      </div>
    )
  }
}

export default Classification
