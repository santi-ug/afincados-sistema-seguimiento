import { cn } from '@/lib/utils';
import { Column } from '@tanstack/react-table';

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
}

export function DataTableColumnHeader<TData, TValue>({
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	return (
		<div
			className={cn(
				'flex items-center justify-start font-medium text-sm pr-8',
				className
			)}
		>
			{title}
		</div>
	);
}
