import { RouterProvider, createRouter } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { routeTree } from './routeTree.gen';

// Create the router manually
const router = createRouter({ routeTree });

// Register router type (good for intellisense)
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

// Render everything
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<>
				<RouterProvider router={router} />
				<TanStackRouterDevtools
					router={router}
					initialIsOpen={false}
					position='bottom-right'
				/>
			</>
		</StrictMode>
	);
}
