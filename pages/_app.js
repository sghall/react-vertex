import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import JssProvider from 'react-jss/lib/JssProvider'
import AppFrame from 'docs/AppFrame'
import getPageContext from 'docs/getPageContext'

class ReactVertexApp extends App {
  constructor(props) {
    super(props)

    this.pageContext = getPageContext()
  }

  pageContext = null

  componentDidMount() {
    const jss = document.querySelector('#jss-server-side')

    if (jss && jss.parentNode) {
      jss.parentNode.removeChild(jss)
    }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Head>
          <title>React Vertex</title>
        </Head>
        <JssProvider
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            <CssBaseline />
            <AppFrame>
              <Component pageContext={this.pageContext} {...pageProps} />
            </AppFrame>
          </MuiThemeProvider>
        </JssProvider>
      </Container>
    )
  }
}

export default ReactVertexApp
