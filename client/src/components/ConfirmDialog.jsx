export default function ConfirmDialog({
  open,
  title = 'Confirm',
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  danger = true,
}) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-title">{title}</h3>
        <p className="modal-msg">{message}</p>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
        <style>{`
          .modal-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 1rem;
          }
          .modal-card {
            background: var(--surface);
            border-radius: var(--radius);
            padding: 1.25rem 1.35rem;
            max-width: 420px;
            width: 100%;
            box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
          }
          .modal-card h3 {
            margin: 0 0 0.5rem;
            font-size: 1.1rem;
          }
          .modal-msg {
            margin: 0 0 1rem;
            color: var(--muted);
            font-size: 0.95rem;
          }
          .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.5rem;
          }
        `}</style>
      </div>
    </div>
  );
}
