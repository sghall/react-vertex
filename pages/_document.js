import React from "react";
import PropTypes from "prop-types";
import Document, { Html, Head, Main, NextScript } from "next/document";
import flush from "styled-jsx/server";

class ReactVertexDoc extends Document {
  render() {
    const { pageContext } = this.props;

    return (
      <Html lang="en" dir="ltr">
        <Head>
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
          <link rel="stylesheet" href="/static/css/markdown.css" />
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
      </Html>
    );
  }
}

ReactVertexDoc.getInitialProps = (ctx) => {
  let pageContext;

  const page = ctx.renderPage((Component) => {
    const PageComponent = (props) => {
      pageContext = props.pageContext;
      return <Component {...props} />;
    };

    PageComponent.propTypes = {
      pageContext: PropTypes.object.isRequired,
    };

    return PageComponent;
  });

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
  };
};

export default ReactVertexDoc;
