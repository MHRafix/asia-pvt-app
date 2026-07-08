/**
 * Format currency in BDT (Bangladeshi Taka)
 */
export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('bn-BD', {
		style: 'currency',
		currency: 'BDT',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(amount);
}

/**
 * Format date in a readable format
 */
export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date(date));
}

/**
 * Format date only (without time)
 */
export function formatDateOnly(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	}).format(new Date(date));
}

/**
 * Format time only
 */
export function formatTime(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
	}).format(new Date(date));
}

/**
 * Get status badge color based on service status
 */
export function getStatusColor(
	status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold' | 'paid' | 'partial' | 'failed' | 'refunded'
): string {
	const colors: Record<string, string> = {
		pending: 'bg-yellow-100 text-yellow-800',
		in_progress: 'bg-blue-100 text-blue-800',
		completed: 'bg-green-100 text-green-800',
		cancelled: 'bg-red-100 text-red-800',
		on_hold: 'bg-orange-100 text-orange-800',
		paid: 'bg-green-100 text-green-800',
		partial: 'bg-yellow-100 text-yellow-800',
		failed: 'bg-red-100 text-red-800',
		refunded: 'bg-purple-100 text-purple-800',
	};
	return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Get status label from status value
 */
export function getStatusLabel(
	status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold' | 'paid' | 'partial' | 'failed' | 'refunded'
): string {
	const labels: Record<string, string> = {
		pending: 'Pending',
		in_progress: 'In Progress',
		completed: 'Completed',
		cancelled: 'Cancelled',
		on_hold: 'On Hold',
		paid: 'Paid',
		partial: 'Partial',
		failed: 'Failed',
		refunded: 'Refunded',
	};
	return labels[status] || status;
}
