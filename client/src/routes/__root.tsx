import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<SidebarProvider>
			<div className='flex min-h-screen w-full'>
				<AppSidebar />
				<div className='flex flex-1 flex-col min-w-0'>
					<SidebarTrigger />
					<Outlet />
				</div>
			</div>
			<Toaster position='top-right' reverseOrder={false} />
		</SidebarProvider>
	);
}
