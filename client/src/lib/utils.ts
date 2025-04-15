import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatBytes(
	bytes: number,
	opts: {
		decimals?: number;
		sizeType?: 'accurate' | 'normal';
	} = {}
) {
	const { decimals = 0, sizeType = 'normal' } = opts;

	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
	if (bytes === 0) return '0 Byte';
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
		sizeType === 'accurate'
			? (accurateSizes[i] ?? 'Bytes')
			: (sizes[i] ?? 'Bytes')
	}`;
}

export function formatValueForInput(value: unknown): string {
	if (value instanceof Date) {
		return value.toISOString().slice(0, 10); // 👉 'YYYY-MM-DD'
	}

	if (typeof value === 'string') {
		return value;
	}

	if (typeof value === 'number') {
		return String(value);
	}

	return '';
}

export function isValidDate(date: Date): boolean {
	if (!(date instanceof Date)) return false;
	if (isNaN(date.getTime())) return false;

	const today = new Date();
	today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

	return date <= today;
}

export function formatDateToYYYYMMDD(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function isValidDateYYYYMMDD(input: string): boolean {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) {
		return false; // Not even the right format
	}

	const [year, month, day] = input.split('-').map(Number);

	const testDate = new Date(year, month - 1, day);

	// 🔥 Verify that after creation, year/month/day are still the same
	return (
		testDate.getFullYear() === year &&
		testDate.getMonth() === month - 1 &&
		testDate.getDate() === day
	);
}
