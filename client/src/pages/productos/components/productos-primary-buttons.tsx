import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useProductos } from '../context/products-context'; // <-- productos context

export function ProductosPrimaryButton() {
	const { setOpen } = useProductos(); // <-- your custom hook for productos

	return (
		<div className='flex'>
			<Button className='space-x-1' onClick={() => setOpen('add')}>
				<span>Crear Producto</span> <Plus size={18} />
			</Button>
		</div>
	);
}
