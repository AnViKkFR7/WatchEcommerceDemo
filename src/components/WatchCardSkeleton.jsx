export default function WatchCardSkeleton() {
  return (
    <div className="watch-card">
      <div className="skeleton" style={{ aspectRatio: '4 / 5', borderRadius: 0 }} />
      <div style={{ padding: 'var(--sp-md) var(--sp-md) var(--sp-lg)' }}>
        <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 18, width: '75%', marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 20, width: '35%' }} />
      </div>
    </div>
  );
}
