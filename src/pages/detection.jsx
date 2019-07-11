import React, { Component, createRef } from "react"
// import yolo from "tfjs-yolo"
// import * as tf from "@tensorflow/tfjs"
// // import dog from "../images/dog.jpg"

// class Detection extends Component {
//   state = {
//     uploadPath: null,
//     model: null,
//   }

//   canvasRef = createRef()

//   runInference = async () => {
//     const { current: canvas } = this.canvasRef
//     const ctx = canvas.getContext("2d")
//     console.log("RUN")
//     console.log("Start with tensors: " + tf.memory().numTensors)
//     const boxes = await this.state.model.predict(canvas)
//     console.log(boxes)
//     boxes.map(box => {
//       ctx.lineWidth = 2
//       ctx.fillStyle = "red"
//       ctx.strokeStyle = "red"
//       ctx.rect(box["left"], box["top"], box["width"], box["height"])
//       ctx.fillText(box["class"], box["left"] + 5, box["top"] + 10)
//       ctx.stroke()
//     })
//     console.log("End with tensors: " + tf.memory().numTensors)
//   }

//   onLoad = async () => {
//     const { current: canvas } = this.canvasRef
//     const { img } = this.state
//     const ctx = canvas.getContext("2d")
//     canvas.height = img.height
//     canvas.width = img.width
//     ctx.drawImage(img, 0, 0, img.width, img.height)
//     await this.runInference()
//   }

//   main = async () => {
//     console.log("MAIN")
//     try {
//       const model = await yolo.v2tiny()
//       const img = new Image()
//       img.onload = this.onLoad
//       img.src = this.state.uploadPath // dog
//       this.setState({ model, img }, () => {})
//     } catch (e) {
//       console.error(e)
//     }
//   }

//   handleChange = event => {
//     console.log("EVENT", event.target.files)
//     const { innerWidth: maxWidth, innerHeight: maxHeight } = window
//     const style = {
//       maxWidth,
//       maxHeight,
//     }
//     const uploadPath = URL.createObjectURL(event.target.files[0])
//     this.setState(
//       {
//         uploadPath,
//         style,
//       },
//       this.main
//     )
//   }

//   render() {
//     return (
//       <div>
//         <canvas id="canvas" ref={this.canvasRef}></canvas>
//         <div>Upload here</div>
//         <input
//           type="file"
//           accept="image/*"
//           capture="camera"
//           onChange={this.handleChange}
//         ></input>
//       </div>
//     )
//   }
// }

// export default Detection

export default () => <div>hi</div>
