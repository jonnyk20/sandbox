import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Home</h1>
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
