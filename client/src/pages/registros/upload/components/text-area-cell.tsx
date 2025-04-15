import { Textarea } from '@/components/ui/textarea'; // Assuming you have shadcn's Textarea
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TextAreaCellProps {
	initialValue: string | null;
	onSave: (newValue: string | null) => void;
}

export function TextAreaCell({ initialValue, onSave }: TextAreaCellProps) {
	const [inputValue, setInputValue] = useState(initialValue ?? '');

	return (
		<Textarea
			className={cn('h-4 w-64 resize-none')}
			placeholder='Opcional...'
			value={inputValue}
			onChange={(e) => setInputValue(e.target.value)}
			onBlur={() => {
				const trimmed = inputValue.trim();
				onSave(trimmed.length > 0 ? trimmed : null);
			}}
			onClick={(e) => e.stopPropagation()} // 🔥 Prevent table double click
			onKeyDown={(e) => {
				if (e.key === 'Enter' && !e.shiftKey) {
					(e.target as HTMLTextAreaElement).blur();
				}
			}}
		/>
	);
}
