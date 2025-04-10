import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useEmpleados } from '../context/empleados-context'; // <-- empleados context

export function EmpleadosPrimaryButton() {
	const { setOpen } = useEmpleados(); // <-- your custom hook for empleados

	return (
		<div className='flex'>
			<Button className='space-x-1' onClick={() => setOpen('add')}>
				<span>Crear Empleado</span> <Plus size={18} />
			</Button>
		</div>
	);
}
