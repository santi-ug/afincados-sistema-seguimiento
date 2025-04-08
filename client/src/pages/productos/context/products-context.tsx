import useDialogState from '@/hooks/use-dialog-state';
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from 'react';
import { Producto } from '../../../lib/schemas/productos';

type ProductsDialogType = 'add' | 'edit' | 'delete';

interface ProductsContextType {
	open: ProductsDialogType | null;
	setOpen: (str: ProductsDialogType | null) => void;
	currentRow: Producto | null;
	setCurrentRow: Dispatch<SetStateAction<Producto | null>>;
}

const ProductosContext = createContext<ProductsContextType | null>(null);

interface Props {
	children: ReactNode;
}

export default function ProductosProvider({ children }: Props) {
	const [open, setOpen] = useDialogState<ProductsDialogType>(null);
	const [currentRow, setCurrentRow] = useState<Producto | null>(null);

	return (
		<ProductosContext value={{ open, setOpen, currentRow, setCurrentRow }}>
			{children}
		</ProductosContext>
	);
}

export const useProductos = () => {
	const productosContext = useContext(ProductosContext);

	if (!productosContext) {
		throw new Error('useProducts must be used within a ProductsProvider');
	}
	return productosContext;
};
