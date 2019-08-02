const runInference = async () => {

  // Load Model
  const model = await tf.loadGraphModel(MODEL_URL)
  
  // Get input tensors from DOM Image
  const img = document.getElementById("img")
  const tfImg = tf.browser.fromPixels(img).toFloat()
  
  // Resize image to fit model input
  let input = tf.image.resizeBilinear(tfImg, [224, 224])

  // Normalize the image
  const offset = tf.scalar(127.5)
  input = input.sub(offset).div(offset)

  // Run inference
  const results = await model.executeAsync(input.expandDims(0))
  return results;
}