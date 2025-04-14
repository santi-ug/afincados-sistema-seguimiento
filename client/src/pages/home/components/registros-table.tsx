import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	ColumnDef,
	ColumnFiltersState,
	RowData,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { Registro } from '@/lib/schemas/registros'; // 👈 ahora usamos Registro
import { DataTablePagination } from './data-table-pagination'; // 👈 mismo paginador
import { DataTableToolbar } from './data-table-toolbar'; // 👈 mismo toolbar

declare module '@tanstack/react-table' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		className: string;
	}
}

interface DataTableProps {
	columns: ColumnDef<Registro>[]; // 👈 tipo de columnas para Registro
	data: Registro[];
}

export function RegistrosTable({ columns, data }: DataTableProps) {
	const [rowSelection, setRowSelection] = useState({});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
		productoId: true,
		nombreProducto: true,
		lote: true,
		gramaje: true,
		cantidad: true,
		materialType: true,
		fechaProduccion: true,
		fechaVencimiento: true,
		id: false,
		empleadoId: false, // get empleado name by id
		archivoExcelId: false,
		condVerificado: false,
		hierbasVerificado: false,
		reposteriaVerificado: false,
		empaqueVerificado: false,
		paquetesCantidad: false,
		accionResultado: false,
		cliente: false,
		paramCalidadEmpaque: false,
		paramCalidadPeso: false,
		paramCalidadSinPresenciaDeSustanciasExtranas: false,
		hora: false,
		observaciones: false,
		olor: false,
		color: false,
		sabor: false,
		varProcesoConforme: false,
		empaqueConforme: false,
		libera: false,
		accionesCorrectivas: false,
	});

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	return (
		<div className='space-y-4'>
			<DataTableToolbar table={table} />
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className='group/row'>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										colSpan={header.colSpan}
										className={header.column.columnDef.meta?.className ?? ''}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
									className='group/row'
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className={cell.column.columnDef.meta?.className ?? ''}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
}
