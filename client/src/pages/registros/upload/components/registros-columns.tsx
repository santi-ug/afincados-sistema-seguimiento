/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { cn, formatDateToYYYYMMDD } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { buildCheckmarkColumn } from './build-checkmark-column';
import { buildInputColumn } from './build-input-column';
import { DataTableColumnHeader } from './data-table-column-header';

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
	return [
		buildInputColumn({
			field: 'fechaProduccion',
			label: 'Fecha Producción',
			registros,
			handleCellEdit,
			handleMassiveEditWithLogic,
			placeholderHeader: 'YYYY-MM-DD',
			placeholderCell: 'YYYY-MM-DD',
		}),

		{
			accessorKey: 'nombreProducto',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title='Nombre Producto' />
			),
			cell: ({ row }) => {
				const registro = row.original as Registro;
				const producto = productos.find((p) => p.id === registro.productoId);

				if (producto && registro.nombreProducto !== producto.nombre) {
					handleCellEdit(registro.id, 'nombreProducto', producto.nombre);
				}

				return (
					<div className='flex justify-start'>{producto?.nombre ?? '—'}</div>
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
				const productionDate = registro.fechaProduccion
					? new Date(registro.fechaProduccion)
					: undefined;

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

				// 🔥 Si no existe (null, undefined, vacío)
				if (!vencimiento) {
					return (
						<div className='flex justify-start text-red-600'>
							Fecha inválida
						</div>
					);
				}

				// 🔥 Si es string tipo "Fecha inválida"
				if (typeof vencimiento === 'string') {
					return (
						<div className='flex justify-start text-red-600'>{vencimiento}</div>
					);
				}

				// 🔥 Si es Date válido
				if (vencimiento instanceof Date && !isNaN(vencimiento.getTime())) {
					return (
						<div className='flex justify-start'>
							{formatDateToYYYYMMDD(vencimiento)}
						</div>
					);
				}

				// ❌ Si por alguna razón no es válido
				return (
					<div className='flex justify-start text-red-600'>Fecha inválida</div>
				);
			},
			size: 180,
		},

		{
			accessorKey: 'empleadoNombre',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title='Empleado' />
			),
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
				const producto = productos.find((p) => p.id === registro.productoId);

				console.log(producto, registro.materialType);

				if (producto && registro.materialType !== producto.categoria) {
					handleCellEdit(
						registro.id,
						'materialType',
						producto.categoria ?? null
					);
				}

				return (
					<div className='flex justify-start'>{producto?.categoria ?? '—'}</div>
				);
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
				const value = row.getValue('paquetesCantidad');

				// Pre-validate: if value is null, undefined, or NaN
				const isInvalid =
					value === null || value === undefined || isNaN(Number(value));

				return (
					<div className='flex justify-start'>
						<Input
							type='number'
							inputMode='numeric'
							step='1'
							min='0'
							className={cn('h-8 w-24', isInvalid && 'border-red-500')}
							defaultValue={
								typeof value === 'number' ? value : value ? String(value) : ''
							}
							placeholder='0'
							onBlur={(e) => {
								const inputValue = e.target.value.trim();

								// If empty, or invalid number → force red and clear
								if (inputValue === '' || isNaN(Number(inputValue))) {
									handleCellEdit(row.original.id, 'paquetesCantidad', null);
									return;
								}

								const numericValue = parseInt(inputValue, 10);

								// Save the integer
								if (!isNaN(numericValue)) {
									handleCellEdit(
										row.original.id,
										'paquetesCantidad',
										numericValue
									);
								} else {
									handleCellEdit(row.original.id, 'paquetesCantidad', null);
								}
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									(e.target as HTMLInputElement).blur();
								}
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
							<SelectTrigger className='h-8 w-32'>
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
		buildInputColumn({
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

				// 🕒 If value exists and is in valid format (HH:mm)
				const displayValue =
					typeof value === 'string' && /^\d{2}:\d{2}$/.test(value) ? value : '';

				const isInvalid = value && !/^\d{2}:\d{2}$/.test(value);

				return (
					<div className='flex justify-start'>
						<Input
							type='text' // Now it's plain text (not <input type="time">)
							className={cn('h-8 w-24', isInvalid && 'border-red-500')}
							placeholder='--:--'
							defaultValue={displayValue}
							onBlur={(e) => {
								const timeValue = e.target.value.trim();

								// If empty, clear field
								if (!timeValue) {
									handleCellEdit(row.original.id, 'hora', null);
									return;
								}

								// Validate HH:mm format
								if (/^\d{2}:\d{2}$/.test(timeValue)) {
									handleCellEdit(row.original.id, 'hora', timeValue);
								} else {
									// Still save invalid temporarily so it stays red
									handleCellEdit(row.original.id, 'hora', timeValue);
								}
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									(e.target as HTMLInputElement).blur();
								}
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
						<Input
							type='text'
							className={cn('h-8 w-48')}
							defaultValue={value ?? ''}
							placeholder='Opcional'
							onBlur={(e) => {
								const inputValue = e.target.value.trim();

								// If empty, force red and null
								if (inputValue === '') {
									handleCellEdit(row.original.id, 'observaciones', null);
								} else {
									handleCellEdit(row.original.id, 'observaciones', inputValue);
								}
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									(e.target as HTMLInputElement).blur();
								}
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
						<Input
							type='text'
							className={cn('h-8 w-48')}
							defaultValue={value ?? ''}
							placeholder='Opcional'
							onBlur={(e) => {
								const inputValue = e.target.value.trim();

								// If empty, force red and null
								if (inputValue === '') {
									handleCellEdit(row.original.id, 'accionesCorrectivas', null);
								} else {
									handleCellEdit(
										row.original.id,
										'accionesCorrectivas',
										inputValue
									);
								}
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									(e.target as HTMLInputElement).blur();
								}
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
