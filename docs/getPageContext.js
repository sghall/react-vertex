import { SheetsRegistry } from 'jss'
import {
  createMuiTheme,
  createGenerateClassName,
} from '@material-ui/core/styles'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
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

if (process.browser && process.env.NODE_ENV === 'development') {
  console.log(theme) // eslint-disable-line
}

function createPageContext() {
  return {
    theme,
    sheetsManager: new Map(),
    sheetsRegistry: new SheetsRegistry(),
    generateClassName: createGenerateClassName(),
  }
}

export default function getPageContext() {
  if (!process.browser) {
    return createPageContext()
  }

  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createPageContext()
  }

  return global.__INIT_MATERIAL_UI__
}
