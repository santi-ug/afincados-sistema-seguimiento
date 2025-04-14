/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input';
import { Registro } from '@/lib/schemas/registros';
import {
	cn,
	formatValueForInput,
	isValidDate,
	isValidDateYYYYMMDD,
} from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
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
	placeholderHeader,
	placeholderCell,
}: BuildInputColumnOptions): ColumnDef<Registro> {
	return {
		accessorKey: field,
		header: ({ column }) => {
			const allSame = registros.every(
				(r) => r[field] === registros[0]?.[field]
			);
			const defaultValue = allSame ? (registros[0]?.[field] ?? '') : '';

			return (
				<div className='flex items-center gap-2'>
					<DataTableColumnHeader column={column} title={label} />
					<Input
						type='text'
						className={cn('h-8 w-36', !allSame && 'border-yellow-400')}
						defaultValue={String(defaultValue ?? '')}
						onBlur={(e) => {
							const value = e.target.value.trim();
							if (value) {
								handleMassiveEditWithLogic(field, value); // 🔥 JUST SEND field + value
							}
						}}
						placeholder={placeholderHeader}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								(e.target as HTMLInputElement).blur();
							}
						}}
					/>
				</div>
			);
		},

		cell: ({ row }) => (
			<div className='flex justify-start'>
				<Input
					type='text'
					className={cn(
						'h-8 w-36',
						field === 'fechaProduccion' &&
							(!isValidDate(row.getValue(field)) ||
								!isValidDateYYYYMMDD(row.getValue(field))) &&
							'border-red-500',
						field === 'cliente' &&
							(() => {
								const value = row.getValue(field) as string;
								if (!value || value.trim() === '') return true;

								const normalized = value
									.normalize('NFD')
									.replace(/[\u0300-\u036f]/g, '')
									.toUpperCase();

								return !(normalized === 'RUTA UNICA' || value.trim() !== '');
							})() &&
							'border-red-500'
					)}
					defaultValue={formatValueForInput(row.getValue(field))}
					onBlur={(e) => {
						const value = e.target.value.trim();
						handleCellEdit(row.original.id, field, value);
					}}
					placeholder={placeholderCell}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							(e.target as HTMLInputElement).blur();
						}
					}}
				/>
			</div>
		),
	};
}
