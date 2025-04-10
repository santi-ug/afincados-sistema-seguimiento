import useDialogState from '@/hooks/use-dialog-state';
import { Empleado } from '@/lib/schemas/empleados';
import {
	createContext,
	useContext,
	useState,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from 'react';

type EmpleadosDialogType = 'add' | 'edit' | 'delete';

interface EmpleadosContextType {
	open: EmpleadosDialogType | null;
	setOpen: (value: EmpleadosDialogType | null) => void;
	currentRow: Empleado | null;
	setCurrentRow: Dispatch<SetStateAction<Empleado | null>>;
}

const EmpleadosContext = createContext<EmpleadosContextType | undefined>(
	undefined
);

export function EmpleadosProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useDialogState<EmpleadosDialogType>(null);
	const [currentRow, setCurrentRow] = useState<Empleado | null>(null);

	return (
		<EmpleadosContext.Provider
			value={{ open, setOpen, currentRow, setCurrentRow }}
		>
			{children}
		</EmpleadosContext.Provider>
	);
}

export function useEmpleados() {
	const context = useContext(EmpleadosContext);
	if (!context) {
		throw new Error('useEmpleados must be used inside an EmpleadosProvider');
	}
	return context;
}
