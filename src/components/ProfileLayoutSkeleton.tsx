import { TabSkeleton } from '@/components/TabSkeleton';

export function ProfileLayoutSkeleton() {
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
