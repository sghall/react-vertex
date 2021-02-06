import React from 'react'
import cn from 'clsx'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import { withStyles, Theme } from '@material-ui/core/styles'

const styles = (theme: Theme) => ({
  root: {
    boxSizing: 'border-box',
    minWidth: 200,
    maxWidth: 980,
    margin: '0 auto',
    padding: 45,
    [theme.breakpoints.down('md')]: {
      padding: 15,
    },
  },
})

function DocsPage({ classes, docs }) {
  const className = cn(classes.root, 'markdown-body')

  return (
    <div className={className}>
      <Markdown source={docs} />
    </div>
  )
}

DocsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  docs: PropTypes.string.isRequired,
}

export default withStyles(styles)(DocsPage)
