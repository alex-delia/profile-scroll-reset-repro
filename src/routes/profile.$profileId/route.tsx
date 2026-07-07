import { delay } from '@/utils/delay';
import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { ProfileLayoutSkeleton } from '@/components/ProfileLayoutSkeleton';

const tabs = [
	{ to: '/profile/$profileId/overview' as const, label: 'Overview' },
	{ to: '/profile/$profileId/insights' as const, label: 'Insights' },
	{ to: '/profile/$profileId/agents' as const, label: 'Agents' },
];

export const Route = createFileRoute('/profile/$profileId')({
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

function ProfileLayout() {
	const { profileId } = Route.useParams();

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
							<span
								className={
									isActive ? 'profile-tab--active' : undefined
								}
							>
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
