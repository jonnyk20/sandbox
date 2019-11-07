import React, { useState, useRef } from "react"
import html2canvas from "html2canvas"
import YouTube from "react-youtube"

const opts = {
  height: "315",
  width: "560",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
    mute: 1,
  },
}

const overlayStyle = {
  width: 560,
  height: 315,
  backgroundColor: "#87ceeb12",
}

const Frame = () => {
  const frameRef = useRef(null)
  const containerRef = useRef(null)
  const [isClicked, setIsClicked] = useState(false)
  const [vid, setVid] = useState(null)

  const onCapture = hey => {
    console.group("HEY", hey)
    // var blob = request.result;
    // var url = URL.createObjectURL(blob);
  }
  const handleClick = () => {
    console.log(vid.getCurrentTime())
    // setIsClicked(true)
    // const { current: frame } = frameRef

    // // var request = frame.getScreenshot(100, 100)
    // // request.onsuccess = () => onCapture(request)
    // // var request = browser.getScreenshot(100, 100);

    // // request.onsuccess = function() {
    // //   var blob = request.result;
    // //   var url = URL.createObjectURL(blob);
    // // }
    // console.log("FRAMEREF", frame, Object.keys(frame), frame.contentWindow)
    // html2canvas(containerRef.current).then(canvas => {
    //   console.log("CANVAS", canvas)
    //   document.body.appendChild(canvas)
    // })
  }

  const onReady = e => {
    console.log("READY", e)
    setVid(e.target)
  }

  return (
    <div ref={containerRef}>
      <div>Container</div>
      {/* <iframe
        ref={frameRef}
        width="560"
        height="315"
        src="https://www.youtube.com/embed/BcGey64plYA?autoplay=1&controls=0&mute=1&modestbranding=1"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe> */}
      <YouTube videoId="BcGey64plYA" opts={opts} onReady={onReady} />
      <div className="overlay" style={overlayStyle} onClick={handleClick}></div>
      <div>
        <button onClick={handleClick}>{isClicked ? "On" : "Off"}</button>
      </div>
    </div>
  )
}

export default Frame
