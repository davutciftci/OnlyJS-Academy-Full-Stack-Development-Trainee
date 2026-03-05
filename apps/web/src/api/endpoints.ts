export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/user/login',
        REGISTER: '/user/register',
        ME: '/user/me',
        VERIFY_EMAIL: '/user/verify-email',
        RESEND_VERIFICATION: '/user/resend-verification',
    },
    CATEGORIES: {
        LIST: '/categories',
        BY_ID: (id: number) => `/categories/${id}`,
    },
    PRODUCTS: {
        LIST: '/products',
        BY_ID: (id: number) => `/products/${id}`,
        SEARCH: '/products/search',
        PAGINATED: '/products/paginated',
    },
    VARIANTS: {
        BY_PRODUCT: (productId: number) => `/variants/product/${productId}`,
        BY_ID: (id: number) => `/variants/${id}`,
    },
    PHOTOS: {
        BY_PRODUCT: (productId: number) => `/photos/product/${productId}`,
    },
    COMMENTS: {
        APPROVED: '/comments/approved',
        BY_PRODUCT: (productId: number) => `/comments/product/${productId}`,
        MY_COMMENTS: '/comments/my/comments',
        CREATE: '/comments',
        BY_ID: (id: number) => `/comments/${id}`,
    },
    ADDRESSES: {
        MY: '/addresses/my',
        BY_ID: (id: number) => `/addresses/${id}`,
        CREATE: '/addresses',
    },
    CART: {
        GET: '/cart',
        ITEMS: '/cart/items',
        ITEM_BY_ID: (itemId: number) => `/cart/items/${itemId}`,
        CLEAR: '/cart',
    },
    ORDERS: {
        MY: '/orders/my',
        BY_ID: (id: number) => `/orders/${id}`,
        CREATE: '/orders',
        CANCEL: (id: number) => `/orders/${id}/cancel`,
    },
    PAYMENT: {
        TEST_CARDS: '/payments/test-cards',
        PROCESS: '/payments/process',
        STATUS: (orderId: number) => `/payments/status/${orderId}`,
    },
} as const;
