import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { AROMAS, SIZES } from '../../constants/productOptions';
import type { Category, Product } from '../../types';

interface FormData {
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    categoryId: number;
    isActive: boolean;
    taxRate: number;
    features: string[];
    usage: string[];
    expirationDate: string;
    servingSize: string;
    ingredients: string;
}

interface Variant {
    id?: number;
    name: string;
    sku: string;
    price: number;
    stockCount: number;
    discount: number;
    aroma: string;
    size: string;
    servings: string;
}

interface NutritionValue {
    name: string;
    value: string;
    unit: string;
}

interface AminoAcid {
    name: string;
    value: string;
    unit: string;
}

const NUTRITION_NAMES = [
    'Enerji', 'Protein', 'Karbonhidrat', 'Şeker', 'Yağ', 'Doymuş Yağ', 'Lif', 'Tuz', 'Sodyum'
];

const AMINO_ACID_NAMES = [
    'Lösin', 'İzolösin', 'Valin', 'Lizin', 'Metiyonin', 'Fenilalanin', 'Treonin', 'Triptofan', 'Histidin',
    'Alanin', 'Arjinin', 'Aspartik Asit', 'Sistein', 'Glutamik Asit', 'Glisin', 'Prolin', 'Serin', 'Tirozin'
];

export default function ProductEditPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    const [formData, setFormData] = useState<FormData>({
        name: '',
        slug: '',
        description: '',
        basePrice: 0,
        categoryId: 0,
        isActive: true,
        taxRate: 20,
        features: [],
        usage: [],
        expirationDate: '',
        servingSize: '',
        ingredients: '',
    });

    const [variants, setVariants] = useState<Variant[]>([]);
    const [nutritionValues, setNutritionValues] = useState<NutritionValue[]>([]);
    const [aminoAcids, setAminoAcids] = useState<AminoAcid[]>([]);
    const [aminoAcidServingSize, setAminoAcidServingSize] = useState('30g');

    const [newFeature, setNewFeature] = useState('');
    const [newUsage, setNewUsage] = useState('');

    useEffect(() => {
        if (id) {
            fetchProduct(parseInt(id));
            fetchCategories();
        }
    }, [id]);

    const fetchProduct = async (productId: number) => {
        try {
            const data = await productService.getProductById(productId);
            setProduct(data);

            setFormData({
                name: data.name,
                slug: data.slug,
                description: data.description || '',
                basePrice: data.basePrice ? Number(data.basePrice) : 0,
                categoryId: typeof data.category === 'object' ? data.category.id : 0,
                isActive: data.isActive !== false,
                taxRate: data.taxRate ? Number(data.taxRate) : 20,
                features: Array.isArray(data.features) ? data.features : [],
                usage: Array.isArray(data.usage) ? data.usage : [],
                expirationDate: data.expirationDate ? new Date(data.expirationDate).toISOString().split('T')[0] : '',
                servingSize: data.servingSize || '',
                ingredients: data.ingredients || '',
            });

            if (data.variants && data.variants.length > 0) {
                setVariants(data.variants.map((v) => ({
                    id: v.id,
                    name: v.name || '',
                    sku: v.sku || '',
                    price: Number(v.price) || 0,
                    stockCount: v.stockCount || 0,
                    discount: v.discount || 0,
                    aroma: v.aroma || '',
                    size: v.size || '',
                    servings: v.servings || '',
                })));
            }

            if (data.nutritionValues && typeof data.nutritionValues === 'object') {
                const nv = data.nutritionValues;
                if (nv.values && Array.isArray(nv.values)) {
                    setNutritionValues(nv.values);
                }
                if ((nv as any).servingSize) {
                    setFormData(prev => ({ ...prev, servingSize: (nv as any).servingSize }));
                }
            }

            if (data.aminoAcids && typeof data.aminoAcids === 'object') {
                const aa = data.aminoAcids;
                if (aa.values && Array.isArray(aa.values)) {
                    setAminoAcids(aa.values);
                }
                if ((aa as any).servingSize) {
                    setAminoAcidServingSize(String((aa as any).servingSize));
                }
            }

        } catch (error) {
            console.error('Ürün yüklenemedi:', error);
            alert('Ürün bulunamadı.');
            navigate('/admin/products');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Kategoriler yüklenemedi:', error);
        }
    };

    const handleSubmit = async () => {
        if (!id) return;

        if (!formData.name.trim()) {
            alert('Ürün adı zorunludur');
            return;
        }
        if (!formData.slug.trim()) {
            alert('Slug zorunludur');
            return;
        }

        setIsSaving(true);

        try {
            const nutritionValuesData = nutritionValues.length > 0 ? {
                servingSize: formData.servingSize,
                values: nutritionValues
            } : undefined;

            const aminoAcidsData = aminoAcids.length > 0 ? {
                servingSize: aminoAcidServingSize,
                values: aminoAcids
            } : undefined;

            await adminService.updateProduct(parseInt(id), {
                ...formData,
                stockCount: 0,
                basePrice: formData.basePrice || undefined,
                expirationDate: formData.expirationDate || undefined,
                servingSize: formData.servingSize || undefined,
                ingredients: formData.ingredients || undefined,
                nutritionValues: nutritionValuesData,
                aminoAcids: aminoAcidsData,
                variants: variants.map(v => ({
                    name: v.name,
                    sku: v.sku,
                    price: v.price,
                    stockCount: v.stockCount,
                    discount: v.discount || undefined,
                    aroma: v.aroma || undefined,
                    size: v.size || undefined,
                    servings: v.servings || undefined,
                })),
            });

            alert('Ürün başarıyla güncellendi!');
            navigate('/admin/products');
        } catch (error: unknown) {
            console.error('Ürün güncellenemedi:', error);
            const err = error as { 
                response?: { data?: { message?: string } }; 
                message?: string 
            };
            const errorMessage = err.response?.data?.message || err.message || 'Ürün güncellenirken bir hata oluştu.';
            alert(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (field: keyof FormData, value: string | number | boolean | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addVariant = () => {
        setVariants([...variants, {
            name: '',
            sku: '',
            price: 0,
            stockCount: 0,
            discount: 0,
            aroma: '',
            size: '',
            servings: '',
        }]);
    };

    const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
        const updated = [...variants];
        updated[index] = { ...updated[index], [field]: value };
        setVariants(updated);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const addNutritionValue = (name: string) => {
        if (!nutritionValues.find(n => n.name === name)) {
            setNutritionValues([...nutritionValues, { name, value: '', unit: 'g' }]);
        }
    };

    const updateNutritionValue = (index: number, field: keyof NutritionValue, value: string) => {
        const updated = [...nutritionValues];
        updated[index] = { ...updated[index], [field]: value };
        setNutritionValues(updated);
    };

    const removeNutritionValue = (index: number) => {
        setNutritionValues(nutritionValues.filter((_, i) => i !== index));
    };

    const addAminoAcid = (name: string) => {
        if (!aminoAcids.find(a => a.name === name)) {
            setAminoAcids([...aminoAcids, { name, value: '', unit: 'mg' }]);
        }
    };

    const updateAminoAcid = (index: number, field: keyof AminoAcid, value: string) => {
        const updated = [...aminoAcids];
        updated[index] = { ...updated[index], [field]: value };
        setAminoAcids(updated);
    };

    const removeAminoAcid = (index: number) => {
        setAminoAcids(aminoAcids.filter((_, i) => i !== index));
    };

    const addToList = (listName: 'features' | 'usage', value: string, setter: (v: string) => void) => {
        if (value.trim()) {
            setFormData(prev => ({
                ...prev,
                [listName]: [...prev[listName], value.trim()]
            }));
            setter('');
        }
    };

    const removeFromList = (listName: 'features' | 'usage', index: number) => {
        setFormData(prev => ({
            ...prev,
            [listName]: prev[listName].filter((_, i) => i !== index)
        }));
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Yükleniyor...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Ürün bulunamadı.</p>
            </div>
        );
    }

    const tabs = [
        { id: 'general', label: 'Genel Bilgiler' },
        { id: 'variants', label: 'Varyantlar' },
        { id: 'details', label: 'Detaylar' },
    ];

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Ürün Düzenle: {product.name}</h1>
            </div>

            <div className="flex border-b mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 font-medium transition-colors ${activeTab === tab.id
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                {activeTab === 'general' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => handleChange('slug', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => handleChange('categoryId', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={0}>Kategori Seçin</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Taban Fiyat (KDV Hariç)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.basePrice || ''}
                                onChange={(e) => handleChange('basePrice', parseFloat(e.target.value) || 0)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">KDV Oranı (%)</label>
                            <input
                                type="number"
                                value={formData.taxRate}
                                onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 20)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Son Kullanma Tarihi</label>
                            <input
                                type="date"
                                value={formData.expirationDate}
                                onChange={(e) => handleChange('expirationDate', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => handleChange('isActive', e.target.checked)}
                                    className="rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Aktif</span>
                            </label>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'variants' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Ürün Varyantları</h3>
                            <button
                                type="button"
                                onClick={addVariant}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Yeni Varyant
                            </button>
                        </div>

                        {variants.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">Henüz varyant eklenmemiş</p>
                        ) : (
                            <div className="space-y-4">
                                {variants.map((variant, index) => (
                                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-medium">Varyant #{index + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Varyant Adı</label>
                                                <input
                                                    type="text"
                                                    value={variant.name}
                                                    onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                                    placeholder="1kg Çikolata"
                                                    className="w-full px-3 py-2 border rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">SKU</label>
                                                <input
                                                    type="text"
                                                    value={variant.sku}
                                                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                                    placeholder="WP-1KG-CHOC"
                                                    className="w-full px-3 py-2 border rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Fiyat (TL)</label>
                                                <input
                                                    type="number"
                                                    value={variant.price}
                                                    onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Stok</label>
                                                <input
                                                    type="number"
                                                    value={variant.stockCount}
                                                    onChange={(e) => updateVariant(index, 'stockCount', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">İndirim (%)</label>
                                                <input
                                                    type="number"
                                                    value={variant.discount}
                                                    onChange={(e) => updateVariant(index, 'discount', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Aroma</label>
                                                <select
                                                    value={variant.aroma}
                                                    onChange={(e) => updateVariant(index, 'aroma', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-lg"
                                                >
                                                    <option value="">Aroma Seçin</option>
                                                    {AROMAS.map(aroma => (
                                                        <option key={aroma.name} value={aroma.name}>{aroma.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Boyut</label>
                                                <select
                                                    value={variant.size}
                                                    onChange={(e) => updateVariant(index, 'size', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-lg"
                                                >
                                                    <option value="">Boyut Seçin</option>
                                                    {SIZES.map(size => (
                                                        <option key={size} value={size}>{size}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Servis Sayısı</label>
                                                <input
                                                    type="text"
                                                    value={variant.servings}
                                                    onChange={(e) => updateVariant(index, 'servings', e.target.value)}
                                                    placeholder="33 servis"
                                                    className="w-full px-3 py-2 border rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'details' && (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Özellikler</h3>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                    placeholder="Yeni özellik ekle"
                                    className="flex-1 px-3 py-2 border rounded-lg"
                                    onKeyPress={(e) => e.key === 'Enter' && addToList('features', newFeature, setNewFeature)}
                                />
                                <button
                                    type="button"
                                    onClick={() => addToList('features', newFeature, setNewFeature)}
                                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.features.map((feature, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
                                        {feature}
                                        <button type="button" onClick={() => removeFromList('features', index)} className="text-blue-600 hover:text-blue-800">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3">Kullanım Şekli</h3>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newUsage}
                                    onChange={(e) => setNewUsage(e.target.value)}
                                    placeholder="Yeni kullanım adımı ekle"
                                    className="flex-1 px-3 py-2 border rounded-lg"
                                    onKeyPress={(e) => e.key === 'Enter' && addToList('usage', newUsage, setNewUsage)}
                                />
                                <button
                                    type="button"
                                    onClick={() => addToList('usage', newUsage, setNewUsage)}
                                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <ol className="list-decimal list-inside space-y-1">
                                {formData.usage.map((step, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <span>{step}</span>
                                        <button type="button" onClick={() => removeFromList('usage', index)} className="text-red-500 hover:text-red-700 text-sm">×</button>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3">İçindekiler</h3>
                            <textarea
                                value={formData.ingredients}
                                onChange={(e) => handleChange('ingredients', e.target.value)}
                                placeholder="Ürün içerikleri..."
                                className="w-full px-4 py-2 border rounded-lg"
                                rows={3}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">Besin Değerleri (Servis: {formData.servingSize || '-'})</h3>
                                <input
                                    type="text"
                                    value={formData.servingSize}
                                    onChange={(e) => handleChange('servingSize', e.target.value)}
                                    placeholder="30g"
                                    className="w-24 px-2 py-1 border rounded text-sm"
                                />
                            </div>
                            <div className="mb-3">
                                <select
                                    onChange={(e) => addNutritionValue(e.target.value)}
                                    className="px-3 py-2 border rounded-lg"
                                    value=""
                                >
                                    <option value="">Besin değeri ekle...</option>
                                    {NUTRITION_NAMES.filter(n => !nutritionValues.find(nv => nv.name === n)).map(name => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                {nutritionValues.map((nv, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="w-32">{nv.name}:</span>
                                        <input
                                            type="text"
                                            value={nv.value}
                                            onChange={(e) => updateNutritionValue(index, 'value', e.target.value)}
                                            className="w-24 px-2 py-1 border rounded"
                                            placeholder="0"
                                        />
                                        <input
                                            type="text"
                                            value={nv.unit}
                                            onChange={(e) => updateNutritionValue(index, 'unit', e.target.value)}
                                            className="w-16 px-2 py-1 border rounded"
                                        />
                                        <button type="button" onClick={() => removeNutritionValue(index)} className="text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">Amino Asitler (Servis: {aminoAcidServingSize})</h3>
                                <input
                                    type="text"
                                    value={aminoAcidServingSize}
                                    onChange={(e) => setAminoAcidServingSize(e.target.value)}
                                    placeholder="30g"
                                    className="w-24 px-2 py-1 border rounded text-sm"
                                />
                            </div>
                            <div className="mb-3">
                                <select
                                    onChange={(e) => addAminoAcid(e.target.value)}
                                    className="px-3 py-2 border rounded-lg"
                                    value=""
                                >
                                    <option value="">Amino asit ekle...</option>
                                    {AMINO_ACID_NAMES.filter(n => !aminoAcids.find(aa => aa.name === n)).map(name => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                {aminoAcids.map((aa, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="w-32">{aa.name}:</span>
                                        <input
                                            type="text"
                                            value={aa.value}
                                            onChange={(e) => updateAminoAcid(index, 'value', e.target.value)}
                                            className="w-24 px-2 py-1 border rounded"
                                            placeholder="0"
                                        />
                                        <input
                                            type="text"
                                            value={aa.unit}
                                            onChange={(e) => updateAminoAcid(index, 'unit', e.target.value)}
                                            className="w-16 px-2 py-1 border rounded"
                                        />
                                        <button type="button" onClick={() => removeAminoAcid(index)} className="text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex gap-3 mt-8 pt-6 border-t">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        İptal
                    </button>
                </div>
            </div>
        </div>
    );
}
