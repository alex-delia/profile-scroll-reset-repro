import { useScrollFix } from '@/context/ScrollFixContext';

type WorkaroundToggleProps = {
	className?: string;
};

export function WorkaroundToggle({ className }: WorkaroundToggleProps) {
	const { enabled, toggle } = useScrollFix();

	return (
		<button
			type="button"
			className={className ?? 'workaround-toggle'}
			onClick={toggle}
			aria-pressed={enabled}
		>
			Workaround: {enabled ? 'on' : 'off'}
		</button>
	);
}
