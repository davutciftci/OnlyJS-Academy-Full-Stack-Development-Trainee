/**
 * API ve görsel URL'leri.
 * Production (VITE_API_URL=/api): nginx proxy kullanır, relative URL = aynı origin, CORS yok.
 * Development: localhost:3000.
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const API_BASE_URL = API_BASE;

/** Görsel URL'leri için base. /api ile bitiyorsa '' (relative), aksi halde origin. */
export const getBackendBaseUrl = (): string => {
    if (API_BASE === '/api' || API_BASE === '' || API_BASE.startsWith('/')) {
        return '';
    }
    return API_BASE.replace(/\/api\/?$/, '');
};
