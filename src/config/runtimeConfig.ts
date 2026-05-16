const normalizeApiBaseUrl = (value: string) => value.trim().replace(/\/$/, '');

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL || '/api');
export const DASHBOARD_PASSWORD = import.meta.env.VITE_DASHBOARD_PASSWORD?.trim() || '00000008';
