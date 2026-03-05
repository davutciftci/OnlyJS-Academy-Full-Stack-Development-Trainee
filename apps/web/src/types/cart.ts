import type { ProductVariant, Product } from './product';

export interface CartItem {
    id: number;
    quantity: number;
    variantId: number;
    variant: ProductVariant & {
        product: Pick<Product, 'id' | 'name' | 'slug' | 'description'> & {
            photos?: Array<{ url: string; isPrimary: boolean }>;
        };
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface CartUIItem {
    id: number;
    name: string;
    cartItemId: number;
    description: string;
    price: number;
    image: string;
    quantity: number;
    aroma?: string;
    size?: string | number;
    variantId?: number;
    slug?: string;
    categorySlug?: string;
    photos?: {
        url: string;
        isPrimary?: boolean;
        displayOrder?: number;
    }[];
}

export interface NutritionValue {
    name: string;
    value: string;
    unit: string;
}

export interface NutritionValues {
    values: NutritionValue[];
}

export interface AminoAcids {
    [key: string]: string | number;
}

export interface Cart {
    id: number;
    userId: number;
    items: CartItem[];
    createdAt?: string;
    updatedAt?: string;
}

export interface CartSummary {
    itemCount: number;
    totalPrice: string;
}

export interface CartResponse {
    cart: Cart;
    summary: CartSummary;
}

export interface AddToCartRequest {
    variantId: number;
    quantity: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
}
