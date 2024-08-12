import CloseIcon from '@mui/icons-material/CloseOutlined'
import { IconButton, Tooltip, Typography, css } from '@mui/material'
import Box from '@mui/material/Box'
import MUIModal from '@mui/material/Modal'
import { useCallback, useContext, type FC } from 'react'

import { context } from 'Context'

interface ActiveModal {
  children: any
  showModal: boolean
  title: string
  disableEscapeKeyDown?: boolean
  disableBackdropClick?: boolean
}

export const MODAL_MAX_HEIGHT = 800

const Modal: FC<ActiveModal> = ({ children, title, disableEscapeKeyDown, disableBackdropClick }) => {
  const { dispatch } = useContext(context)

  const handleClose = useCallback((event?: any, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick' && disableBackdropClick) return

    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch, disableBackdropClick])

  return (
    <MUIModal
      open={true}
      onClose={handleClose}
      disableEscapeKeyDown={disableEscapeKeyDown}
      disableRestoreFocus={true}
      style={{ backgroundColor: 'var(--mui-palette-background-default)' }}
      css={muiModalCSSWrapper}
    >
      <Box css={wrapperCSS}>
        <Box css={headerWrapperCSS}>
          <Typography variant="h2">{title}</Typography>
          <Tooltip title="Close">
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
        {children}
      </Box>
    </MUIModal >
  )
}

const wrapperCSS = css`
  width: 600px;
  background-color: var(--mui-palette-background-default);
  border-radius: 1rem;
  box-shadow: 24;
  overflow: auto;
  padding: 2rem;
  box-sizing: border-box;
  max-height: 100%;
  overflow: auto;
`

const headerWrapperCSS = css`
  display: flex;
  justify-content: space-between;
`

const muiModalCSSWrapper = css`
  max-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`

export default Modal
