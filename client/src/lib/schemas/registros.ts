// src/lib/schemas/registros.ts
import { z } from 'zod';

// Enums
export const materialTypeSchema = z.enum([
	'CONDIMENTO',
	'HIERBAS',
	'REPOSTERIA',
]);
export const accionResultadoSchema = z.enum(['AC', 'RE']);

// Single Registro
export const registroSchema = z.object({
	id: z.number(),
	productoId: z.string(),
	gramaje: z.number(),
	cantidad: z.number(),

	empleadoId: z.number().nullable(),
	fechaProduccion: z
		.union([z.string(), z.date()])
		.nullable()
		.transform((val) => (val ? new Date(val) : null)),
	materialType: materialTypeSchema.nullable(),
	condVerificado: z.boolean().nullable(),
	hierbasVerificado: z.boolean().nullable(),
	reposteriaVerificado: z.boolean().nullable(),
	empaqueVerificado: z.boolean().nullable(),
	paquetesCantidad: z.number().nullable(),
	accionResultado: accionResultadoSchema.nullable(),
	cliente: z.string().nullable(),

	// Excel 2
	nombreProducto: z.string().nullable(),
	lote: z.string().nullable(),
	fechaVencimiento: z
		.union([z.string(), z.date()])
		.nullable()
		.transform((val) => (val ? new Date(val) : null)),
	paramCalidadEmpaque: z.boolean().nullable(),
	paramCalidadPeso: z.boolean().nullable(),
	paramCalidadSinPresenciaDeSustanciasExtranas: z.boolean().nullable(),
	hora: z.string().nullable(),
	observaciones: z.string().nullable(),

	// Excel 3
	olor: z.boolean().nullable(),
	color: z.boolean().nullable(),
	sabor: z.boolean().nullable(),
	varProcesoConforme: z.boolean().nullable(),
	empaqueConforme: z.boolean().nullable(),
	libera: z.boolean().nullable(),
	accionesCorrectivas: z.string().nullable(),

	archivoExcelId: z.number().nullable(),
});

// Registro List
export const registrosSchema = z.array(registroSchema);

// Input for creation/update (almost same, except id missing)
export const registroInputSchema = z.object({
	productoId: z.string(),
	gramaje: z.number(),
	cantidad: z.number(),

	empleadoId: z.number().nullable().optional(),
	fechaProduccion: z
		.union([z.string(), z.date()])
		.nullable()
		.transform((val) => (val ? new Date(val) : null)),
	materialType: materialTypeSchema.nullable().optional(),
	condVerificado: z.boolean().nullable().optional(),
	hierbasVerificado: z.boolean().nullable().optional(),
	reposteriaVerificado: z.boolean().nullable().optional(),
	empaqueVerificado: z.boolean().nullable().optional(),
	paquetesCantidad: z.number().nullable().optional(),
	accionResultado: accionResultadoSchema.nullable().optional(),
	cliente: z.string().nullable().optional(),

	nombreProducto: z.string().nullable().optional(),
	lote: z.string().nullable().optional(),
	fechaVencimiento: z
		.union([z.string(), z.date()])
		.nullable()
		.transform((val) => (val ? new Date(val) : null)),
	paramCalidadEmpaque: z.boolean().nullable().optional(),
	paramCalidadPeso: z.boolean().nullable().optional(),
	paramCalidadSinPresenciaDeSustanciasExtranas: z
		.boolean()
		.nullable()
		.optional(),
	hora: z
		.string()
		.nullable()
		.refine((val) => val === null || /^\d{2}:\d{2}$/.test(val), {
			message: 'Hora debe estar en formato HH:mm',
		}),
	observaciones: z.string().nullable().optional(),

	olor: z.boolean().nullable().optional(),
	color: z.boolean().nullable().optional(),
	sabor: z.boolean().nullable().optional(),
	varProcesoConforme: z.boolean().nullable().optional(),
	empaqueConforme: z.boolean().nullable().optional(),
	libera: z.boolean().nullable().optional(),
	accionesCorrectivas: z.string().nullable().optional(),

	archivoExcelId: z.number().nullable().optional(),
});

export const registroUpdateSchema = z.object({
	id: z.number(), // 🔥 You must have id to update

	productoId: z.string(),
	gramaje: z.number(),
	cantidad: z.number(),

	empleadoId: z.number(),
	fechaProduccion: z
		.union([z.string(), z.date()])
		.transform((val) => (val ? new Date(val) : null)),
	materialType: materialTypeSchema,
	condVerificado: z.boolean(),
	hierbasVerificado: z.boolean(),
	reposteriaVerificado: z.boolean(),
	empaqueVerificado: z.boolean(),
	paquetesCantidad: z.number(),
	accionResultado: accionResultadoSchema,
	cliente: z.string(),

	nombreProducto: z.string(),
	lote: z.string(),
	fechaVencimiento: z
		.union([z.string(), z.date()])
		.transform((val) => (val ? new Date(val) : null)),
	paramCalidadEmpaque: z.boolean(),
	paramCalidadPeso: z.boolean(),
	paramCalidadSinPresenciaDeSustanciasExtranas: z.boolean(),
	hora: z.string().refine((val) => val === null || /^\d{2}:\d{2}$/.test(val), {
		message: 'Hora debe estar en formato HH:mm',
	}),

	// 🔥 These two only can be nullable:
	observaciones: z.string().nullable(),
	accionesCorrectivas: z.string().nullable(),

	olor: z.boolean(),
	color: z.boolean(),
	sabor: z.boolean(),
	varProcesoConforme: z.boolean(),
	empaqueConforme: z.boolean(),
	libera: z.boolean(),

	archivoExcelId: z.number(),
});

// Registro List
export const registrosUpdateSchema = z.array(registroUpdateSchema);

export type Registro = z.infer<typeof registroSchema>;
export type Registros = z.infer<typeof registrosSchema>;
export type RegistroInput = z.infer<typeof registroInputSchema>;
export type RegistroUpdate = z.infer<typeof registroUpdateSchema>;
export type RegistrosUpdate = z.infer<typeof registrosUpdateSchema>;
