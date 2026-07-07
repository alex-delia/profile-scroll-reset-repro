import { ScrollFixProvider } from '@/context/ScrollFixContext';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from './router';
import './styles.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ScrollFixProvider>
			<RouterProvider router={router} />
		</ScrollFixProvider>
	</StrictMode>,
);
