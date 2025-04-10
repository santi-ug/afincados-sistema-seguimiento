import { ConfirmDialog } from '@/components/confirm-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { deleteEmpleado } from '@/lib/api/empleados'; // 👈 your empleados delete API
import { Empleado } from '@/lib/schemas/empleados'; // 👈 empleado schema
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast'; // still using react-hot-toast

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentRow: Empleado;
	refetchEmpleados: () => Promise<void>;
}

export function DialogDelete({
	open,
	onOpenChange,
	currentRow,
	refetchEmpleados,
}: Props) {
	const [value, setValue] = useState('');

	const handleDelete = async () => {
		if (value.trim() !== currentRow.nombre) return;

		try {
			await deleteEmpleado(String(currentRow.id));
			toast.success('Empleado eliminado exitosamente.');

			await refetchEmpleados();
			onOpenChange(false);
		} catch (error) {
			toast.error('Hubo un error al eliminar el empleado.');
			console.error(error);
		}
	};

	return (
		<ConfirmDialog
			open={open}
			onOpenChange={onOpenChange}
			handleConfirm={handleDelete}
			disabled={value.trim() !== currentRow.nombre}
			title={
				<span className='text-destructive flex items-center gap-2'>
					<AlertTriangle className='stroke-destructive' size={18} /> Eliminar
					Empleado
				</span>
			}
			desc={
				<div className='space-y-4'>
					<p>
						¿Estás seguro que quieres eliminar{' '}
						<span className='font-bold'>{currentRow.nombre}</span>?
						<br />
						Esta acción eliminará permanentemente al empleado de la base de
						datos.
					</p>

					<Label className='my-2'>
						Nombre del Empleado:
						<Input
							value={value}
							onChange={(e) => setValue(e.target.value)}
							placeholder='Escribe el nombre para confirmar la eliminación.'
						/>
					</Label>

					<Alert variant='destructive'>
						<AlertTitle>¡Advertencia!</AlertTitle>
						<AlertDescription>
							Esta operación no se puede deshacer. Procede con precaución.
						</AlertDescription>
					</Alert>
				</div>
			}
			confirmText='Eliminar'
			destructive
		/>
	);
}
