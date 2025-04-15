import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface HoraCellProps {
	initialValue: string | null;
	onSave: (newValue: string | null) => void;
}

export function HoraCell({ initialValue, onSave }: HoraCellProps) {
	const [inputValue, setInputValue] = useState(initialValue ?? '');

	const isInvalid = inputValue && !/^\d{2}:\d{2}$/.test(inputValue);

	return (
		<Input
			type='text'
			className={cn('h-8 w-24', isInvalid && 'border-red-500')}
			placeholder='--:--'
			value={inputValue}
			onChange={(e) => setInputValue(e.target.value)}
			onBlur={() => {
				const trimmed = inputValue.trim();

				if (!trimmed) {
					onSave(null);
					return;
				}

				if (/^\d{2}:\d{2}$/.test(trimmed)) {
					onSave(trimmed);
				} else {
					// Invalid input: don't save, just stay red
				}
			}}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					(e.target as HTMLInputElement).blur();
				}
			}}
		/>
	);
}
