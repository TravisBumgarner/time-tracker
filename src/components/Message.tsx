import { useContext } from 'react'
import { Alert as AlertMUI, Box, Button } from '@mui/material'
import { css } from '@emotion/react'

import { context } from 'Context'
import { ButtonWrapper } from 'sharedComponents'

const Alert = () => {
  const { state, dispatch } = useContext(context)

  const handleCancel = () => {
    state.message?.cancelCallback?.()
    dispatch({ type: 'DELETE_MESSAGE' })
  }

  const handleConfirm = () => {
    state.message?.confirmCallback?.()
    dispatch({ type: 'DELETE_MESSAGE' })
  }

  if (!state.message) return null

  return (
    <Box css={AlertPositionerCSS}>
      <AlertMUI
        variant='filled'
        css={AlertMuiCSS}
        action={
          <ButtonWrapper isHorizontal>
            {state.message.cancelCallbackText
              ? <Button color="secondary" variant="outlined" size="small" onClick={handleCancel}>
                {state.message.cancelCallbackText ? state.message.cancelCallbackText : 'Cancel'}
              </Button>
              : null
            }
            <Button color="primary" size="small" variant="outlined" onClick={handleConfirm}>
              {state.message.confirmCallbackText ? state.message.confirmCallbackText : 'Close'}
            </Button>
          </ButtonWrapper>
        }
        color="info"
      >{state.message.text}</AlertMUI>
    </Box >
  )
}

export default Alert

const AlertMuiCSS = css`
  display: flex;
  align-items: center;
`

const AlertPositionerCSS = css`
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
`
