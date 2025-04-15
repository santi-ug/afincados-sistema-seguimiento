/* eslint-disable @typescript-eslint/no-explicit-any */
import { Registro } from '@/lib/schemas/registros';
import { ColumnDef } from '@tanstack/react-table';
import { DatePickerCell } from '../../../../components/date-picker-cell';
import { DatePickerHeader } from './date-picker-header';

import { DataTableColumnHeader } from './data-table-column-header';

interface BuildInputColumnOptions {
	field: keyof Registro;
	label: string;
	registros: Registro[];
	handleCellEdit: (rowId: number, field: keyof Registro, value: any) => void;
	handleMassiveEditWithLogic: (field: keyof Registro, value: any) => void;
	placeholderHeader?: string;
	placeholderCell?: string;
}

export function buildInputColumn({
	field,
	label,
	registros,
	handleCellEdit,
	handleMassiveEditWithLogic,
}: BuildInputColumnOptions): ColumnDef<Registro> {
	return {
		accessorKey: field,
		header: ({ column }) => {
			const allSame = registros.every(
				(r) => r[field] === registros[0]?.[field]
			);
			const defaultValue = allSame ? (registros[0]?.[field] ?? null) : null;

			return (
				<div className='flex items-center gap-2'>
					<DataTableColumnHeader column={column} title={label} />
					<DatePickerHeader
						defaultValue={defaultValue instanceof Date ? defaultValue : null}
						onMassiveEdit={(date) => {
							handleMassiveEditWithLogic(field, date);
						}}
					/>
				</div>
			);
		},
		cell: ({ row }) => {
			const rawValue = row.getValue(field);

			return (
				<div className='flex justify-start'>
					<DatePickerCell
						value={rawValue instanceof Date ? rawValue : null}
						onChange={(date) => {
							handleCellEdit(row.original.id, field, date);
						}}
					/>
				</div>
			);
		},
	};
}
