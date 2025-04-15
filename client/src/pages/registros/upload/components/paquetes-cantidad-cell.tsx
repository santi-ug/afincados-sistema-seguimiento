// components/cells/PaquetesCantidadCell.tsx
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PaquetesCantidadCellProps {
	initialValue: number | null | undefined;
	rowId: number;
	handleSave: (rowId: number, value: number | null) => void;
}

export function PaquetesCantidadCell({
	initialValue,
	rowId,
	handleSave,
}: PaquetesCantidadCellProps) {
	const [value, setValue] = useState(
		initialValue !== null && initialValue !== undefined
			? String(initialValue)
			: ''
	);

	const isInvalid = value !== '' && isNaN(Number(value));

	const save = () => {
		const trimmed = value.trim();
		if (trimmed === '' || isNaN(Number(trimmed))) {
			handleSave(rowId, null);
			return;
		}

		const numericValue = parseInt(trimmed, 10);
		handleSave(rowId, numericValue);
	};

	return (
		<Input
			type='number'
			inputMode='numeric'
			step='1'
			min='0'
			className={cn('h-8 w-24', isInvalid && 'border-red-500')}
			value={value}
			onChange={(e) => setValue(e.target.value)}
			onBlur={save}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					save();
					(e.target as HTMLInputElement).blur();
				}
			}}
			onPointerDownCapture={(e) => e.stopPropagation()}
			onFocusCapture={(e) => e.stopPropagation()}
			onClick={(e) => e.stopPropagation()}
			placeholder='0'
		/>
	);
}
