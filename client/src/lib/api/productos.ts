import api from '@/lib/axios';
import {
	ProductoInput,
	productoInputSchema,
	Productos,
	productosSchema,
} from '../schemas/productos'; // <-- notice schema, not types

export async function getProductos(): Promise<Productos> {
	try {
		const { data } = await api.get('/productos');
		return productosSchema.parse(data); // validate at runtime
	} catch (error) {
		console.error('Error fetching productos:', error);
		throw error;
	}
}

export async function createProducto(
	payload: ProductoInput
): Promise<ProductoInput> {
	try {
		const { data } = await api.post('/productos', payload);
		return productoInputSchema.parse(data); // validate at runtime
	} catch (error) {
		console.error('Error creating producto:', error);
		throw error;
	}
}

export async function updateProducto(
	id: string,
	payload: ProductoInput
): Promise<ProductoInput> {
	try {
		const { data } = await api.put(`/productos/${id}`, payload);
		return productoInputSchema.parse(data); // validate at runtime
	} catch (error) {
		console.error('Error updating producto:', error);
		throw error;
	}
}

export async function deleteProducto(id: string): Promise<void> {
	try {
		const { data } = await api.delete(`/productos/${id}`);
		return data; // Assuming the API returns a success message or similar
	} catch (error) {
		console.error('Error deleting producto:', error);
		throw error;
	}
}
