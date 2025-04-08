/**
 * Genera un código de lote según el formato especificado:
 * - primeros 2 dígitos: código del producto
 * - segundos 2 dígitos: día del mes
 * - terceros 2 dígitos: mes
 * - cuartos 2 dígitos: suma de los últimos 2 dígitos del año
 * - últimos 2 dígitos: código del empleado
 */
export function generateLoteCode(
	codigoProducto: string,
	fecha: Date = new Date(),
	codigoEmpleado: string
): string {
	// Asegurar que el código de producto tenga 2 dígitos
	const productCode = codigoProducto.padStart(2, '0');

	// Obtener día y mes
	const day = fecha.getDate().toString().padStart(2, '0');
	const month = (fecha.getMonth() + 1).toString().padStart(2, '0');

	// Calcular suma de los últimos 2 dígitos del año
	const year = fecha.getFullYear().toString();
	const lastTwoDigits = year.slice(-2);
	const sumYear = lastTwoDigits
		.split('')
		.reduce((sum, digit) => sum + Number.parseInt(digit), 0)
		.toString()
		.padStart(2, '0');

	// Asegurar que el código de empleado tenga 2 dígitos
	const employeeCode = codigoEmpleado.padStart(2, '0');

	// Construir el código de lote
	return `${productCode}${day}${month}${sumYear}${employeeCode}`;
}

/**
 * Extrae información de un código de lote
 */
export function parseLoteCode(loteCode: string): {
	codigoProducto: string;
	dia: string;
	mes: string;
	sumaAño: string;
	codigoEmpleado: string;
} | null {
	// Verificar que el código tenga el formato correcto (10 dígitos)
	if (loteCode.length !== 10 || !/^\d+$/.test(loteCode)) {
		return null;
	}

	return {
		codigoProducto: loteCode.substring(0, 2),
		dia: loteCode.substring(2, 4),
		mes: loteCode.substring(4, 6),
		sumaAño: loteCode.substring(6, 8),
		codigoEmpleado: loteCode.substring(8, 10),
	};
}

/**
 * Obtiene el nombre del mes a partir de su número
 */
export function getMonthName(monthNumber: string | number): string {
	const months = [
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre',
	];

	const index =
		typeof monthNumber === 'string'
			? Number.parseInt(monthNumber) - 1
			: monthNumber - 1;

	return months[index] || '';
}
