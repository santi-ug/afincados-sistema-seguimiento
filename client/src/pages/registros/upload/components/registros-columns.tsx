/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { generateLoteCode } from '@/lib/lote-generator';
import { Empleado } from '@/lib/schemas/empleados';
import { Producto } from '@/lib/schemas/productos';
import { Registro } from '@/lib/schemas/registros';
import { ColumnDef } from '@tanstack/react-table';
import { buildCheckmarkColumn } from './build-checkmark-column';
import { buildInputColumn } from './build-input-column';
import { buildInputColumnText } from './build-input-column-text';
import { DataTableColumnHeader } from './data-table-column-header';
import { HoraCell } from './hora-cell';
import { PaquetesCantidadCell } from './paquetes-cantidad-cell';
import { TextAreaCell } from './text-area-cell';

interface UploadColumnsOptions {
	handleCellEdit: (rowId: number, field: keyof Registro, value: any) => void;
	handleMassiveEdit: (
		updates: { rowId: number; field: keyof Registro; value: any }[]
	) => void;
	handleMassiveEditWithLogic: (field: keyof Registro, value: any) => void;

	registros: Registro[];
	productos: Producto[];
	empleados: Empleado[];
}

export function getUploadColumns({
	handleCellEdit,
	handleMassiveEdit,
	handleMassiveEditWithLogic,
	registros,
	productos,
	empleados,
}: UploadColumnsOptions): ColumnDef<Registro>[] {
	const productoMap = new Map(productos.map((p) => [p.id, p.nombre]));
	const productoCategoriaMap = new Map(
		productos.map((p) => [p.id, p.categoria])
	);
	const empleadoNombreMap = new Map(empleados.map((e) => [e.nombre, e.id]));

	return [
		buildInputColumn({
			field: 'fechaProduccion',
			label: 'Fecha Producción',
			registros,
			handleCellEdit,
			handleMassiveEditWithLogic,
		}),
		{
			accessorKey: 'nombreProducto',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title='Nombre Producto' />
			),
			cell: ({ row }) => {
				const registro = row.original as Registro;
				const nombreProducto = registro.productoId
					? productoMap.get(registro.productoId)
					: null;

				if (nombreProducto && registro.nombreProducto !== nombreProducto) {
					handleCellEdit(registro.id, 'nombreProducto', nombreProducto);
				}

				return (
					<div className='flex justify-start'>{nombreProducto ?? '—'}</div>
				);
			},
			size: 220,
		},
		{
			accessorKey: 'productoId',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title='Producto ID' />
			),
			cell: ({ row }) => (
				<div className='flex justify-start '>
					{row.getValue('productoId') ?? '—'}
				</div>
			),
			size: 150,
		},
		{
			accessorKey: 'cantidad',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title='Cantidad' />
			),
			cell: ({ row }) => (
				<div className='flex justify-start '>{row.getValue('cantidad')}</div>
			),
			size: 120,
		},
		{
			accessorKey: 'gramaje',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title='Gramaje' />
			),
			cell: ({ row }) => (
				<div className='flex justify-start '>
					<Badge variant='outline'>{row.getValue('gramaje')}g</Badge>
				</div>
			),
			size: 120,
		},
		{
			accessorKey: 'lote',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title='Lote' />
			),
			cell: ({ row }) => {
				const registro = row.original as Registro;

				const productoId = registro.productoId?.toString() || '';
				const empleadoId = registro.empleadoId?.toString() || '';
				const productionDate = registro.fechaProduccion ?? undefined;

				// 🔥 If any required info missing, don't even call generateLoteCode
				if (!productoId || !empleadoId || !productionDate) {
					return <div className='flex justify-start'>—</div>;
				}

				const loteCode = generateLoteCode(
					productoId,
					productionDate,
					empleadoId
				);

				// 🔥 Si el registro.lote actual es distinto del que deberíamos tener, lo corregimos
				if (registro.lote !== loteCode) {
					handleCellEdit(registro.id, 'lote', loteCode);
				}

				return <div className='flex justify-start'>{loteCode}</div>;
			},
			size: 250,
		},
		{
			accessorKey: 'fechaVencimiento',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title='Fecha Vencimiento' />
			),
			cell: ({ row }) => {
				const vencimiento = row.getValue('fechaVencimiento');

				if (vencimiento instanceof Date && !isNaN(vencimiento.getTime())) {
					return (
						<div className='flex justify-start'>
							{vencimiento.toLocaleDateString()}{' '}
							{/* 🔥 Pure, native browser formatting */}
						</div>
					);
				}

				// ❌ If it's null, undefined, or invalid
				return (
					<div className='flex justify-start text-red-600'>Fecha inválida</div>
				);
			},
			size: 180,
		},
		{
			accessorKey: 'empleadoNombre',
			header: ({ column }) => {
				const currentFilterValue = column.getFilterValue() as
					| string
					| undefined;

				return (
					<div className='flex justify-start'>
						<DataTableColumnHeader column={column} title='Empleado' />
						<Select
							value={currentFilterValue || ''}
							onValueChange={(newValue) => {
								if (newValue) {
									column.setFilterValue(newValue);

									// 🔥 Now, use column.getFacetedRowModel()
									const rows = column.getFacetedRowModel().rows;

									handleMassiveEdit([
										...rows.map((row) => ({
											rowId: row.original.id,
											field: 'empleadoNombre' as keyof Registro,
											value: newValue,
										})),
										...rows.map((row) => ({
											rowId: row.original.id,
											field: 'empleadoId' as keyof Registro,
											value: empleadoNombreMap.get(newValue) ?? null,
										})),
									]);
								} else {
									column.setFilterValue(undefined);
								}
							}}
						>
							<SelectTrigger className='h-8 w-40'>
								<SelectValue placeholder='Actualizar todos' />
							</SelectTrigger>
							<SelectContent>
								{empleados.map((emp) => (
									<SelectItem key={emp.id} value={emp.nombre}>
										{emp.nombre}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				);
			},
			cell: ({ row }) => {
				const value = row.getValue('empleadoNombre') as string;

				return (
					<div className='flex justify-start'>
						<Select
							onValueChange={(newValue) => {
								const empleado = empleados.find(
									(emp) => emp.nombre === newValue
								);

								if (empleado) {
									handleCellEdit(
										row.original.id,
										'empleadoNombre' as keyof Registro,
										empleado.nombre
									);
									handleCellEdit(
										row.original.id,
										'empleadoId' as keyof Registro,
										empleado.id
									);
								} else {
									handleCellEdit(
										row.original.id,
										'empleadoNombre' as keyof Registro,
										''
									);
									handleCellEdit(
										row.original.id,
										'empleadoId' as keyof Registro,
										null
									);
								}
							}}
							defaultValue={value || undefined}
						>
							<SelectTrigger className='h-8 w-40'>
								<SelectValue placeholder='Escoger empleado' />
							</SelectTrigger>
							<SelectContent>
								{empleados.map((emp) => (
									<SelectItem key={emp.id} value={emp.nombre}>
										{emp.nombre}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				);
			},
			size: 180,
		},
		{
			accessorKey: 'empleadoId',
			header: 'Empleado ID',
			cell: ({ row }) => (
				<div className='flex justify-start'>
					{row.original.empleadoId ?? '—'}
				</div>
			),
			enableHiding: true, // 👈🏼 Para ocultarlo de la vista normal
		},
		{
			accessorKey: 'materialType',
			header: ({ column }) => (
				<div className='flex justify-start'>
					<DataTableColumnHeader column={column} title='Tipo de Material' />
				</div>
			),
			cell: ({ row }) => {
				const registro = row.original as Registro;
				const materialType = registro.productoId
					? productoCategoriaMap.get(registro.productoId)
					: null;

				if (materialType && registro.materialType !== materialType) {
					handleCellEdit(registro.id, 'materialType', materialType ?? null);
				}

				return <div className='flex justify-start'>{materialType ?? '—'}</div>;
			},
			size: 200,
		},
		buildCheckmarkColumn({
			field: 'empaqueVerificado',
			label: 'Empaque Verificado',
			registros,
			handleCellEdit,
			handleMassiveEdit,
		}),
		{
			accessorKey: 'paquetesCantidad',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title='Paquetes' />
			),
			cell: ({ row }) => {
				const registro = row.original as Registro;
				const paquetes = row.getValue('paquetesCantidad');
				const cantidad = registro.cantidad;

				const value: number | null =
					typeof paquetes === 'number'
						? paquetes
						: typeof cantidad === 'number'
							? cantidad
							: null;

				// 🧠 Auto-set paquetesCantidad if missing
				if (
					(registro.paquetesCantidad === null ||
						registro.paquetesCantidad === undefined) &&
					typeof cantidad === 'number'
				) {
					handleCellEdit(registro.id, 'paquetesCantidad', cantidad);
				}

				return (
					<div className='flex justify-start'>
						<PaquetesCantidadCell
							initialValue={value}
							rowId={registro.id}
							handleSave={(rowId, newValue) => {
								handleCellEdit(rowId, 'paquetesCantidad', newValue);
							}}
						/>
					</div>
				);
			},
			size: 130,
		},
		{
			accessorKey: 'accionResultado',
			header: ({ column }) => {
				// Read the current filter value if any
				const currentFilterValue = column.getFilterValue() as
					| string
					| undefined;

				return (
					<div className='flex justify-start'>
						<DataTableColumnHeader column={column} title='Acción/Resultado' />
						<Select
							value={currentFilterValue || ''}
							onValueChange={(newValue) => {
								if (newValue) {
									// Set filter (optional) if you want
									column.setFilterValue(newValue);
									// 🚀 Perform massive update
									handleMassiveEditWithLogic('accionResultado', newValue);
								} else {
									column.setFilterValue(undefined);
								}
							}}
						>
							<SelectTrigger className='h-8 w-40'>
								<SelectValue placeholder='Actualizar todos' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='AC'>AC</SelectItem>
								<SelectItem value='RE'>RE</SelectItem>
							</SelectContent>
						</Select>
					</div>
				);
			},
			cell: ({ row }) => {
				const value = row.getValue('accionResultado') as 'AC' | 'RE' | null;

				return (
					<div className='flex justify-start'>
						<Select
							value={value ?? ''}
							onValueChange={(newValue) => {
								if (newValue === '') {
									handleCellEdit(row.original.id, 'accionResultado', null);
								} else {
									handleCellEdit(row.original.id, 'accionResultado', newValue);
								}
							}}
						>
							<SelectTrigger className='h-8 w-32'>
								<SelectValue placeholder='Seleccionar' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='AC'>AC</SelectItem>
								<SelectItem value='RE'>RE</SelectItem>
							</SelectContent>
						</Select>
					</div>
				);
			},
			size: 200,
		},
		buildInputColumnText({
			field: 'cliente',
			label: 'Cliente',
			placeholderHeader: 'Ruta Unica',
			placeholderCell: 'Ruta Unica',
			registros,
			handleCellEdit,
			handleMassiveEditWithLogic,
		}),

		buildCheckmarkColumn({
			field: 'paramCalidadEmpaque',
			label: 'Verificación Empaque',
			registros,
			handleCellEdit,
			handleMassiveEdit,
		}),
		buildCheckmarkColumn({
			field: 'paramCalidadPeso',
			label: 'Verificación Peso',
			registros,
			handleCellEdit,
			handleMassiveEdit,
		}),
		buildCheckmarkColumn({
			field: 'paramCalidadSinPresenciaDeSustanciasExtranas',
			label: 'Verificación Sin Sustancias Extrañas',
			registros,
			handleCellEdit,
			handleMassiveEdit,
		}),
		{
			accessorKey: 'hora',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title='Hora' />
			),
			cell: ({ row }) => {
				const value = row.getValue('hora') as string | null;

				return (
					<div className='flex justify-start'>
						<HoraCell
							initialValue={value}
							onSave={(newHora) => {
								handleCellEdit(row.original.id, 'hora', newHora);
							}}
						/>
					</div>
				);
			},

			size: 120,
		},

		{
			accessorKey: 'observaciones',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title='Observaciones' />
			),
			cell: ({ row }) => {
				const value = row.getValue('observaciones') as string | null;

				return (
					<div className='flex justify-start'>
						<TextAreaCell
							initialValue={value}
							onSave={(newValue) => {
								handleCellEdit(row.original.id, 'observaciones', newValue);
							}}
						/>
					</div>
				);
			},

			size: 200,
		},
		buildCheckmarkColumn({
			field: 'olor',
			label: 'Olor',
			registros,
			handleCellEdit,
			handleMassiveEdit,
		}),
		buildCheckmarkColumn({
			field: 'color',
			label: 'Color',
			registros,
			handleCellEdit,
			handleMassiveEdit,
		}),
		buildCheckmarkColumn({
			field: 'sabor',
			label: 'Sabor',
			registros,
			handleCellEdit,
			handleMassiveEdit,
		}),
		buildCheckmarkColumn({
			field: 'varProcesoConforme',
			label: 'Variables Proceso Conforme',
			registros,
			handleCellEdit,
			handleMassiveEdit,
		}),
		buildCheckmarkColumn({
			field: 'empaqueConforme',
			label: 'Empaque Conforme',
			registros,
			handleCellEdit,
			handleMassiveEdit,
		}),
		buildCheckmarkColumn({
			field: 'libera',
			label: 'Libera',
			registros,
			handleCellEdit,
			handleMassiveEdit,
		}),
		{
			accessorKey: 'accionesCorrectivas',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title='Acciones Correctivas' />
			),
			cell: ({ row }) => {
				const value = row.getValue('accionesCorrectivas') as string | null;

				return (
					<div className='flex justify-start'>
						<TextAreaCell
							initialValue={value}
							onSave={(newValue) => {
								handleCellEdit(
									row.original.id,
									'accionesCorrectivas',
									newValue
								);
							}}
						/>
					</div>
				);
			},

			size: 200,
		},
		{
			accessorKey: 'id',
			header: 'ID',
			cell: ({ row }) => (
				<div className='flex justify-start '>{row.getValue('id')}</div>
			),
			enableHiding: true,
		},

		{
			accessorKey: 'archivoExcelId',
			header: 'Archivo Excel ID',
			cell: ({ row }) => (
				<div className='flex justify-start '>
					{row.getValue('archivoExcelId')}
				</div>
			),
			enableHiding: true,
		},
	];
}
