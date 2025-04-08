import { Command, Home, ShoppingCart, Users } from 'lucide-react';
import { type SidebarData } from '../types';

export const sidebarData: SidebarData = {
	user: {
		name: 'Afincados',
		email: 'gestion@afincados.com',
		avatar: '/avatars/afincados.png', // Change if you want
	},
	teams: [
		{
			name: 'Afincados',
			logo: Command,
			description: 'Gestión de Lotes',
		},
	],
	navGroups: [
		{
			title: 'Navegación',
			items: [
				{
					title: 'Inicio',
					url: '/',
					icon: Home,
				},
				{
					title: 'Productos',
					url: '/productos',
					icon: ShoppingCart,
				},
				{
					title: 'Empleados',
					url: '/empleados',
					icon: Users,
				},
			],
		},
	],
};
