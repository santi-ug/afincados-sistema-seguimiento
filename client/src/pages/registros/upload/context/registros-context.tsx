import useDialogState from '@/hooks/use-dialog-state';
import { Registro } from '@/lib/schemas/registros'; // <-- Asegúrate de crear este schema
import {
	createContext,
	useContext,
	useState,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from 'react';

type RegistrosDialogType = 'add' | 'edit' | 'delete';

interface RegistrosContextType {
	open: RegistrosDialogType | null;
	setOpen: (value: RegistrosDialogType | null) => void;
	currentRow: Registro | null;
	setCurrentRow: Dispatch<SetStateAction<Registro | null>>;
}

const RegistrosContext = createContext<RegistrosContextType | undefined>(
	undefined
);

export function RegistrosProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useDialogState<RegistrosDialogType>(null);
	const [currentRow, setCurrentRow] = useState<Registro | null>(null);

	return (
		<RegistrosContext.Provider
			value={{ open, setOpen, currentRow, setCurrentRow }}
		>
			{children}
		</RegistrosContext.Provider>
	);
}

export function useRegistros() {
	const context = useContext(RegistrosContext);
	if (!context) {
		throw new Error('useRegistros must be used inside a RegistrosProvider');
	}
	return context;
}
