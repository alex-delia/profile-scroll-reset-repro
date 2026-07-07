import type { RegisteredRouter } from '@tanstack/react-router';

export type NavigationScrollEvent = {
  fromLocation?: {
    pathname: string;
    state: { __TSR_index?: number };
  };
  toLocation: {
    pathname: string;
    state: { __TSR_index?: number };
  };
  pathChanged: boolean;
};

export function matchesScrollToTopPath(
  pathname: string,
  paths: readonly string[]
) {
  return paths.some((path) =>
    path.endsWith('/')
      ? pathname.startsWith(path)
      : pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function isForwardNavigation(event: NavigationScrollEvent) {
  const fromIndex = event.fromLocation?.state.__TSR_index ?? 0;
  const toIndex = event.toLocation.state.__TSR_index ?? 0;

  return toIndex > fromIndex || (toIndex === fromIndex && event.pathChanged);
}

export function shouldScrollToTopOnNavigate(
  event: NavigationScrollEvent,
  paths: readonly string[]
) {
  return (
    matchesScrollToTopPath(event.toLocation.pathname, paths) &&
    isForwardNavigation(event)
  );
}

export function scrollWindowToTop(behavior: ScrollBehavior = 'instant') {
  window.scrollTo({ top: 0, left: 0, behavior });
}

/**
 * Workaround from strats.gg: scroll before loaders finish so pending skeletons
 * do not inherit the previous page's scroll position.
 */
export function subscribeScrollToTopOnNavigate(
  router: RegisteredRouter,
  paths: readonly string[]
) {
  return router.subscribe(
    'onBeforeNavigate',
    (event: NavigationScrollEvent) => {
      if (!shouldScrollToTopOnNavigate(event, paths)) {
        return;
      }

      scrollWindowToTop(router.options.scrollRestorationBehavior ?? 'instant');
    }
  );
}
