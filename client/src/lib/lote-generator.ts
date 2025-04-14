/**
 * Genera un código de lote según el formato especificado:
 * - 2 dígitos: código del producto (numérico)
 * - 2 dígitos: día del mes
 * - 2 dígitos: mes
 * - 2 dígitos: suma de los últimos 2 dígitos del año
 * - 2 dígitos: código del empleado
 */
export function generateLoteCode(
	codigoProducto: string,
	fechaInput: Date | string = new Date(),
	codigoEmpleado: string
): string {
	const fecha =
		typeof fechaInput === 'string'
			? parseDateFromYYYYMMDDAndFix(fechaInput)
			: fechaInput;

	// Increment the day by 1 and handle month/year overflow
	fecha.setDate(fecha.getDate() + 1);

	// Limpiar para asegurar que el código del producto sean solo dígitos
	const cleanProductCode = codigoProducto.replace(/\D/g, '').padStart(2, '0');

	// Obtener día y mes
	const day = fecha.getDate().toString().padStart(2, '0');
	const month = (fecha.getMonth() + 1).toString().padStart(2, '0');

	// Calcular suma de los últimos 2 dígitos del año
	const lastTwoDigitsOfYear = fecha.getFullYear().toString().slice(-2);
	const sumYearDigits = lastTwoDigitsOfYear
		.split('')
		.reduce((sum, digit) => sum + parseInt(digit, 10), 0)
		.toString()
		.padStart(2, '0');

	// Limpiar para asegurar que el código del empleado sean solo dígitos
	const cleanEmployeeCode = codigoEmpleado.replace(/\D/g, '').padStart(2, '0');

	// Construir el código de lote
	return `${cleanProductCode}${day}${month}${sumYearDigits}${cleanEmployeeCode}`;
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
	// Verificar que el código tenga el formato correcto (10 dígitos numéricos)
	if (!/^\d{10}$/.test(loteCode)) {
		return null;
	}

	return {
		codigoProducto: loteCode.slice(0, 2),
		dia: loteCode.slice(2, 4),
		mes: loteCode.slice(4, 6),
		sumaAño: loteCode.slice(6, 8),
		codigoEmpleado: loteCode.slice(8, 10),
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
			? parseInt(monthNumber, 10) - 1
			: monthNumber - 1;

	return months[index] ?? '';
}

export function parseDateFromYYYYMMDDAndFix(input: string): Date {
	const [year, month, day] = input.split('-').map(Number);

	const date = new Date(year, month - 1, day);

	// 🔥 Now manually add 1 day safely
	date.setDate(date.getDate() + 1);

	return date;
}
