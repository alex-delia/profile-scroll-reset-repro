import { ScrollIndicator } from '@/components/ScrollIndicator';
import { ScrollToTopOnNavigate } from '@/components/ScrollToTopOnNavigate';
import { TabSkeleton } from '@/components/TabSkeleton';
import { LongContent } from '@/components/LongContent';
import { delay } from '@/utils/delay';
import {
  Link,
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
  useMatches,
} from '@tanstack/react-router';

const scrollToTopOnNavigatePaths = ['/profile/'] as const;

const rootRoute = createRootRouteWithContext()({
  component: RootShell,
});

function RootShell() {
  const stableScrollbarGutter = useMatches({
    select: (matches) =>
      matches.some((match) => match.staticData?.stableScrollbarGutter),
  });

  const useWorkaround =
    typeof window !== 'undefined' &&
    (new URLSearchParams(window.location.search).get('fix') === 'true' ||
      sessionStorage.getItem('scroll-fix') === 'true');

  return (
    <div
      className={stableScrollbarGutter ? 'scrollbar-gutter-stable' : undefined}
    >
      <ScrollIndicator />
      {useWorkaround ? (
        <ScrollToTopOnNavigate paths={scrollToTopOnNavigatePaths} />
      ) : null}
      <Outlet />
    </div>
  );
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

function HomePage() {
  return (
    <div className="page home-page">
      <header className="site-header">
        <h1>Profile scroll reset repro</h1>
        <p>
          Minimal reproduction of the strats.gg Valorant profile tab scroll
          issue.
        </p>
      </header>

      <section className="home-page__intro">
        <h2>Setup</h2>
        <ul>
          <li>TanStack Router with <code>scrollRestoration: true</code></li>
          <li>
            Persistent profile layout + tab links (Overview / Insights / Agents)
          </li>
          <li>
            Slow loaders with <code>pendingComponent</code> skeletons, like
            profile pages
          </li>
          <li>
            <code>stableScrollbarGutter</code> on profile routes (matches
            strats.gg)
          </li>
        </ul>
      </section>

      <section className="home-page__steps">
        <h2>Reproduce</h2>
        <ol>
          <li>Open a profile below.</li>
          <li>Scroll down on Overview.</li>
          <li>Click Insights or Agents.</li>
          <li>
            Bug: scroll position is preserved instead of resetting to the top.
            The skeleton and loaded content appear partway down the page.
          </li>
        </ol>
        <p>
          Also try: scroll this home page down, then open a profile — the
          skeleton briefly inherits the home page scroll offset.
        </p>
      </section>

      <section className="home-page__links">
        <Link
          to="/profile/$profileId/overview"
          params={{ profileId: 'Player#TAG' }}
          className="button"
        >
          Open Player#TAG profile
        </Link>
        <Link
          to="/profile/$profileId/overview"
          params={{ profileId: 'Other#NA1' }}
          className="button button--secondary"
        >
          Open Other#NA1 profile
        </Link>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => {
            sessionStorage.setItem('scroll-fix', 'true');
            window.location.reload();
          }}
        >
          Enable workaround
        </button>
      </section>

      <div className="home-page__filler">
        {Array.from({ length: 12 }, (_, index) => (
          <section key={index} className="home-page__filler-block">
            <h3>Home filler {index + 1}</h3>
            <p>Scroll down here before opening a profile to see the second bug.</p>
          </section>
        ))}
      </div>
    </div>
  );
}

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/$profileId',
  staticData: {
    stableScrollbarGutter: true,
  },
  component: ProfileLayout,
  pendingComponent: ProfileLayoutSkeleton,
  loader: async () => {
    await delay(400);
    return null;
  },
});

function ProfileLayoutSkeleton() {
  return (
    <div className="page profile-page">
      <div className="profile-header profile-header--skeleton">
        <div className="profile-header__avatar skeleton-block" />
        <div className="profile-header__meta">
          <div className="skeleton-line skeleton-line--lg" />
          <div className="skeleton-line skeleton-line--sm" />
        </div>
      </div>
      <nav className="profile-tabs profile-tabs--skeleton">
        {['Overview', 'Insights', 'Agents'].map((tab) => (
          <div key={tab} className="skeleton-pill" />
        ))}
      </nav>
      <TabSkeleton label="profile layout" />
    </div>
  );
}

const profileIndexRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: '/',
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/profile/$profileId/overview',
      params,
    });
  },
});

const syncRoute = createRoute({
  getParentRoute: () => profileRoute,
  id: '_sync',
  loader: async () => {
    await delay(600);
    return { syncedAt: Date.now() };
  },
  staleTime: 5 * 60 * 1000,
  pendingMs: 0,
  pendingMinMs: 0,
  pendingComponent: SyncPending,
  component: SyncOutlet,
});

function SyncPending() {
  return <SyncOutlet />;
}

function SyncOutlet() {
  return <Outlet />;
}

const overviewRoute = createRoute({
  getParentRoute: () => syncRoute,
  path: '/overview',
  loader: async () => {
    await delay(900);
    return { tab: 'overview' as const };
  },
  pendingComponent: () => <TabSkeleton label="Overview" />,
  component: OverviewPage,
});

const insightsRoute = createRoute({
  getParentRoute: () => syncRoute,
  path: '/insights',
  loader: async () => {
    await delay(900);
    return { tab: 'insights' as const };
  },
  pendingComponent: () => <TabSkeleton label="Insights" />,
  component: InsightsPage,
});

const agentsRoute = createRoute({
  getParentRoute: () => syncRoute,
  path: '/agents',
  loader: async () => {
    await delay(900);
    return { tab: 'agents' as const };
  },
  pendingComponent: () => <TabSkeleton label="Agents" />,
  component: AgentsPage,
});

const tabs = [
  { to: '/profile/$profileId/overview' as const, label: 'Overview' },
  { to: '/profile/$profileId/insights' as const, label: 'Insights' },
  { to: '/profile/$profileId/agents' as const, label: 'Agents' },
];

function ProfileLayout() {
  const { profileId } = profileRoute.useParams();

  return (
    <div className="page profile-page">
      <header className="profile-header">
        <div className="profile-header__avatar">{profileId[0]}</div>
        <div className="profile-header__meta">
          <h1>{profileId.split('#')[0]}</h1>
          <p>#{profileId.split('#')[1]}</p>
        </div>
        <Link to="/" className="profile-header__back">
          ← Home
        </Link>
      </header>

      <nav className="profile-tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            params={{ profileId }}
            preload="intent"
            activeOptions={{ exact: true }}
            className="profile-tab"
          >
            {({ isActive }) => (
              <span className={isActive ? 'profile-tab--active' : undefined}>
                {tab.label}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}

function OverviewPage() {
  return <LongContent title="Overview" accent="#f34c61" />;
}

function InsightsPage() {
  return <LongContent title="Insights" accent="#5b8def" />;
}

function AgentsPage() {
  return <LongContent title="Agents" accent="#2ac849" />;
}

const routeTree = rootRoute.addChildren([
  indexRoute,
  profileRoute.addChildren([
    profileIndexRoute,
    syncRoute.addChildren([overviewRoute, insightsRoute, agentsRoute]),
  ]),
]);

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
  defaultPendingMs: 750,
  defaultPendingMinMs: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }

  interface StaticDataRouteOption {
    stableScrollbarGutter?: boolean;
  }
}
