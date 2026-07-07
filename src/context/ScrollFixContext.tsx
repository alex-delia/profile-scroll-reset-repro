import { createContext, useContext, useState, type ReactNode } from 'react';

type ScrollFixContextValue = {
	enabled: boolean;
	setEnabled: (enabled: boolean) => void;
	toggle: () => void;
};

const ScrollFixContext = createContext<ScrollFixContextValue | null>(null);

function getInitialEnabled() {
	if (typeof window === 'undefined') {
		return false;
	}

	return new URLSearchParams(window.location.search).get('fix') === 'true';
}

export function ScrollFixProvider({ children }: { children: ReactNode }) {
	const [enabled, setEnabled] = useState(getInitialEnabled);

	return (
		<ScrollFixContext.Provider
			value={{
				enabled,
				setEnabled,
				toggle: () => setEnabled((value) => !value),
			}}
		>
			{children}
		</ScrollFixContext.Provider>
	);
}

export function useScrollFix() {
	const context = useContext(ScrollFixContext);
	if (!context) {
		throw new Error('useScrollFix must be used within ScrollFixProvider');
	}
	return context;
}
