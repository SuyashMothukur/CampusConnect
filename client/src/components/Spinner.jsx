export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <span className="spinner" aria-hidden />
      <span className="spinner-label">{label}</span>
      <style>{`
        .spinner-wrap {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 1.25rem;
          color: var(--muted);
          font-size: 0.9rem;
        }
        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
