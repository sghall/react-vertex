import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

const basePath = 'https://github.com/sghall/react-vertex/tree/master'

const DemoWrapper = ({ children, src }) => (
  <div style={{ padding: 16 }}>
    <Grid container justify="center" spacing={8}>
      <Grid item xs={12} md={8}>
        <a href={`${basePath}/${src}`}>
          <Button size="small">Demo Source</Button>
        </a>
        {children}
      </Grid>
    </Grid>
  </div>
)

DemoWrapper.propTypes = {
  src: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

DemoWrapper.defaultProps = {
  src: '',
}

export default DemoWrapper
