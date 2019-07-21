export default () => {
  document.body.style.overflow = "hidden"
  console.log("Another one")
  document.addEventListener(
    "touchmove",
    function(e) {
      console.log("HAAAA")
      e.preventDefault()
    },
    { passive: false }
  )
}
