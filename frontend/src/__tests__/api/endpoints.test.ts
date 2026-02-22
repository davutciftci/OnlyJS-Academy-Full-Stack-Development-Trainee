import { ENDPOINTS } from '../../api/endpoints';
import { describe, it, expect } from 'vitest';

describe('ENDPOINTS', () => {
    it('kategori URL fonksiyonları doğru çalışmalıdır', () => {
        expect(ENDPOINTS.CATEGORIES.BY_ID(5)).toBe('/categories/5');
    });

    it('ürün URL fonksiyonları doğru çalışmalıdır', () => {
        expect(ENDPOINTS.PRODUCTS.BY_ID(10)).toBe('/products/10');
    });

    it('varyant URL fonksiyonları doğru çalışmalıdır', () => {
        expect(ENDPOINTS.VARIANTS.BY_PRODUCT(1)).toBe('/variants/product/1');
        expect(ENDPOINTS.VARIANTS.BY_ID(2)).toBe('/variants/2');
    });

    it('fotoğraf URL fonksiyonları doğru çalışmalıdır', () => {
        expect(ENDPOINTS.PHOTOS.BY_PRODUCT(3)).toBe('/photos/product/3');
    });

    it('yorum URL fonksiyonları doğru çalışmalıdır', () => {
        expect(ENDPOINTS.COMMENTS.BY_PRODUCT(4)).toBe('/comments/product/4');
        expect(ENDPOINTS.COMMENTS.BY_ID(5)).toBe('/comments/5');
    });

    it('adres URL fonksiyonları doğru çalışmalıdır', () => {
        expect(ENDPOINTS.ADDRESSES.BY_ID(6)).toBe('/addresses/6');
    });

    it('sepet URL fonksiyonları doğru çalışmalıdır', () => {
        expect(ENDPOINTS.CART.ITEM_BY_ID(7)).toBe('/cart/items/7');
    });

    it('sipariş URL fonksiyonları doğru çalışmalıdır', () => {
        expect(ENDPOINTS.ORDERS.BY_ID(8)).toBe('/orders/8');
        expect(ENDPOINTS.ORDERS.CANCEL(9)).toBe('/orders/9/cancel');
    });

    it('ödeme URL fonksiyonları doğru çalışmalıdır', () => {
        expect(ENDPOINTS.PAYMENT.STATUS(123)).toBe('/payments/status/123');
    });
});
