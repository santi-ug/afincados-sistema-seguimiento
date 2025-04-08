import { z } from 'zod';

// Categoria
export const categoriaSchema = z.enum(['Hierbas', 'Condimentos', 'Reposteria']);

// Categoria Options
export const categoriaOptions = categoriaSchema.options;

// Single Product
export const productoSchema = z.object({
	id: z.string(),
	nombre: z.string(),
	gramajes: z.array(z.number()),
	categoria: categoriaSchema,
	Registros: z.array(z.unknown()), // Assuming Registros is an array of objects (empty right now)
});

// Product List
export const productosSchema = z.array(productoSchema);

// Create Product
export const createProductoSchema = z.object({
	nombre: z.string().min(1, 'Nombre es requerido'),
	gramajes: z.array(z.number()).min(1, 'Gramajes es requerido'),
	categoria: categoriaSchema.refine(
		(val) => categoriaSchema.options.includes(val),
		{
			message: 'Por favor, especifique una categoría válida',
		}
	),
});

// Update Product (igual que create)
export const updateProductoSchema = createProductoSchema;

// Deleteable Product
export const deleteableProductoSchema = productoSchema.refine(
	(p) => p.Registros.length === 0,
	{
		message: 'No se puede eliminar un producto con registros asociados',
	}
);

export type Categoria = z.infer<typeof categoriaSchema>;
export type Producto = z.infer<typeof productoSchema>;
export type Productos = z.infer<typeof productosSchema>;
export type CreateProducto = z.infer<typeof createProductoSchema>;
export type UpdateProducto = z.infer<typeof updateProductoSchema>;
