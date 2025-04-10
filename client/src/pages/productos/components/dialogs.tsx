import { useProductos } from '../context/products-context';
import { DialogAction } from './dialog-action';
import { DialogDelete } from './dialog-delete';

interface DialogsProps {
	refetchProductos: () => Promise<void>;
}

export function Dialogs({ refetchProductos }: DialogsProps) {
	const { open, setOpen, currentRow, setCurrentRow } = useProductos();

	return (
		<>
			{/* Create new producto */}
			<DialogAction
				key='producto-add'
				open={open === 'add'}
				onOpenChange={() => setOpen('add')}
				refetchProductos={refetchProductos} // Pass refetch function to DialogAction
			/>

			{/* If we are editing or deleting an existing producto */}
			{currentRow && (
				<>
					<DialogAction
						key={`producto-edit-${currentRow.id}`}
						open={open === 'edit'}
						onOpenChange={() => {
							setOpen('edit');
							setTimeout(() => {
								setCurrentRow(null);
							}, 500);
						}}
						refetchProductos={refetchProductos} // Pass refetch function to DialogAction
						currentRow={currentRow}
					/>

					<DialogDelete
						key={`producto-delete-${currentRow.id}`}
						open={open === 'delete'}
						onOpenChange={() => {
							setOpen('delete');
							setTimeout(() => {
								setCurrentRow(null);
							}, 500);
						}}
						refetchProductos={refetchProductos} // Pass refetch function to DialogDelete
						currentRow={currentRow}
					/>
				</>
			)}
		</>
	);
}
