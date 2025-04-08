import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Edit, Trash } from 'lucide-react';

import { Row } from '@tanstack/react-table';
import { Producto } from '../../../lib/schemas/productos'; // <-- import Producto type
import { useProductos } from '../context/products-context'; // <-- your productos context

interface DataTableRowActionsProps {
	row: Row<Producto>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
	const { setOpen, setCurrentRow } = useProductos(); // <- your custom hook for Productos
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
				>
					<DotsHorizontalIcon className='h-4 w-4' />
					<span className='sr-only'>Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-[160px]'>
				<DropdownMenuItem
					onClick={() => {
						setCurrentRow(row.original); // sets the current Producto
						setOpen('edit'); // opens the edit modal
					}}
				>
					Edit
					<DropdownMenuShortcut>
						<Edit size={16} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						setCurrentRow(row.original); // sets the current Producto
						setOpen('delete'); // opens the delete modal
					}}
					className='!text-red-500'
				>
					Delete
					<DropdownMenuShortcut>
						<Trash size={16} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
