import Modal from './Modal';
import Button from './Button';
export default function ConfirmDialog({ open, title = 'Confirm action', message, onConfirm, onCancel, confirmLabel = 'Confirm' }) {
  return <Modal open={open} onClose={onCancel} title={title}>{message && <p>{message}</p>}<div className="dialog-actions"><Button onClick={onCancel} variant="secondary">Cancel</Button><Button onClick={onConfirm}>{confirmLabel}</Button></div></Modal>;
}
