import { useEmpleados } from '../context/empleados-context';
import { DialogAction } from './dialog-action';
import { DialogDelete } from './dialog-delete';

interface DialogsProps {
	refetchEmpleados: () => Promise<void>;
}

export function Dialogs({ refetchEmpleados }: DialogsProps) {
	const { open, setOpen, currentRow, setCurrentRow } = useEmpleados();

	return (
		<>
			{/* Create new empleado */}
			<DialogAction
				key='empleado-add'
				open={open === 'add'}
				onOpenChange={() => setOpen('add')}
				refetchEmpleados={refetchEmpleados} // Pass refetch function to DialogAction
			/>

			{/* If we are editing or deleting an existing empleado */}
			{currentRow && (
				<>
					<DialogAction
						key={`empleado-edit-${currentRow.id}`}
						open={open === 'edit'}
						onOpenChange={() => {
							setOpen('edit');
							setTimeout(() => {
								setCurrentRow(null);
							}, 500);
						}}
						refetchEmpleados={refetchEmpleados} // Pass refetch function to DialogAction
						currentRow={currentRow}
					/>

					<DialogDelete
						key={`empleado-delete-${currentRow.id}`}
						open={open === 'delete'}
						onOpenChange={() => {
							setOpen('delete');
							setTimeout(() => {
								setCurrentRow(null);
							}, 500);
						}}
						refetchEmpleados={refetchEmpleados} // Pass refetch function to DialogDelete
						currentRow={currentRow}
					/>
				</>
			)}
		</>
	);
}
