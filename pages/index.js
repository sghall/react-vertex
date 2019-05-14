import React, { Fragment } from 'react'
import Markdown from 'react-markdown'
import docs from '../README.md'

function IndexPage() {
  return (
    <Fragment>
      <div className="markdown-body" style={{ fontFamily: 'Roboto, Arial' }}>
        <Markdown source={docs} />
      </div>
    </Fragment>
  )
}

export default IndexPage
