import useDialogState from '@/hooks/use-dialog-state';
import { Producto } from '@/lib/schemas/productos';
import {
	createContext,
	useContext,
	useState,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from 'react';

type ProductsDialogType = 'add' | 'edit' | 'delete';

interface ProductsContextType {
	open: ProductsDialogType | null;
	setOpen: (value: ProductsDialogType | null) => void;
	currentRow: Producto | null;
	setCurrentRow: Dispatch<SetStateAction<Producto | null>>;
}

const ProductosContext = createContext<ProductsContextType | undefined>(
	undefined
);

export function ProductosProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useDialogState<ProductsDialogType>(null);
	const [currentRow, setCurrentRow] = useState<Producto | null>(null);

	return (
		<ProductosContext.Provider
			value={{ open, setOpen, currentRow, setCurrentRow }}
		>
			{children}
		</ProductosContext.Provider>
	);
}

export function useProductos() {
	const context = useContext(ProductosContext);
	if (!context) {
		throw new Error('useProductos must be used inside a ProductosProvider');
	}
	return context;
}
