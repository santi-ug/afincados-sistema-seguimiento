import api from '@/lib/axios';
import {
	Empleado,
	EmpleadoInput,
	Empleados,
	empleadoSchema,
	empleadosSchema,
} from '../schemas/empleados'; // <-- notice schema, not types

export async function getEmpleados(): Promise<Empleados> {
	try {
		const { data } = await api.get('/empleados');
		return empleadosSchema.parse(data); // validate at runtime
	} catch (error) {
		console.error('Error fetching empleados:', error);
		throw error;
	}
}

export async function createEmpleado(
	payload: EmpleadoInput
): Promise<Empleado> {
	try {
		const { data } = await api.post('/empleados', payload);
		return empleadoSchema.parse(data); // validate at runtime
	} catch (error) {
		console.error('Error creating empleado:', error);
		throw error;
	}
}

export async function updateEmpleado(
	id: string,
	payload: EmpleadoInput
): Promise<Empleado> {
	try {
		const { data } = await api.put(`/empleados/${id}`, payload);
		return empleadoSchema.parse(data); // validate at runtime
	} catch (error) {
		console.error('Error updating empleado:', error);
		throw error;
	}
}

export async function deleteEmpleado(id: string): Promise<void> {
	try {
		const { data } = await api.delete(`/empleados/${id}`);
		return data; // Assuming the API returns a success message or similar
	} catch (error) {
		console.error('Error deleting empleado:', error);
		throw error;
	}
}
