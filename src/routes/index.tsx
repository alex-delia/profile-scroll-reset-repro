import { WorkaroundToggle } from '@/components/WorkaroundToggle';
import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: HomePage,
});

function HomePage() {
	return (
		<div className="page home-page">
			<header className="site-header">
				<h1>Profile scroll reset repro</h1>
				<p>
					Minimal reproduction of the strats.gg Valorant profile tab
					scroll issue.
				</p>
			</header>

			<section className="home-page__intro">
				<h2>Setup</h2>
				<ul>
					<li>
						TanStack Router with{' '}
						<code>scrollRestoration: true</code>
					</li>
					<li>
						Persistent profile layout + tab links (Overview /
						Insights / Agents)
					</li>
					<li>
						Slow loaders with <code>pendingComponent</code>{' '}
						skeletons, like profile pages
					</li>
					<li>
						<code>stableScrollbarGutter</code> on profile routes
						(matches strats.gg)
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
						Bug: scroll position is preserved instead of resetting
						to the top. The skeleton and loaded content appear
						partway down the page.
					</li>
				</ol>
				<p>
					Also try: scroll this home page down, then open a profile —
					the skeleton briefly inherits the home page scroll offset.
				</p>
			</section>

			<section className="home-page__links">
				<WorkaroundToggle className="button button--ghost" />
			</section>

			<div className="home-page__filler">
				{Array.from({ length: 12 }, (_, index) => (
					<section key={index} className="home-page__filler-block">
						<h3>Home filler {index + 1}</h3>
						<p>
							Scroll down here before opening a profile to see the
							second bug.
						</p>
					</section>
				))}
			</div>

			<section className="home-page__main-link">
				<h2>Main reproduction link</h2>
				<p>
					This is intentionally far down to make it easier to repro
					preserving an offscreen scroll position.
				</p>
				<Link
					to="/profile/$profileId/overview"
					params={{ profileId: 'Player#TAG' }}
					className="button"
				>
					Open Player#TAG profile
				</Link>
			</section>
		</div>
	);
}
