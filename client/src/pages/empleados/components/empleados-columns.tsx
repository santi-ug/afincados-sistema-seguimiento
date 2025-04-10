import { ColumnDef } from '@tanstack/react-table';
import { Empleado } from '../../../lib/schemas/empleados'; // <-- Empleado schema
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions'; // assuming you still want actions (edit/delete)

export const columns: ColumnDef<Empleado>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Codigo' className='ml-2' />
		),
		cell: ({ row }) => (
			<div className='ml-2 max-w-60 truncate'>{row.getValue('id')}</div>
		),
		enableHiding: false,
	},
	{
		accessorKey: 'nombre',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Nombre' />
		),
		cell: ({ row }) => (
			<div className='max-w-80 truncate'>{row.getValue('nombre')}</div>
		),
		enableHiding: false,
		filterFn: (row, columnId, filterValue) => {
			const value = row.getValue<string>(columnId) || '';

			// Normalize to remove accents and lowercase
			const normalizedValue = value
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.toLowerCase();
			const normalizedFilter = filterValue
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.toLowerCase();

			return normalizedValue.includes(normalizedFilter);
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => <DataTableRowActions row={row} />, // Keep your row actions (edit/delete)
	},
];
