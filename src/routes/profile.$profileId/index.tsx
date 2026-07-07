import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/profile/$profileId/')({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: '/profile/$profileId/overview',
			params,
		});
	},
});
