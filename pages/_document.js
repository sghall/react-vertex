import React from 'react'
import PropTypes from 'prop-types'
import Document, { Head, Main, NextScript } from 'next/document'
import flush from 'styled-jsx/server'

class ReactVertexDoc extends Document {
  render() {
    const { pageContext } = this.props

    return (
      <html lang="en" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="minimum-scale=1, user-scalable=no, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          <meta
            name="theme-color"
            content={pageContext.theme.palette.primary.main}
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />
          <link
            rel="icon"
            type="image/x-icon"
            href="/static/favicon/favicon.ico"
          />
          <link
            rel="stylesheet"
            href="/static/css/markdown.css"
          />
          <style jsx="true" global="true">{`
            body {
              overscroll-behavior: none;
            }
          `}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

ReactVertexDoc.getInitialProps = ctx => {
  let pageContext

  const page = ctx.renderPage(Component => {
    const PageComponent = props => {
      pageContext = props.pageContext
      return <Component {...props} />
    }

    PageComponent.propTypes = {
      pageContext: PropTypes.object.isRequired,
    }

    return PageComponent
  })

  return {
    ...page,
    pageContext,
    styles: (
      <React.Fragment>
        <style
          id="jss-server-side"
          dangerouslySetInnerHTML={{
            __html: pageContext.sheetsRegistry.toString(),
          }}
        />
        {flush() || null}
      </React.Fragment>
    ),
  }
}

export default ReactVertexDoc
