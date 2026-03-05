export interface UserAddress {
    id: number;
    title: string;
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    city: string;
    district: string;
    postalCode?: string;
    isDefault: boolean;
    userId: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateAddressRequest {
    title: string;
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    city: string;
    district: string;
    postalCode?: string;
    isDefault?: boolean;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> { }
