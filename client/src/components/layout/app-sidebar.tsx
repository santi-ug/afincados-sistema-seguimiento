import { Link, useRouterState } from '@tanstack/react-router';
import { sidebarData } from './data/sidebar-data';

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

export function AppSidebar() {
	const router = useRouterState();
	const currentPath = router.location.pathname;

	const team = sidebarData.teams[0];

	return (
		<Sidebar>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size='lg' className='cursor-default'>
							<div className='flex aspect-square size-8 items-center justify-center rounded-lg'>
								<img src='/LOGO.png' alt='Logo' />
							</div>
							<div className='grid flex-1 text-left text-sm leading-tight'>
								<span className='truncate font-semibold'>{team.name}</span>
								<span className='truncate text-xs'>{team.description}</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			{/* 🔥 Only SidebarContent modified from here */}
			<SidebarContent>
				{sidebarData.navGroups.map((group) => (
					<SidebarGroup key={group.title}>
						<SidebarGroupLabel>{group.title}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											isActive={currentPath === item.url}
										>
											<Link to={item.url} preload='intent'>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
		</Sidebar>
	);
}
