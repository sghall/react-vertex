import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import { docsPath } from '../config'

interface DemoWrapperProps {
  src: string
}

export const DemoWrapper: React.FC<DemoWrapperProps> = ({ children, src }) => (
  <div style={{ padding: 16 }}>
    <Grid container justify="center">
      <Grid item xs={12} md={10}>
        <a href={`${docsPath}/${src}`}>
          <Button size="small">Demo Source</Button>
        </a>
        {children}
      </Grid>
    </Grid>
  </div>
)
