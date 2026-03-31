/**
 * Removes all trailing slashes from a URL
 * @param url - The URL to normalize
 * @returns The URL without trailing slashes
 * @example
 * normalizeBaseUrl('https://api.example.com/') // 'https://api.example.com'
 * normalizeBaseUrl('https://api.example.com//') // 'https://api.example.com'
 */
export const normalizeBaseUrl = (url: string): string => url.replace(/\/+$/, '');
