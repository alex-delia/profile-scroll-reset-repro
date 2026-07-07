# Profile scroll reset reproduction

Minimal reproduction of the scroll position bug on [strats.gg](https://strats.gg) Valorant profile pages.

## What this reproduces

On strats.gg, profile pages use:

- TanStack Router with `scrollRestoration: true`
- A persistent profile layout with tab links (`Overview`, `Insights`, `Agents`, etc.)
- Child routes with async loaders and `pendingComponent` skeletons
- `stableScrollbarGutter` on profile routes

### Bug 1: Entering a profile inherits previous page scroll

1. On the home page, scroll down (past the filler sections).
2. Click "Open profile".
3. Watch the fixed `scrollY` indicator in the top-right.

**Expected:** profile skeleton/content starts at the top (`scrollY: 0`).

**Actual:** the skeleton appears at the home page scroll offset for several hundred milliseconds. Scroll restoration only runs after loaders finish (`onRendered`), so pending UI inherits the previous scroll position.

### Bug 2: Tab switches can show pending UI off-screen

1. Open a profile tab (e.g. Overview).
2. Scroll down.
3. Click another tab (e.g. Insights).

In production/SSR this is more pronounced; in this SPA repro tab switches often reset immediately, but the same loader timing applies when first entering profile routes or when loaders take longer.

## Run locally

```bash
npm install
npm run dev
```

## StackBlitz

1. Push this repo to GitHub.
2. Open [stackblitz.com](https://stackblitz.com) → **Import from GitHub**.
3. Select this repository.
4. StackBlitz should detect Vite and run `npm install` + `npm run dev` automatically.

Or use the "Open in StackBlitz" badge after publishing the repo.

## Try the workaround

Append `?fix=true` to the URL (or click "Enable workaround" on the home page).

This enables the `onBeforeNavigate` scroll-to-top helper from strats.gg, which scrolls before loaders finish so skeletons do not inherit the previous scroll offset.

## Key files

| File | Purpose |
| --- | --- |
| `src/router.tsx` | Router setup mirroring profile layout + tabs + loaders |
| `src/components/ScrollIndicator.tsx` | Live `scrollY` readout |
| `src/utils/scrollToTopOnNavigation.ts` | Optional workaround from strats.gg stash |
| `src/components/TabSkeleton.tsx` | Pending state skeleton |

## Related strats.gg code

- `apps/web/src/router.tsx` — `scrollRestoration: true`
- `apps/web/src/routes/_header/valorant/profile.$profileId/route.tsx` — layout + tabs
- `apps/web/src/routes/_header/valorant/profile.$profileId/_sync.tsx` — sync loader parent
- `apps/web/src/routes/__root.tsx` — `stableScrollbarGutter`
