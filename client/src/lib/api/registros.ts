import api from '@/lib/axios';
import {
	RegistroInput,
	registroInputSchema,
	Registros,
	registrosSchema,
	RegistroUpdate,
} from '../schemas/registros';

export async function getRegistros(): Promise<Registros> {
	try {
		const { data } = await api.get('/registros');
		console.log('data', data);

		return registrosSchema.parse(data); // validate at runtime
	} catch (error) {
		console.error('Error fetching registros:', error);
		throw error;
	}
}

export async function getRegistrosByArchivoExcelId(
	archivoExcelId: number
): Promise<Registros> {
	try {
		const { data } = await api.get(`/registros/archivo/${archivoExcelId}`);
		return registrosSchema.parse(data);
	} catch (error) {
		console.error('Error fetching registros by archivoExcelId:', error);
		throw error;
	}
}

interface UploadArchivoExcelResponse {
	message: string;
	filePath: string;
	archivoExcelId: number;
}

export async function uploadArchivoExcel(
	file: File
): Promise<UploadArchivoExcelResponse> {
	try {
		const formData = new FormData();
		formData.append('excelFile', file);

		const { data } = await api.post('/archivos-excel/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		console.log('Archivo procesado correctamente:', data);
		return data;
	} catch (error) {
		console.error('Error subiendo archivo Excel:', error);
		throw error;
	}
}

export async function updateRegistro(
	id: string,
	payload: RegistroInput
): Promise<RegistroInput> {
	try {
		const { data } = await api.put(`/registros/${id}`, payload);
		return registroInputSchema.parse(data);
	} catch (error) {
		console.error('Error updating registro:', error);
		throw error;
	}
}
export async function updateRegistrosBulk(registros: RegistroUpdate[]) {
	console.log(registros, 'registros bulk update');

	try {
		const response = await api.put('/registros/bulk-update', {
			registros,
		});

		return response.data;
	} catch (error) {
		console.error('Error updating registro:', error);
		throw error;
	}
}

export async function deleteRegistro(id: string): Promise<void> {
	try {
		const { data } = await api.delete(`/registros/${id}`);
		return data;
	} catch (error) {
		console.error('Error deleting registro:', error);
		throw error;
	}
}

interface DownloadExcelParams {
	startDate: string;
	endDate: string;
	format: 'liberacion' | 'despacho' | 'empaque';
}

export async function downloadExcel(
	params: DownloadExcelParams
): Promise<Blob> {
	const response = await api.post('/registros/download-excel', params, {
		responseType: 'blob', // 👈 VERY IMPORTANT! so Axios treats it as a file
	});

	return response.data;
}
