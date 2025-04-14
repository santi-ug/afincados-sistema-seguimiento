import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { Producto } from '../../../lib/schemas/productos';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Producto>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Codigo' className='ml-2' />
		),
		cell: ({ row }) => (
			<div className='ml-2 max-w-40 truncate'>{row.getValue('id')}</div>
		),
		enableHiding: false,
	},
	{
		accessorKey: 'nombre',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Nombre' />
		),
		cell: ({ row }) => (
			<div className='max-w-40 truncate'>{row.getValue('nombre')}</div>
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
		accessorKey: 'categoria',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Categoría' />
		),
		cell: ({ row }) => (
			<Badge variant='outline' className='capitalize'>
				{row.getValue('categoria')}
			</Badge>
		),
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: 'gramajes',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Gramajes (g)' />
		),
		cell: ({ row }) => {
			const gramajes: number[] = row.getValue('gramajes') || [];
			return (
				<div className='flex flex-wrap gap-1'>
					{gramajes.map((g) => (
						<Badge variant='outline' key={g}>
							{g}g
						</Badge>
					))}
				</div>
			);
		},
		enableSorting: false,
	},
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
				className='mb-3'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label='Select row'
				className='mb-2'
			/>
		),
		enableSorting: false,
		enableHiding: false,
		meta: {
			className: cn(
				'sticky left-0 z-10 rounded-tl',
				'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
			),
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => <DataTableRowActions row={row} />, // if you have actions setup
	},
];
