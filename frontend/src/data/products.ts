export interface Aroma {
    id: number;
    name: string;
}

export interface Size {
    id: number;
    name: string;
    price: number;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    category: string;
    categorySlug: string;
    price: number;
    oldPrice: number | null;
    discountPercentage: number | null;
    rating: number;
    reviews: number;
    image: string;
    images?: string[];
    aromas?: Aroma[];
    sizes?: Size[];
    nutritionalInfo?: string[];
    usage?: string[];
    fullDescription?: string;
}

export interface Review {
    id: number;
    productId: number;
    userName: string;
    rating: number;
    date: string;
    comment: string;
    verified: boolean;
}
