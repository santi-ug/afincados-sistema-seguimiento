// components/date-picker-cell.tsx

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { es } from 'date-fns/locale';

interface DatePickerCellProps {
	value: Date | null;
	onChange: (newDate: Date) => void;
	label?: string;
	className?: string;
}

export function DatePickerCell({
	value,
	onChange,
	label = 'Seleccionar Fecha',
	className,
}: DatePickerCellProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					className={cn(
						'h-8 w-[150px] justify-start text-left font-normal',
						!value && 'text-muted-foreground',
						className
					)}
				>
					{value ? value.toLocaleDateString() : label}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0'>
				<Calendar
					mode='single'
					selected={value ?? undefined}
					onSelect={(date) => date && onChange(date)}
					initialFocus
					locale={es}
				/>
			</PopoverContent>
		</Popover>
	);
}
