import React from 'react'
import cn from 'clsx'
import Markdown from 'react-markdown'
import { withStyles, Theme } from '@material-ui/core/styles'

const styles = (theme: Theme) => ({
  root: {
    boxSizing: 'border-box' as 'border-box',
    minWidth: 200,
    maxWidth: 980,
    margin: '0 auto',
    padding: 45,
    [theme.breakpoints.down('md')]: {
      padding: 15,
    },
  },
})

const DocsPage: React.FC<{
  classes?: { [key: string]: string }
  docs: string
}> = ({ classes, docs }) => {
  const className = cn(classes?.root, 'markdown-body')

  return (
    <div className={className}>
      <Markdown source={docs} />
    </div>
  )
}

export default withStyles(styles)(DocsPage)
