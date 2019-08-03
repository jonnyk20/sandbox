function freshDot() {
  this.obj = document.createElement("div")
  this.obj.classList.add("box")
  this.obj.style.top = window.innerHeight * Math.random() + "px"
  this.obj.style.left = window.innerWidth * Math.random() + "px"

  document.body.appendChild(this.obj)
}

const scatterDots = () => {
  var dot = []
  for (var i = 0; i < 200; i++) {
    dot.push(new freshDot())
  }
}

const removeDots = () => {
  document.querySelectorAll(".box").forEach(el => {
    el.remove()
  })
}

const initiateScatterDots = () => {
  scatterDots()
  // window.onresize = () => {
  //   removeDots()
  //   scatterDots()
  // }
}
export default initiateScatterDots
