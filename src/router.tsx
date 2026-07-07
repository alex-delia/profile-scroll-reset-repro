import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export const router = createRouter({
	routeTree,
	scrollRestoration: true,
	defaultPendingMs: 0,
	defaultPendingMinMs: 2000,
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}

	interface StaticDataRouteOption {
		stableScrollbarGutter?: boolean;
	}
}
