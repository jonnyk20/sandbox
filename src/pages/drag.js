import React, { Component } from "react"
import { Rnd } from "react-rnd"
import { Link } from "gatsby"
// import "../custom.css"
// import "../ok.css"
import Layout from "../components/layout"
import SEO from "../components/seo"

function anotherOne() {
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

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0",
}

class SecondPage extends Component {
  componentRef = React.createRef()
  state = {
    width: 100,
    height: 100,
    x: 10,
    y: 10,
    isDragged: false,
  }

  componentDidMount() {
    anotherOne()
  }

  render() {
    return (
      <div
        className="wrapper"
        ref={this.componentRef}
        style={{ touchAction: "none" }}
      >
        <Rnd
          style={style}
          size={{ width: this.state.width, height: this.state.height }}
          position={{ x: this.state.x, y: this.state.y }}
          onDragStop={(e, d) => {
            this.setState({ x: d.x, y: d.y })
          }}
          onResize={(e, direction, ref, delta, position) => {
            this.setState({
              width: ref.style.width,
              height: ref.style.height,
              ...position,
            })
          }}
        >
          <div>version 16</div>
        </Rnd>
        <div>{this.state.isDragged ? "dragged" : "not yet"}</div>

        <Link to="/">Go back to the homepage</Link>
      </div>
    )
  }
}

export default SecondPage
