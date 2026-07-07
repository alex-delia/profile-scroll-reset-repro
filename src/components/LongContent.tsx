type LongContentProps = {
  title: string;
  accent: string;
};

export function LongContent({ title, accent }: LongContentProps) {
  return (
    <main className="tab-content">
      <header className="tab-content__header" style={{ borderColor: accent }}>
        <h2>{title}</h2>
        <p>
          Long scrollable content. Scroll down, switch tabs, and watch whether
          the page resets to the top.
        </p>
      </header>

      <div className="tab-content__markers">
        {Array.from({ length: 24 }, (_, index) => {
          const section = index + 1;
          return (
            <section
              key={section}
              className="tab-content__section"
              style={{ outlineColor: accent }}
            >
              <h3>Section {section}</h3>
              <p>
                Marker block {section}. If you switched tabs while scrolled down
                on another tab, this tab should start at the top — but with the
                bug, you land partway down the page.
              </p>
            </section>
          );
        })}
      </div>
    </main>
  );
}
