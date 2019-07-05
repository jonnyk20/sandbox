import React, { Component } from "react"

class Upload extends Component {
  state = {
    file: null,
  }
  handleChange = event => {
    console.log("EVENT", event.target.files)
    const { innerWidth: maxWidth, innerHeight: maxHeight } = window
    const style = {
      maxWidth,
      maxHeight,
    }
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
      style,
    })
  }
  render() {
    const { style, file } = this.state
    return (
      <div>
        <div>Upload here</div>
        <input
          type="file"
          accept="image/*"
          capture="camera"
          onChange={this.handleChange}
        ></input>
        <img src={file} style={style} />
      </div>
    )
  }
}

export default Upload
