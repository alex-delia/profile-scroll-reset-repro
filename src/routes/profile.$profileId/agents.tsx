import { LongContent } from '@/components/LongContent';
import { TabSkeleton } from '@/components/TabSkeleton';
import { delay } from '@/utils/delay';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/profile/$profileId/agents')({
	loader: async () => {
		await delay(900);
		return { tab: 'agents' as const };
	},
	staleTime: 0,
	pendingComponent: () => <TabSkeleton label="Agents" />,
	component: AgentsPage,
});

function AgentsPage() {
	return <LongContent title="Agents" accent="#2ac849" />;
}
