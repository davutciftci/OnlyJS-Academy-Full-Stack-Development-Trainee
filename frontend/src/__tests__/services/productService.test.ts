import { productService } from '../../services/productService';
import { apiClient } from '../../api/client';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Product, PaginatedResponse } from '../../types';

describe('productService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getProducts tüm ürünleri döndürür', async () => {
        const mockProducts: Partial<Product>[] = [
            { id: 1, name: 'Protein Tozu' },
            { id: 2, name: 'Kreatin' }
        ];
        vi.mocked(apiClient.get).mockResolvedValue({ data: { data: mockProducts } });

        const result = await productService.getProducts();

        expect(apiClient.get).toHaveBeenCalled();
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Protein Tozu');
    });

    it('getProducts data null geldiğinde boş dizi döndürmelidir', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: { data: null } });
        const result = await productService.getProducts();
        expect(result).toEqual([]);
    });

    it('getProductById ilgili ürünü döndürür', async () => {
        const mockProduct: Partial<Product> = { id: 1, name: 'Protein Tozu' };
        vi.mocked(apiClient.get).mockResolvedValue({ data: { data: mockProduct } });

        const result = await productService.getProductById(1);

        expect(apiClient.get).toHaveBeenCalled();
        expect(result.name).toBe('Protein Tozu');
    });

    it('getProductById hata durumunda hata fırlatır', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: { data: null, message: 'Bulunamadı' } });

        await expect(productService.getProductById(999)).rejects.toThrow('Bulunamadı');
    });

    it('getProductById mesaj gelmezse fallback kullanmalıdır', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: { data: null } });
        await expect(productService.getProductById(999)).rejects.toThrow('Ürün bulunamadı');
    });

    it('getProductBySlug ilgili ürünü döndürür', async () => {
        const mockProduct: Partial<Product> = { id: 1, name: 'Slug Ürün', slug: 'slug-urun' };
        vi.mocked(apiClient.get).mockResolvedValue({ data: { data: mockProduct } });

        const result = await productService.getProductBySlug('slug-urun');

        expect(apiClient.get).toHaveBeenCalledWith('/products/slug/slug-urun');
        expect(result.name).toBe('Slug Ürün');
    });

    it('getProductBySlug hata durumunda hata fırlatır', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: { data: null } });

        await expect(productService.getProductBySlug('gecersiz')).rejects.toThrow('Ürün bulunamadı');
    });

    it('searchProducts arama sonuçlarını döndürür', async () => {
        const mockProducts: Partial<Product>[] = [{ id: 1, name: 'Aranan Ürün' }];
        vi.mocked(apiClient.get).mockResolvedValue({ data: { data: mockProducts } });

        const result = await productService.searchProducts({ search: 'test' });

        expect(apiClient.get).toHaveBeenCalledWith('/products/search', { params: { search: 'test' } });
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Aranan Ürün');
    });

    it('searchProducts data null geldiğinde boş dizi döndürmelidir', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: { data: null } });
        const result = await productService.searchProducts({ search: 'x' });
        expect(result).toEqual([]);
    });

    it('getPaginatedProducts sayfalanmış veri döndürür', async () => {
        const mockPaginatedResponse: PaginatedResponse<Partial<Product>> = {
            status: 'success',
            data: [{ id: 1, name: 'Ürün' }],
            pagination: {
                totalPages: 5,
                currentPage: 1,
                totalProducts: 50,
                productsPerPage: 10,
                hasNextPage: true,
                hasPreviousPage: false
            }
        };
        vi.mocked(apiClient.get).mockResolvedValue({ data: mockPaginatedResponse });

        const result = await productService.getPaginatedProducts({ page: 1, limit: 10 });

        expect(apiClient.get).toHaveBeenCalled();
        expect(result.pagination.totalPages).toBe(5);
        expect(result.data).toHaveLength(1);
    });
});
