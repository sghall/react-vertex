import React from "react";
import App from "next/app";
import Head from "next/head";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import JssProvider from "react-jss/lib/JssProvider";
import AppFrame from "docs/AppFrame";
import getPageContext from "docs/getPageContext";

class ReactVertexApp extends App {
  constructor(props) {
    super(props);

    this.pageContext = getPageContext();
  }

  pageContext = null;

  componentDidMount() {
    const jss = document.querySelector("#jss-server-side");

    if (jss && jss.parentNode) {
      jss.parentNode.removeChild(jss);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>React Vertex</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="minimum-scale=1, user-scalable=no, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
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
      </>
    );
  }
}

export default ReactVertexApp;
