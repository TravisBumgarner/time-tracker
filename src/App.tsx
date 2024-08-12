import CssBaseline from '@mui/material/CssBaseline'; // https://stackoverflow.com/questions/74542488/react-material-ui-createtheme-default-is-not-a-function

import { Box, Experimental_CssVarsProvider, css } from '@mui/material'
import { useContext, useEffect, useMemo } from 'react'

import Context, { context } from 'Context'
import RenderModal from 'modals'
import { baseTheme, beachTheme, highContrastTheme, retroFutureTheme, underTheSeaTheme } from 'theme'
import { Header, Message, Router } from './components'
import { EColorTheme } from './types'

import { useIPCAsyncMessageEffect } from './hooks/useIPCAsyncMessageEffect'
import { setupAutomatedBackup } from './modals/Settings'

const App = () => {
  const { state, dispatch } = useContext(context)
  useEffect(() => {
    setupAutomatedBackup(state.settings.backupInterval)
  }, [state.settings.backupInterval])
  useIPCAsyncMessageEffect(dispatch)

  const theme = useMemo(() => {
    switch (state.settings.colorTheme) {
      case EColorTheme.BEACH: {
        return beachTheme
      }
      case EColorTheme.RETRO_FUTURE: {
        return retroFutureTheme
      }
      case EColorTheme.UNDER_THE_SEA: {
        return underTheSeaTheme
      }
      case EColorTheme.CONTRAST: {
        return highContrastTheme
      }
      default: {
        return baseTheme
      }
    }
  }, [state.settings.colorTheme])

  return (
    <Experimental_CssVarsProvider theme={theme}>
      <CssBaseline />
      <Box css={appWrapperCSS}>
        <Message />
        <Header />
        <Router />
      </Box>
      <RenderModal />
    </Experimental_CssVarsProvider>
  )
}

const appWrapperCSS = css`
  padding: 0 0.5rem 0.5rem 0.5rem;
  max-width: 1200px;
  margin:0px auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;
`

const InjectedApp = () => {
  return (
    <Context>
      <App />
    </Context>
  )
}

export default InjectedApp
