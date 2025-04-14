import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { DataTableFacetedFilter } from '../../../components/data-table-faceted-filter';
import { DataTableViewOptions } from '../../../components/data-table-view-options';

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

// Opciones de ejemplo para Empleados (luego deberíamos cargarlos dinámicamente si quieres)
const empleadosOptions = [
	{ label: 'Empleado 1', value: '1' },
	{ label: 'Empleado 2', value: '2' },
	{ label: 'Empleado 3', value: '3' },
];

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<div className='flex items-center justify-between'>
			<div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
				{/* Search Lote */}
				<Input
					placeholder='Buscar por lote...'
					value={(table.getColumn('lote')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('lote')?.setFilterValue(event.target.value)
					}
					className='h-8 w-[150px] lg:w-[250px]'
				/>

				<div className='flex gap-x-2'>
					{/* Faceted filter por Empleado */}
					{table.getColumn('empleadoId') && (
						<DataTableFacetedFilter
							column={table.getColumn('empleadoId')}
							title='Empleado'
							options={empleadosOptions}
						/>
					)}

					{/* Faceted filter por Lote */}
					{table.getColumn('lote') && (
						<DataTableFacetedFilter
							column={table.getColumn('lote')}
							title='Lote'
							options={[]} // Aquí luego podemos cargar dinámicamente lotes únicos si quieres
						/>
					)}
				</div>

				{isFiltered && (
					<Button
						variant='ghost'
						onClick={() => table.resetColumnFilters()}
						className='h-8 px-2 lg:px-3'
					>
						Reset
						<Cross2Icon className='ml-2 h-4 w-4' />
					</Button>
				)}
			</div>

			<DataTableViewOptions table={table} />
		</div>
	);
}
