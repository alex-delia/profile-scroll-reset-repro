import { LongContent } from '@/components/LongContent';
import { TabSkeleton } from '@/components/TabSkeleton';
import { delay } from '@/utils/delay';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/profile/$profileId/insights')({
	loader: async () => {
		await delay(900);
		return { tab: 'insights' as const };
	},
	staleTime: 0,
	pendingComponent: () => <TabSkeleton label="Insights" />,
	component: InsightsPage,
});

function InsightsPage() {
	return <LongContent title="Insights" accent="#5b8def" />;
}
