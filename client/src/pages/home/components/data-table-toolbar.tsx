'use client';

import { DatePickerCell } from '@/components/date-picker-cell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Empleado } from '@/lib/schemas/empleados';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { DataTableFacetedFilter } from '../../../components/data-table-faceted-filter';
import { DataTableViewOptions } from '../../../components/data-table-view-options';

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	empleados: Empleado[];
	fechaInicio: Date | null;
	setFechaInicio: (date: Date | null) => void;
	fechaFin: Date | null;
	setFechaFin: (date: Date | null) => void;
}

export function DataTableToolbar<TData>({
	table,
	empleados,
	fechaInicio,
	setFechaInicio,
	fechaFin,
	setFechaFin,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	const empleadosOptions = empleados.map((emp) => ({
		label: emp.nombre,
		value: emp.id.toString(),
	}));

	return (
		<div className='flex items-center justify-between'>
			<div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
				<DatePickerCell
					value={fechaInicio}
					onChange={setFechaInicio}
					label='Fecha inicio'
				/>

				<DatePickerCell
					value={fechaFin}
					onChange={setFechaFin}
					label='Fecha fin'
				/>

				{(fechaInicio || fechaFin) && (
					<Button
						variant='outline'
						onClick={() => {
							setFechaInicio(null);
							setFechaFin(null);
						}}
						className='h-8 px-2 lg:px-3'
					>
						Limpiar Fechas
					</Button>
				)}

				{/* 🔎 Filtro por producto */}
				<Input
					placeholder='Filtrar por nombre producto...'
					value={
						(table.getColumn('nombreProducto')?.getFilterValue() as string) ??
						''
					}
					onChange={(event) =>
						table
							.getColumn('nombreProducto')
							?.setFilterValue(event.target.value)
					}
					className='h-8 w-[150px] lg:w-[250px]'
				/>

				{/* 🔎 Filtro por lote */}
				<Input
					placeholder='Buscar por lote...'
					value={(table.getColumn('lote')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('lote')?.setFilterValue(event.target.value)
					}
					className='h-8 w-[150px] lg:w-[250px]'
				/>

				{/* 🎯 Filtro por empleado */}
				{table.getColumn('empleadoId') && (
					<DataTableFacetedFilter
						column={table.getColumn('empleadoId')}
						title='Empleado'
						options={empleadosOptions}
					/>
				)}

				{isFiltered && (
					<Button
						variant='ghost'
						onClick={() => {
							table.resetColumnFilters();
							setFechaInicio(null);
							setFechaFin(null);
						}}
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
