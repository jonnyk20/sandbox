import React from "react"

class ProgressBarExample extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      percentage: 0,
    }
    this.nextStep = this.nextStep.bind(this)
  }

  nextStep() {
    if (this.state.percentage === 100) return
    this.setState({ percentage: this.state.percentage + 20 })
  }

  render() {
    return (
      <div>
        <h2> A React Progress Bar </h2>
        <ProgressBar percentage={this.state.percentage} />

        <div style={{ marginTop: "20px" }}>
          <button onClick={this.nextStep}>Next Step</button>
        </div>

        {/* Added for convenience of viewing */}
        <div
          style={{ marginTop: "10px", color: "blue", marginBottom: "15px" }}
          onClick={() => this.setState({ percentage: 0 })}
        >
          Reset
        </div>

        <a
          href="https://www.youtube.com/watch?v=GZ4d3HEn9zg"
          target="_blank"
          style={{ marginTop: "20px" }}
        >
          Check out my free React video tutorial
        </a>
      </div>
    )
  }
}

const ProgressBar = props => {
  return (
    <div className="wrap">
      <div className="bar bar-progress">
        <Filler percentage={props.percentage} />
      </div>
      <div className="bar bar-border"></div>
    </div>
  )
}

const Filler = props => {
  return <div className="filler" style={{ width: `${props.percentage}%` }} />
}

ReactDOM.render(<ProgressBarExample />, document.querySelector("#app"))

// Other React Stuff

// Check out my free youtube video on how to build a thumbnail gallery in react
// https://www.youtube.com/watch?v=GZ4d3HEn9zg

// https://medium.com/@ItsMeDannyZ/build-an-image-slider-with-react-es6-264368de68e4

// Follow me on Github!
// https://github.com/DZuz14

/*
@import url('https://fonts.googleapis.com/css?family=Montserrat');

html, body {
  font-family: 'Montserrat', sans-serif;
}



.wrap {
   position: relative;
  height: 20px;
  width: 350px;
  border-radius: 50px;
}

.bar {
  position: absolute;
  height: 20px;
  width: 350px;
  border-radius: 50px;
  border: solid 1px transparent;
}

.bar-border {
  border: 1px solid #333;
}


.filler {
  background: #1DA598;
  height: 100%;
  border-radius: inherit;
  transition: width .2s ease-in;
}

button {
  margin-right: 10px;
  padding: 7px 12px;
  font-size: 14px;
  background: #d14836;
  color: white;
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
  outline: 0;
}











*/
