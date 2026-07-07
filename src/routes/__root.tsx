import { ScrollIndicator } from '@/components/ScrollIndicator';
import { ScrollToTopOnNavigate } from '@/components/ScrollToTopOnNavigate';
import { WorkaroundToggle } from '@/components/WorkaroundToggle';
import { useScrollFix } from '@/context/ScrollFixContext';
import {
	Outlet,
	createRootRouteWithContext,
	useMatches,
} from '@tanstack/react-router';

const scrollToTopOnNavigatePaths = ['/profile/'] as const;

export const Route = createRootRouteWithContext()({
	component: RootShell,
});

function RootShell() {
	const { enabled: workaroundEnabled } = useScrollFix();
	const stableScrollbarGutter = useMatches({
		select: (matches) =>
			matches.some((match) => match.staticData?.stableScrollbarGutter),
	});

	return (
		<div
			className={
				stableScrollbarGutter ? 'scrollbar-gutter-stable' : undefined
			}
		>
			<div className="fixed-controls">
				<ScrollIndicator />
				<WorkaroundToggle />
			</div>
			{workaroundEnabled ? (
				<ScrollToTopOnNavigate paths={scrollToTopOnNavigatePaths} />
			) : null}
			<Outlet />
		</div>
	);
}
