import React, { Component } from "react"
import PropTypes from "prop-types"
import { Rnd } from "react-rnd"

const enable = {
  bottom: false,
  bottomLeft: false,
  bottomRight: false,
  left: false,
  right: false,
  top: false,
  topLeft: false,
  topRight: false,
}

class DragBox extends Component {
  state = {
    width: 200,
    height: 250,
    x: 0,
    y: 50,
    isDragged: false,
  }

  render() {
    return (
      <Rnd
        className="drag-box drag-box--control"
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
        enableResizing={enable}
      >
        {this.props.children}
      </Rnd>
    )
  }
}

DragBox.propTypes = {
  children: PropTypes.node,
}

DragBox.defaultProps = {
  children: <div />,
}

export default DragBox
