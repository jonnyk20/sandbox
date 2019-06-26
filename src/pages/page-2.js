import React, { Component } from "react"
import { Rnd } from "react-rnd"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import preventScrollRefresh from "../utils/preventScrollRefresh"

function preventPullToRefresh(element) {
  var prevent = false
  const target = document.querySelector(element)
  console.log("target", target)
  target.addEventListener("touchstart", function(e) {
    if (e.touches.length !== 1) {
      return
    }

    var scrollY =
      window.pageYOffset ||
      document.body.scrollTop ||
      document.documentElement.scrollTop
    prevent = scrollY === 0
  })

  target.addEventListener("touchmove", function(e) {
    if (prevent) {
      prevent = false
      e.preventDefault()
    }
  })
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
  handleWheel = e => {
    e.preventDefault()
  }
  componentDidMount() {
    console.log("Mounted")
    preventScrollRefresh()
    preventPullToRefresh(".wrapper") // pas
    if (this.componentRef.current) {
      this.componentRef.current.addEventListener("wheel", this.handleWheel)
    }
  }
  handleDrag = e => {
    const { isDragged } = this.state
    e.preventDefault()
    e.stopImmediatePropagation()
    if (!isDragged) {
      this.setState({
        isDragged: true,
      })
    }
  }
  render() {
    return (
      <div className="wrapper" ref={this.componentRef}>
        <Rnd
          onDrag={this.handleDrag}
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
          Rnd
        </Rnd>
        <div>{this.state.isDragged ? "dragged" : "not yet"}</div>
        <div>version 8</div>
        <Link to="/">Go back to the homepage</Link>
      </div>
    )
  }
}

export default SecondPage
