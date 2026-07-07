import { subscribeScrollToTopOnNavigate } from '@/utils/scrollToTopOnNavigation';
import { useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';

export function ScrollToTopOnNavigate({
  paths,
}: {
  paths: readonly string[];
}) {
  const router = useRouter();

  useEffect(
    () => subscribeScrollToTopOnNavigate(router, paths),
    [router, paths]
  );

  return null;
}
