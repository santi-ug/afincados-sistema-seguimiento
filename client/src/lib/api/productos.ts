import api from '@/lib/axios';
import { Productos, productosSchema } from '../schemas/productos'; // <-- notice schema, not types

export async function getProductos(): Promise<Productos> {
	const { data } = await api.get('/productos');
	return productosSchema.parse(data); //  validate at runtime
}
