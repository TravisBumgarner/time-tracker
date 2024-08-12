import { Button, Typography } from '@mui/material'
import { useCallback, useContext } from 'react'

import { context } from 'Context'
import { ButtonWrapper } from 'sharedComponents'
import Modal from './Modal'
import { type ModalID } from './RenderModal'

export interface ConfirmationModalProps {
  id: ModalID
  title: string
  body: string
  confirmationCallback?: () => void
  cancelCallback?: () => void
}

const ConfirmationModal = ({ title, body, confirmationCallback }: ConfirmationModalProps) => {
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
        <Button variant='contained'
          color="secondary" fullWidth onClick={handleCancel}>Cancel</Button>
        <Button variant='contained' fullWidth onClick={handleConfirm}>Ok</Button>
      </ButtonWrapper>
    </Modal >
  )
}

export default ConfirmationModal
