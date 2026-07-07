import { useEffect, useState } from 'react';

export function ScrollIndicator() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="scroll-indicator" aria-live="polite">
      scrollY: <strong>{Math.round(scrollY)}px</strong>
    </div>
  );
}
