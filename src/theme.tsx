import { css, experimental_extendTheme as extendTheme, type ThemeOptions } from '@mui/material/styles'
import _ from 'lodash'
import { HEADER_HEIGHT } from './components/Header'

const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: 'Comfortaa',
    h1: {
      fontSize: '1.5rem',
      fontWeight: 400,
      lineHeight: 1.35
    },
    h2: {
      color: 'var(--mui-palette-secondary-main)',
      fontSize: '1.7rem',
      fontWeight: 700,
      lineHeight: 1.35

    },
    h3: {
      color: 'var(--mui-palette-primary-main)',
      fontSize: '1.4rem',
      fontWeight: 400,
      lineHeight: 1.35,
      margin: '0 0 0.5rem 0'
    },
    body1: {
      color: 'var(--mui-palette-text-primary)'
    },
    body2: {
      color: 'var(--mui-palette-text-primary)'
    }
  }
}

const beachThemeOptions = {
  palette: {
    info: {
      main: 'rgb(184, 203, 210)'
    },
    primary: {
      main: 'rgb(76, 125, 165)'
    },
    secondary: {
      main: 'rgb(73, 190, 170)'
    },
    text: {
      primary: 'rgb(92, 94, 95)'
    },
    action: {
      disabled: 'rgb(97, 96, 96)'
    },
    background: {
      default: 'rgb(215, 227, 232)',
      paper: 'rgb(184, 203, 210)'
    },
    warning: {
      main: 'rgb(238, 184, 104)'
    },
    error: {
      main: 'rgb(239, 118, 122)'
    }
  }
}

const retroFutureThemeOptions = {
  palette: {
    primary: {
      main: 'rgb(123, 195, 255)'
    },
    secondary: {
      main: 'rgb(123, 255, 127)'
    },
    text: {
      primary: 'rgb(239, 239, 239)'
    },
    action: {
      disabled: 'rgb(118, 118, 118)'
    },
    background: {
      default: 'rgb(41, 21, 67)',
      paper: 'rgb(113, 42, 107)'
    },
    warning: {
      main: 'rgb(239, 233, 63)'
    },
    error: {
      main: 'rgb(255, 63, 133)'
    }
  }
}

const underTheSeaThemeOptions = {
  palette: {
    primary: {
      main: 'rgb(153, 197, 197)'
    },
    secondary: {
      main: 'rgb(133, 255, 199)'
    },
    text: {
      primary: 'rgb(222, 222, 222)'
    },
    action: {
      disabled: 'rgb(234, 226, 183)'
    },
    background: {
      default: 'rgb(57, 58, 58)',
      paper: 'rgb(62, 118, 111)'
    },
    warning: {
      main: 'rgb(255, 160, 82)'
    },
    error: {
      main: 'rgb(255, 197, 82)'
    }
  }
}

const highContrastThemeOptions = {
  palette: {
    primary: {
      main: 'rgb(86, 105, 188)'
    },
    secondary: {
      main: 'rgb(74, 171, 100)'
    },
    text: {
      primary: 'rgb(0, 0, 0)'
    },
    action: {
      disabled: 'rgb(126, 126, 126)'
    },
    background: {
      default: 'rgb(255, 255, 255)',
      paper: 'rgb(232, 232, 232)'
    },
    warning: {
      main: 'rgb(238, 184, 104)'
    },
    error: {
      main: 'rgb(239, 118, 122)'
    }
  }
}

export const baseTheme = extendTheme(baseThemeOptions)
export const beachTheme = extendTheme(_.merge(baseThemeOptions, beachThemeOptions))
export const highContrastTheme = extendTheme(_.merge(baseThemeOptions, highContrastThemeOptions))
export const retroFutureTheme = extendTheme(_.merge(baseThemeOptions, retroFutureThemeOptions))
export const underTheSeaTheme = extendTheme(_.merge(baseThemeOptions, underTheSeaThemeOptions))

export const BUTTONS_WRAPPER_HEIGHT = 36

export const globalButtonsWrapperCSS = css`
  display: flex;
  justify-content: space-between;
  height: ${BUTTONS_WRAPPER_HEIGHT}px;
  margin-bottom: 1rem;
`

export const globalContentWrapperCSS = css`
  overflow: auto;
  height: calc(100vh - ${BUTTONS_WRAPPER_HEIGHT}px - ${HEADER_HEIGHT}px);
  margin: 0;
`
