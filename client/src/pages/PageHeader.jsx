export default function PageHeader({ title, subtitle }) {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      {subtitle ? <p className="page-sub">{subtitle}</p> : null}
      <style>{`
        .page-header {
          margin-bottom: 1.35rem;
        }
        .page-header h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .page-sub {
          margin: 0.35rem 0 0;
          color: var(--muted);
          font-size: 0.95rem;
          max-width: 52ch;
        }
      `}</style>
    </header>
  );
}
