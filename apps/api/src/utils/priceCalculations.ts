export const calculatePriceWithTax = (basePrice: number, taxRate: number): number => {
    return basePrice * (1 + taxRate / 100);
};

export const calculateVariantPriceWithTax = (variantPrice: number, productTaxRate: number): number => {
    return calculatePriceWithTax(variantPrice, productTaxRate);
};

export const formatPriceInfo = (price: number, taxRate: number) => {
    return {
        price: Number(price.toFixed(2)),
        priceWithTax: Number(calculatePriceWithTax(price, taxRate).toFixed(2)),
        taxRate: Number(taxRate.toFixed(2)),
    };
};
