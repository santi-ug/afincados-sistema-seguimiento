import { Main } from '@/components/layout/main';
import { useEffect, useState } from 'react';
import { getProductos } from '../../lib/api/productos';
import { Producto } from '../../lib/schemas/productos';
import { columns } from './components/productos-columns';
import { ProductosPrimaryButton } from './components/productos-primary-buttons';
import { ProductosTable } from './components/productos-table';
import ProductosProvider from './context/products-context';

export default function Productos() {
	const [productos, setProductos] = useState<Producto[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProductos = async () => {
			try {
				const data = await getProductos();
				setProductos(data);
			} catch (err) {
				setError('Error fetching productos');
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchProductos();
	}, []);

	if (loading) {
		return <div>Cargando productos...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<ProductosProvider>
			<Main>
				<div className='w-full mb-2 flex flex-wrap items-center justify-between space-y-2'>
					<div>
						<h2 className='text-2xl font-bold tracking-tight'>Productos</h2>
						<p className='text-muted-foreground'>
							Administra los productos de tu tienda. Puedes crear, editar y
							eliminar productos.
						</p>
					</div>
					<ProductosPrimaryButton />
				</div>

				<div className='flex-1 overflow-auto py-1'>
					<ProductosTable data={productos} columns={columns} />
				</div>
			</Main>
		</ProductosProvider>
	);
}
