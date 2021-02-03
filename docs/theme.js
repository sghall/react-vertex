import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      light: '#5b5c5e',
      main: '#323334',
      dark: '#0a0c0d',
      contrastText: '#fff',
    },
    secondary: {
      light: '#75e0e3',
      main: '#3daeb1',
      dark: '#007e82',
      contrastText: '#fff',
    },
  },
})

export default theme
