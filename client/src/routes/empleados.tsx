import Empleados from '@/pages/empleados';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/empleados')({
	component: Empleados,
});
