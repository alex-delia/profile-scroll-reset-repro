export function TabSkeleton({ label }: { label: string }) {
  return (
    <div className="tab-skeleton" data-testid="tab-skeleton">
      <p className="tab-skeleton__label">Loading {label}…</p>
      <div className="tab-skeleton__blocks">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="tab-skeleton__block" />
        ))}
      </div>
    </div>
  );
}
