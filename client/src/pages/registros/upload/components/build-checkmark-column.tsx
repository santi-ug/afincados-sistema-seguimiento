/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox } from '@/components/ui/checkbox';
import { Registro } from '@/lib/schemas/registros';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';

interface BuildCheckmarkColumnOptions {
	field: keyof Registro;
	label: string;
	registros: Registro[];
	handleCellEdit: (rowId: number, field: keyof Registro, value: any) => void;
	handleMassiveEdit: (
		updates: { rowId: number; field: keyof Registro; value: any }[]
	) => void;
}

export function buildCheckmarkColumn({
	field,
	label,
	registros,
	handleCellEdit,
	handleMassiveEdit,
}: BuildCheckmarkColumnOptions): ColumnDef<Registro> {
	return {
		accessorKey: field,
		header: ({ column }) => {
			const allChecked =
				registros.length > 0 && registros.every((r) => r[field] === true);
			const someChecked = registros.some((r) => r[field] === true);

			return (
				<div className='flex items-center gap-2 mr-8'>
					<DataTableColumnHeader column={column} title={label} />
					<Checkbox
						className='-ml-8 mt-0.5'
						checked={allChecked ? true : someChecked ? 'indeterminate' : false}
						onCheckedChange={(value) => {
							const desiredState = !!value;

							const updates = registros
								.filter((r) => r[field] !== desiredState) // 🔥 Only update different ones
								.map((r) => ({
									rowId: r.id,
									field,
									value: desiredState,
								}));

							if (updates.length > 0) {
								handleMassiveEdit(updates);
							}
						}}
						aria-label={`Seleccionar todos los ${label}`}
					/>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className='flex justify-end pr-8'>
				<Checkbox
					className='-ml-8 mt-0.5'
					checked={row.getValue(field)}
					onCheckedChange={(value) =>
						handleCellEdit(row.original.id, field, value)
					}
					aria-label={`Seleccionar ${label}`}
				/>
			</div>
		),
	};
}
