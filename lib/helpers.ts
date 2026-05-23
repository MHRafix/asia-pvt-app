/**
 * Common helper functions for the travel agency app
 */

/**
 * Format price with currency symbol
 */
export const formatPrice = (price: number, currency = 'USD'): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(price);
};

/**
 * Format date in a readable format
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date range
 */
export const formatDateRange = (startDate: string | Date, endDate: string | Date): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${startStr} - ${endStr}`;
};

/**
 * Calculate trip duration in days
 */
export const calculateDuration = (startDate: string | Date, endDate: string | Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, length = 100): string => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

/**
 * Get discount percentage
 */
export const getDiscountPercentage = (originalPrice: number, discountedPrice: number): number => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Generate slug from text
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};
