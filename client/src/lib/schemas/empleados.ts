import { z } from 'zod';

// Single Employee
export const empleadoSchema = z.object({
	id: z.number(),
	nombre: z.string(),
	Registros: z.array(z.unknown()).optional(), // 🔥 .optional() added here
});

// Employee List
export const empleadosSchema = z.array(empleadoSchema);

// Create / Update Employee (Input)
export const empleadoInputSchema = z.object({
	nombre: z
		.string()
		.min(1, 'Nombre es requerido')
		.regex(
			/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
			'El nombre solo puede contener letras y espacios.'
		),
});

// Deleteable Employee (if needed later)
export const deleteableEmpleadoSchema = empleadoSchema.refine(
	(empleado) => (empleado.Registros?.length ?? 0) === 0,
	{
		message: 'No se puede eliminar un empleado con registros asociados',
	}
);

// TypeScript types
export type Empleado = z.infer<typeof empleadoSchema>;
export type Empleados = z.infer<typeof empleadosSchema>;
export type EmpleadoInput = z.infer<typeof empleadoInputSchema>;
