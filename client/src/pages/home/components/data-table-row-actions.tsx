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

import { Registro } from '@/lib/schemas/registros'; // <-- tipo Registro
import { Row } from '@tanstack/react-table';
import { useRegistros } from '../context/registros-context'; // <-- tu hook de contexto Registros

interface DataTableRowActionsProps {
	row: Row<Registro>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
	const { setOpen, setCurrentRow } = useRegistros(); // tu contexto de Registros

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
						setCurrentRow(row.original); // sets the current Registro
						setOpen('edit'); // abre el modal de editar
					}}
				>
					Editar
					<DropdownMenuShortcut>
						<Edit size={16} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						setCurrentRow(row.original); // sets the current Registro
						setOpen('delete'); // abre el modal de eliminar
					}}
					className='!text-red-500'
				>
					Eliminar
					<DropdownMenuShortcut>
						<Trash size={16} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
