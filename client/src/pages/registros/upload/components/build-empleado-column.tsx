/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/columns/build-empleado-column.tsx

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { generateLoteCode } from '@/lib/lote-generator';
import { Empleado } from '@/lib/schemas/empleados';
import { Registro } from '@/lib/schemas/registros';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';

interface BuildEmpleadoColumnOptions {
	empleados: Empleado[];
	handleCellEdit: (rowId: number, field: keyof Registro, value: any) => void;
	handleMassiveEditWithLogic: (field: keyof Registro, value: any) => void;
}

export function buildEmpleadoColumn({
	empleados,
	handleCellEdit,
	handleMassiveEditWithLogic,
}: BuildEmpleadoColumnOptions): ColumnDef<Registro> {
	return {
		accessorKey: 'empleadoNombre',
		header: ({ column }) => {
			const currentFilterValue = column.getFilterValue() as string | undefined;

			return (
				<div className='flex justify-start'>
					<DataTableColumnHeader column={column} title='Empleado' />
					<Select
						value={currentFilterValue || ''}
						onValueChange={(newValue) => {
							if (!newValue) {
								column.setFilterValue(undefined);
								return;
							}
							handleMassiveEditWithLogic('empleadoNombre', newValue);
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
			const registro = row.original;
			const value = row.getValue('empleadoNombre') as string;

			return (
				<div className='flex justify-start'>
					<Select
						onValueChange={(newValue) => {
							const empleado = empleados.find((e) => e.nombre === newValue);
							const empleadoId = empleado?.id ?? null;

							handleCellEdit(registro.id, 'empleadoNombre', newValue);
							handleCellEdit(registro.id, 'empleadoId', empleadoId);

							const { productoId, fechaProduccion } = registro;
							if (productoId && fechaProduccion && empleadoId) {
								const lote = generateLoteCode(
									productoId.toString(),
									fechaProduccion,
									empleadoId.toString()
								);
								handleCellEdit(registro.id, 'lote', lote);
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
	};
}
