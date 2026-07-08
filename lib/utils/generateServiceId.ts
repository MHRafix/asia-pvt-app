import { DailyService } from '@/lib/models/DailyService';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generate a random 5-character alphanumeric service ID
 */
function generateRandomId(): string {
	let result = '';
	for (let i = 0; i < 5; i++) {
		result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
	}
	return result;
}

/**
 * Generate a unique 5-character service ID
 * Ensures the ID doesn't already exist in the database
 */
export async function generateUniqueServiceId(): Promise<string> {
	let serviceId = generateRandomId();
	let isUnique = false;

	// Keep generating until we find a unique ID
	while (!isUnique) {
		const existingService = await DailyService.findOne({ serviceId });
		if (!existingService) {
			isUnique = true;
		} else {
			serviceId = generateRandomId();
		}
	}

	return serviceId;
}
