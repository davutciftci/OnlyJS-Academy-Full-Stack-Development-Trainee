import type { ProductVariant } from '../types';

export type VariantSelectionMatrix = {
    sizesByAroma: Record<string, string[]>;
    aromasBySize: Record<string, string[]>;
};

/** API ile aynı mantık: sadece gerçekten var olan aroma×boyut çiftleri */
export function buildVariantSelectionMatrix(variants: ProductVariant[] | undefined): VariantSelectionMatrix {
    const sizesByAroma: Record<string, Set<string>> = {};
    const aromasBySize: Record<string, Set<string>> = {};

    for (const v of variants ?? []) {
        const a = v.aroma;
        const s = v.size;
        if (a == null || s == null || a === '' || s === '') continue;
        if (!sizesByAroma[a]) sizesByAroma[a] = new Set();
        sizesByAroma[a].add(s);
        if (!aromasBySize[s]) aromasBySize[s] = new Set();
        aromasBySize[s].add(a);
    }

    const sortArr = (set: Set<string>) => [...set].sort();

    return {
        sizesByAroma: Object.fromEntries(
            Object.entries(sizesByAroma).map(([k, v]) => [k, sortArr(v)])
        ),
        aromasBySize: Object.fromEntries(
            Object.entries(aromasBySize).map(([k, v]) => [k, sortArr(v)])
        ),
    };
}
