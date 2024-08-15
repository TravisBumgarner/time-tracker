import { Button, Typography } from '@mui/material'
import { useCallback, useContext } from 'react'

import { context } from 'Context'
import { ButtonWrapper } from 'sharedComponents'
import Modal from './Modal'
import { type ModalID } from './RenderModal'

export interface ConfirmationModalProps {
  id: ModalID
  title: string
  body?: string
  confirmationText?: string
  cancelText?: string
  confirmationColor?: 'primary' | 'secondary' | 'warning'
  cancelColor?: 'primary' | 'secondary' | 'warning'
  confirmationVariant?: 'contained' | 'outlined'
  cancelVariant?: 'contained' | 'outlined'
  confirmationCallback?: () => void
  cancelCallback?: () => void
}

const ConfirmationModal = ({ title, body, confirmationCallback, confirmationColor, confirmationVariant, confirmationText, cancelCallback, cancelColor, cancelVariant, cancelText }: ConfirmationModalProps) => {
  const { dispatch } = useContext(context)

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  const handleConfirm = useCallback(() => {
    confirmationCallback?.()
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch, confirmationCallback])

  return (
    <Modal
      title={title}
      showModal={true}
    >
      <Typography variant="body1">{body}</Typography>
      <ButtonWrapper>
        <Button variant={confirmationVariant ?? 'outlined'}
          color={cancelColor ?? 'secondary'} fullWidth onClick={handleCancel}>{cancelText ?? 'Cancel'}</Button>
        <Button variant={confirmationVariant ?? 'contained'} color={confirmationColor ?? 'primary'} fullWidth onClick={handleConfirm}>{confirmationText ?? 'Ok'}</Button>
      </ButtonWrapper>
    </Modal >
  )
}

export default ConfirmationModal
