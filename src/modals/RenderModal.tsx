import { context } from 'Context'
import { useContext, type FC } from 'react'
import ConfirmationModal, { type ConfirmationModalProps } from './ConfirmationModal'
import SettingsModal from './Settings'

export enum ModalID {
  BACKUP_FAILURE_MODAL = 'BACKUP_FAILURE_MODAL',
  SETTINGS_MODAL = 'SETTINGS_MODAL',
  CONFIRMATION_MODAL = 'CONFIRMATION_MODAL',
}

export type ActiveModal =
  | { id: ModalID.BACKUP_FAILURE_MODAL }
  | { id: ModalID.SETTINGS_MODAL }
  | { id: ModalID.CONFIRMATION_MODAL } & ConfirmationModalProps

const RenderModal: FC = () => {
  const { state } = useContext(context)

  if (!state.activeModal?.id) return null

  switch (state.activeModal.id) {
    case ModalID.SETTINGS_MODAL:
      return <SettingsModal />
    case ModalID.CONFIRMATION_MODAL:
      return < ConfirmationModal
        {...state.activeModal}
      />
    default:
      return null
  }
}

export default RenderModal
