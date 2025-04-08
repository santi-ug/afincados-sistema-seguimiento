import Productos from '@/pages/productos/index';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/productos')({
	component: Productos,
});
