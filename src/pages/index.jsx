import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <div>
      <Link to="/rockfish-demo/">Rockfish Demo</Link>
    </div>
    <div>
      <Link to="/fish-demo-home/">Fish-Demo-Home</Link>
    </div>
    <div>
      <Link to="/turtle-demo/">Turtle Demo</Link>
    </div>
    <div>
      <Link to="/fish-demo/">Fish Demo</Link>
    </div>
    <div>
      <Link to="/fish-mobilenet/">Fish Mobilenet</Link>
    </div>
    <div>
      <Link to="/custom-detection/">Custom Detection</Link>
    </div>
    <div>
      <Link to="/ml-flow/">ML Flow</Link>
    </div>
    <div>
      <Link to="/drag/">Drag</Link>
    </div>
    <div>
      <Link to="/upload/">Upload</Link>
    </div>
    <div>
      <Link to="/detection/">Detection</Link>
    </div>
    <div>
      <Link to="/classification/">Classification</Link>
    </div>
    <div>
      <Link to="/crop/">Crop</Link>
    </div>
  </Layout>
)

export default IndexPage
