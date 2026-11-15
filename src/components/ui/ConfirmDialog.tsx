import { buttonClass } from './buttonStyles'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

// Onay penceresi
export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} description={description} onClose={onCancel}>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className={buttonClass('secondary')}
          onClick={onCancel}
          autoFocus
        >
          Vazgeç
        </button>
        <button
          type="button"
          className={buttonClass('danger')}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
