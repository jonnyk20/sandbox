export default () => {
  document.body.style.overflow = "hidden"
  document.addEventListener(
    "touchmove",
    function(e) {
      console.log("HAAAA")
      e.preventDefault()
    },
    { passive: false }
  )
}
