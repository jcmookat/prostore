import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
	return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
// Will take in number and return string
export function formatNumberWithDecimal(num: number): string {
	// toString() so that we can use the split() method
	const [int, decimal] = num.toString().split('.');

	//padEnd: 49.9 -> 49.90
	return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}
