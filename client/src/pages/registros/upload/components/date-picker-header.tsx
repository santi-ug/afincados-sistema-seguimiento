import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface DatePickerHeaderProps {
	defaultValue: Date | null;
	onMassiveEdit: (newDate: Date) => void;
}

export function DatePickerHeader({
	defaultValue,
	onMassiveEdit,
}: DatePickerHeaderProps) {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		defaultValue ?? undefined
	);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					className={cn(
						'h-8 w-36 justify-start text-left font-normal',
						!selectedDate && 'text-muted-foreground'
					)}
				>
					{selectedDate
						? selectedDate.toLocaleDateString()
						: 'Seleccionar Fecha'}{' '}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0'>
				<Calendar
					mode='single'
					selected={selectedDate}
					onSelect={(date) => {
						if (date) {
							setSelectedDate(date);
							onMassiveEdit(date); // 🔥 apply massive edit
						}
					}}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
