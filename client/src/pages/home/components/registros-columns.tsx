import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Registro } from '@/lib/schemas/registros';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Registro>[] = [
	// ✅ Visible by default
	{
		accessorKey: 'productoId',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Producto ID' />
		),
		cell: ({ row }) => (
			<div className='max-w-40 truncate'>{row.getValue('productoId')}</div>
		),
	},
	{
		accessorKey: 'nombreProducto',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Nombre Producto' />
		),
		cell: ({ row }) => <div>{row.getValue('nombreProducto') ?? '—'}</div>,
	},
	{
		accessorKey: 'lote',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Lote' />
		),
		cell: ({ row }) => <div>{row.getValue('lote') ?? '—'}</div>,
	},
	{
		accessorKey: 'gramaje',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Gramaje (g)' />
		),
		cell: ({ row }) => (
			<Badge variant='outline'>{row.getValue('gramaje')}g</Badge>
		),
	},
	{
		accessorKey: 'cantidad',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Cantidad' />
		),
		cell: ({ row }) => <div>{row.getValue('cantidad')}</div>,
	},
	{
		accessorKey: 'materialType',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Tipo de Material' />
		),
		cell: ({ row }) => <div>{row.getValue('materialType') ?? '—'}</div>,
	},
	{
		accessorKey: 'fechaProduccion',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Fecha de Producción' />
		),
		cell: ({ row }) => {
			const fecha: Date | null = row.getValue('fechaProduccion');
			return <div>{fecha ? new Date(fecha).toLocaleDateString() : '—'}</div>;
		},
	},
	{
		accessorKey: 'fechaVencimiento',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Fecha de Vencimiento' />
		),
		cell: ({ row }) => {
			const fecha: Date | null = row.getValue('fechaVencimiento');
			return <div>{fecha ? new Date(fecha).toLocaleDateString() : '—'}</div>;
		},
	},

	// ⬇️ Hidden by default
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='ID' className='ml-2' />
		),
		cell: ({ row }) => (
			<div className='ml-2 max-w-40 truncate'>{row.getValue('id')}</div>
		),
		enableHiding: false,
	},
	{
		accessorKey: 'empleadoId',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Empleado ID' />
		),
		cell: ({ row }) => <div>{row.getValue('empleadoId') ?? '—'}</div>,
	},
	{
		accessorKey: 'archivoExcelId',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Archivo Excel ID' />
		),
		cell: ({ row }) => <div>{row.getValue('archivoExcelId') ?? '—'}</div>,
	},
	{
		accessorKey: 'condVerificado',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Cond Verificado' />
		),
		cell: ({ row }) => <div>{row.getValue('condVerificado') ? '✅' : '—'}</div>,
	},
	{
		accessorKey: 'hierbasVerificado',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Hierbas Verificado' />
		),
		cell: ({ row }) => (
			<div>{row.getValue('hierbasVerificado') ? '✅' : '—'}</div>
		),
	},
	{
		accessorKey: 'reposteriaVerificado',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Repostería Verificado' />
		),
		cell: ({ row }) => (
			<div>{row.getValue('reposteriaVerificado') ? '✅' : '—'}</div>
		),
	},
	{
		accessorKey: 'empaqueVerificado',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Empaque Verificado' />
		),
		cell: ({ row }) => (
			<div>{row.getValue('empaqueVerificado') ? '✅' : '—'}</div>
		),
	},
	{
		accessorKey: 'paquetesCantidad',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Paquetes' />
		),
		cell: ({ row }) => <div>{row.getValue('paquetesCantidad') ?? '—'}</div>,
	},
	{
		accessorKey: 'accionResultado',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Acción/Resultado' />
		),
		cell: ({ row }) => <div>{row.getValue('accionResultado') ?? '—'}</div>,
	},
	{
		accessorKey: 'cliente',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Cliente' />
		),
		cell: ({ row }) => <div>{row.getValue('cliente') ?? '—'}</div>,
	},
	{
		accessorKey: 'paramCalidadEmpaque',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Calidad Empaque' />
		),
		cell: ({ row }) => <div>{row.getValue('paramCalidadEmpaque') ?? '—'}</div>,
	},
	{
		accessorKey: 'paramCalidadPeso',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Calidad Peso' />
		),
		cell: ({ row }) => <div>{row.getValue('paramCalidadPeso') ?? '—'}</div>,
	},
	{
		accessorKey: 'paramCalidadSinPresenciaDeSustanciasExtranas',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Sin Sustancias Extrañas' />
		),
		cell: ({ row }) => (
			<div>
				{row.getValue('paramCalidadSinPresenciaDeSustanciasExtranas') ?? '—'}
			</div>
		),
	},
	{
		accessorKey: 'hora',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Hora' />
		),
		cell: ({ row }) => {
			const hora: Date | null = row.getValue('hora');
			return <div>{hora ? new Date(hora).toLocaleTimeString() : '—'}</div>;
		},
	},
	{
		accessorKey: 'observaciones',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Observaciones' />
		),
		cell: ({ row }) => <div>{row.getValue('observaciones') ?? '—'}</div>,
	},
	{
		accessorKey: 'olor',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Olor' />
		),
		cell: ({ row }) => <div>{row.getValue('olor') ? '✅' : '—'}</div>,
	},
	{
		accessorKey: 'color',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Color' />
		),
		cell: ({ row }) => <div>{row.getValue('color') ? '✅' : '—'}</div>,
	},
	{
		accessorKey: 'sabor',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Sabor' />
		),
		cell: ({ row }) => <div>{row.getValue('sabor') ? '✅' : '—'}</div>,
	},
	{
		accessorKey: 'varProcesoConforme',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Proceso Conforme' />
		),
		cell: ({ row }) => (
			<div>{row.getValue('varProcesoConforme') ? '✅' : '—'}</div>
		),
	},
	{
		accessorKey: 'empaqueConforme',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Empaque Conforme' />
		),
		cell: ({ row }) => (
			<div>{row.getValue('empaqueConforme') ? '✅' : '—'}</div>
		),
	},
	{
		accessorKey: 'libera',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Libera' />
		),
		cell: ({ row }) => <div>{row.getValue('libera') ? '✅' : '—'}</div>,
	},
	{
		accessorKey: 'accionesCorrectivas',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Acciones Correctivas' />
		),
		cell: ({ row }) => <div>{row.getValue('accionesCorrectivas') ?? '—'}</div>,
	},

	// 👉 Select Column
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

	// 👉 Actions Column
	{
		id: 'actions',
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
];
