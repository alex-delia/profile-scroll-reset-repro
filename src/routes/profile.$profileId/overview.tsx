import { LongContent } from '@/components/LongContent';
import { TabSkeleton } from '@/components/TabSkeleton';
import { delay } from '@/utils/delay';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/profile/$profileId/overview')({
	loader: async () => {
		await delay(900);
		return { tab: 'overview' as const };
	},
	staleTime: 0,
	preloadStaleTime: 0,
	gcTime: 0,

	pendingComponent: () => <TabSkeleton label="Overview" />,
	component: OverviewPage,
});

function OverviewPage() {
	return <LongContent title="Overview" accent="#f34c61" />;
}
