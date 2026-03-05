import { apiClient } from '../api/client';

export const uploadProductPhoto = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await apiClient.post<{ status: string; data: { url: string } }>('/photos/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    if (response.data.status === 'success' && response.data.data) {
        return response.data.data.url;
    }

    throw new Error('Fotoğraf yüklenemedi');
};
