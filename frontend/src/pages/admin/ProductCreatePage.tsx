import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, Upload } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { uploadProductPhoto } from '../../services/photoService';
import { categoryService } from '../../services/categoryService';
import { AROMAS, SIZES } from '../../constants/productOptions';
import type { Category } from '../../types';

type TabType = 'general' | 'variants' | 'photos' | 'details' | 'nutrition';

interface ProductVariant {
    name: string;
    sku: string;
    price: number;
    stockCount: number;
    aroma?: string;
    size?: string;
    servings?: string;
    discount?: number;
}

interface ProductPhoto {
    file?: File;
    url?: string;
    altText: string;
    isPrimary: boolean;
    displayOrder: number;
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

const NUTRITION_NAMES = [
    'Enerji', 'Protein', 'Karbonhidrat', 'Şeker', 'Yağ', 'Doymuş Yağ', 'Tuz',
    'B6 Vitamini', 'B12 Vitamini', 'C Vitamini', 'D Vitamini',
    'DigeZyme®', 'Kreatin', 'BCAA', 'Glutamin'
];

const AMINO_ACID_NAMES = [
    'Glutamik Asit', 'Lizin', 'Aspartik Asit', 'Lösin (BCAA)', 'Prolin',
    'Treonin', 'İzolösin (BCAA)', 'Serin', 'Alanin', 'Valin (BCAA)',
    'Trosin', 'Histidin'
];

export default function ProductCreatePage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('general');
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

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
        servingSize: '25g',
        ingredients: '',
    });

    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [photos, setPhotos] = useState<ProductPhoto[]>([]);
    const [nutritionValues, setNutritionValues] = useState<NutritionValue[]>([]);
    const [aminoAcids, setAminoAcids] = useState<AminoAcid[]>([]);
    const [aminoAcidServingSize, setAminoAcidServingSize] = useState('100g');
    const [newFeature, setNewFeature] = useState('');
    const [newUsage, setNewUsage] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
            if (data.length > 0) {
                setFormData(prev => ({ ...prev, categoryId: data[0].id }));
            }
        } catch (error) {
            console.error('Kategoriler yüklenemedi:', error);
            alert('Kategoriler yüklenirken bir hata oluştu');
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Ürün adı zorunludur';
        if (!formData.slug.trim()) newErrors.slug = 'Slug zorunludur';
        if (formData.categoryId === 0) newErrors.categoryId = 'Kategori seçilmelidir';
        if (variants.length === 0) newErrors.variants = 'En az bir varyant eklenmelidir';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            const firstError = Object.values(errors)[0];
            alert(firstError);
            return;
        }

        setIsLoading(true);
        try {
            const uploadedPhotos = await Promise.all(
                photos.map(async (photo) => {
                    if (photo.file) {
                        const url = await uploadProductPhoto(photo.file);
                        return {
                            url,
                            altText: photo.altText,
                            isPrimary: photo.isPrimary,
                            displayOrder: photo.displayOrder,
                        };
                    }
                    return null;
                })
            );

            const validPhotos = uploadedPhotos.filter(p => p !== null) as Array<{
                url: string;
                altText?: string;
                isPrimary?: boolean;
                displayOrder?: number;
            }>;

            const nutritionValuesData = nutritionValues.length > 0 ? {
                servingSize: formData.servingSize,
                values: nutritionValues
            } : undefined;

            const aminoAcidsData = aminoAcids.length > 0 ? {
                servingSize: aminoAcidServingSize,
                values: aminoAcids
            } : undefined;

            await adminService.createProduct({
                ...formData,
                stockCount: 0,
                basePrice: formData.basePrice || undefined,
                expirationDate: formData.expirationDate || undefined,
                servingSize: formData.servingSize || undefined,
                ingredients: formData.ingredients || undefined,
                nutritionValues: nutritionValuesData,
                aminoAcids: aminoAcidsData,
                variants: variants,
                photos: validPhotos.length > 0 ? validPhotos : undefined,
            });

            alert('Ürün başarıyla oluşturuldu!');
            navigate('/admin/products');
        } catch (error: unknown) {
            console.error('Ürün oluşturulamadı:', error);
            const err = error as { 
                response?: { 
                    data?: { 
                        errors?: Array<{ path?: string[]; message: string }>;
                        message?: string;
                    } 
                }; 
                message?: string;
            };

            if (err.response?.data?.errors) {
                const validationErrors = err.response.data.errors;
                const errorMessages = validationErrors.map((errorItem) => {
                    const field = errorItem.path?.join('.') || 'Bilinmeyen alan';
                    return `${field}: ${errorItem.message}`;
                }).join('\n');
                alert(`Validasyon Hataları:\n\n${errorMessages}`);
            } else {
                const errorMessage = err.response?.data?.message || err.message || 'Ürün oluşturulurken bir hata oluştu';
                alert(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: keyof FormData, value: string | number | boolean | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
            .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    };

    const calculatePriceWithTax = (price: number) => {
        return (price * (1 + formData.taxRate / 100)).toFixed(2);
    };

    // Variant functions
    const addVariant = () => {
        setVariants([...variants, {
            name: '', sku: '', price: 0, stockCount: 0,
            aroma: '', size: '', servings: '', discount: 0,
        }]);
    };

    const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setVariants(newVariants);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach((file) => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`${file.name}: Fotoğraf boyutu maksimum 5MB olmalıdır`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotos(prev => [...prev, {
                    file,
                    url: e.target?.result as string,
                    altText: formData.name,
                    isPrimary: prev.length === 0,
                    displayOrder: prev.length,
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const updatePhoto = (index: number, field: keyof ProductPhoto, value: string | boolean | number) => {
        const newPhotos = [...photos];
        if (field === 'isPrimary' && value === true) {
            newPhotos.forEach((p, i) => { p.isPrimary = i === index; });
        } else {
            newPhotos[index] = { ...newPhotos[index], [field]: value };
        }
        setPhotos(newPhotos);
    };

    const removePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index));
    };

    const addNutritionValue = () => {
        setNutritionValues([...nutritionValues, { name: '', value: '', unit: 'g' }]);
    };

    const updateNutritionValue = (index: number, field: keyof NutritionValue, value: string) => {
        const newValues = [...nutritionValues];
        newValues[index] = { ...newValues[index], [field]: value };
        setNutritionValues(newValues);
    };

    const removeNutritionValue = (index: number) => {
        setNutritionValues(nutritionValues.filter((_, i) => i !== index));
    };

    const addAminoAcid = () => {
        setAminoAcids([...aminoAcids, { name: '', value: '', unit: 'g' }]);
    };

    const updateAminoAcid = (index: number, field: keyof AminoAcid, value: string) => {
        const newValues = [...aminoAcids];
        newValues[index] = { ...newValues[index], [field]: value };
        setAminoAcids(newValues);
    };

    const removeAminoAcid = (index: number) => {
        setAminoAcids(aminoAcids.filter((_, i) => i !== index));
    };

    const addToList = (listName: 'features' | 'usage', value: string) => {
        if (!value.trim()) return;
        setFormData(prev => ({
            ...prev,
            [listName]: [...prev[listName], value.trim()]
        }));
        if (listName === 'features') setNewFeature('');
        if (listName === 'usage') setNewUsage('');
    };

    const removeFromList = (listName: 'features' | 'usage', index: number) => {
        setFormData(prev => ({
            ...prev,
            [listName]: prev[listName].filter((_, i) => i !== index)
        }));
    };

    const tabs = [
        { id: 'general' as TabType, label: 'Genel Bilgiler' },
        { id: 'variants' as TabType, label: 'Varyantlar' },
        { id: 'photos' as TabType, label: 'Fotoğraflar' },
        { id: 'nutrition' as TabType, label: 'Besin İçeriği' },
        { id: 'details' as TabType, label: 'Detaylar' },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Yeni Ürün Ekle</h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-5 h-5" />
                    {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                                {tab.id === 'variants' && variants.length > 0 && (
                                    <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">{variants.length}</span>
                                )}
                                {tab.id === 'photos' && photos.length > 0 && (
                                    <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">{photos.length}</span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'general' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => {
                                        handleChange('name', e.target.value);
                                        if (!formData.slug) {
                                            handleChange('slug', generateSlug(e.target.value));
                                        }
                                    }}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Örn: Whey Protein 1kg"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => handleChange('slug', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.slug ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="whey-protein-1kg"
                                />
                                {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => handleChange('categoryId', parseInt(e.target.value))}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.categoryId ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value={0}>Kategori Seçin</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Taban Fiyat (KDV Hariç)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.basePrice || ''}
                                    onChange={(e) => handleChange('basePrice', parseFloat(e.target.value) || 0)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                />
                                <p className="text-xs text-gray-500 mt-1">Opsiyonel - Varyantlar kendi fiyatlarını kullanır</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">KDV Oranı (%) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.taxRate}
                                    onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 20)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {formData.basePrice > 0 && (
                                    <p className="text-xs text-green-600 mt-1">
                                        KDV Dahil: {calculatePriceWithTax(formData.basePrice)} TL
                                    </p>
                                )}
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

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                    placeholder="Ürün açıklaması..."
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
                        </div>
                    )}

                    {activeTab === 'variants' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Varyantlar</h3>
                                <button
                                    onClick={addVariant}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Yeni Varyant
                                </button>
                            </div>

                            {errors.variants && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                    {errors.variants}
                                </div>
                            )}

                            {variants.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500 mb-4">Henüz varyant eklenmedi</p>
                                    <button onClick={addVariant} className="text-blue-600 hover:text-blue-700 font-medium">
                                        İlk varyantı ekle
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {variants.map((variant, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-medium text-gray-900">Varyant #{index + 1}</h4>
                                                <button onClick={() => removeVariant(index)} className="text-red-600 hover:text-red-700">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Varyant Adı *</label>
                                                    <input
                                                        type="text"
                                                        value={variant.name}
                                                        onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="1kg Çikolata"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                                                    <input
                                                        type="text"
                                                        value={variant.sku}
                                                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="WP-1KG-CHOC"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (KDV Hariç) *</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={variant.price || ''}
                                                        onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    {variant.price > 0 && (
                                                        <p className="text-xs text-green-600 mt-1">
                                                            KDV Dahil: {calculatePriceWithTax(variant.price)} TL
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok *</label>
                                                    <input
                                                        type="number"
                                                        value={variant.stockCount}
                                                        onChange={(e) => updateVariant(index, 'stockCount', parseInt(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        min="0"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Aroma</label>
                                                    <select
                                                        value={variant.aroma || ''}
                                                        onChange={(e) => updateVariant(index, 'aroma', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">Aroma Seçin</option>
                                                        {AROMAS.map(aroma => (
                                                            <option key={aroma.name} value={aroma.name}>{aroma.name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Boyut</label>
                                                    <select
                                                        value={variant.size || ''}
                                                        onChange={(e) => updateVariant(index, 'size', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">Boyut Seçin</option>
                                                        {SIZES.map(size => (
                                                            <option key={size} value={size}>{size}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Porsiyon Sayısı</label>
                                                    <input
                                                        type="text"
                                                        value={variant.servings || ''}
                                                        onChange={(e) => updateVariant(index, 'servings', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="30 Porsiyon"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">İndirim (%)</label>
                                                    <input
                                                        type="number"
                                                        value={variant.discount || ''}
                                                        onChange={(e) => updateVariant(index, 'discount', parseInt(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        min="0"
                                                        max="100"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'photos' && (
                        <div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fotoğraf Yükle</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                        id="photo-upload"
                                    />
                                    <label htmlFor="photo-upload" className="cursor-pointer">
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-2">Fotoğrafları sürükleyin veya tıklayın</p>
                                        <p className="text-sm text-gray-500">JPG, PNG, WEBP (Maks. 5MB)</p>
                                    </label>
                                </div>
                                {errors.photos && <p className="text-red-500 text-sm mt-2">{errors.photos}</p>}
                            </div>

                            {photos.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {photos.map((photo, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                                            <div className="relative aspect-square mb-3">
                                                <img src={photo.url} alt={photo.altText} className="w-full h-full object-cover rounded" />
                                                <button
                                                    onClick={() => removePhoto(index)}
                                                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={photo.altText}
                                                    onChange={(e) => updatePhoto(index, 'altText', e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                                    placeholder="Alt text"
                                                />

                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={photo.isPrimary}
                                                        onChange={(e) => updatePhoto(index, 'isPrimary', e.target.checked)}
                                                        className="rounded"
                                                    />
                                                    Ana fotoğraf
                                                </label>

                                                <input
                                                    type="number"
                                                    value={photo.displayOrder}
                                                    onChange={(e) => updatePhoto(index, 'displayOrder', parseInt(e.target.value) || 0)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                                    placeholder="Sıra"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'nutrition' && (
                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Servis Boyutu</label>
                                <input
                                    type="text"
                                    value={formData.servingSize}
                                    onChange={(e) => handleChange('servingSize', e.target.value)}
                                    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="25g"
                                />
                            </div>

                            {/* Nutrition Values */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-semibold">Besin Değerleri ({formData.servingSize} servis için)</h3>
                                    <button
                                        onClick={addNutritionValue}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Ekle
                                    </button>
                                </div>

                                {nutritionValues.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Henüz besin değeri eklenmedi</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {nutritionValues.map((item, index) => (
                                            <div key={index} className="grid grid-cols-12 gap-3 items-center">
                                                <div className="col-span-5">
                                                    <select
                                                        value={item.name}
                                                        onChange={(e) => updateNutritionValue(index, 'name', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">Seçin...</option>
                                                        {NUTRITION_NAMES.map(name => (
                                                            <option key={name} value={name}>{name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-span-4">
                                                    <input
                                                        type="text"
                                                        value={item.value}
                                                        onChange={(e) => updateNutritionValue(index, 'value', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="361 kj / 85 kcal"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <input
                                                        type="text"
                                                        value={item.unit}
                                                        onChange={(e) => updateNutritionValue(index, 'unit', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="g"
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <button
                                                        onClick={() => removeNutritionValue(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold">Amino Asit Değerleri</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <label className="text-sm font-medium text-gray-700">Servis Boyutu:</label>
                                            <input
                                                type="text"
                                                value={aminoAcidServingSize}
                                                onChange={(e) => setAminoAcidServingSize(e.target.value)}
                                                className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="100g"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={addAminoAcid}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Ekle
                                    </button>
                                </div>

                                {aminoAcids.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Henüz amino asit değeri eklenmedi</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {aminoAcids.map((item, index) => (
                                            <div key={index} className="grid grid-cols-12 gap-3 items-center">
                                                <div className="col-span-5">
                                                    <select
                                                        value={item.name}
                                                        onChange={(e) => updateAminoAcid(index, 'name', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">Seçin...</option>
                                                        {AMINO_ACID_NAMES.map(name => (
                                                            <option key={name} value={name}>{name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-span-4">
                                                    <input
                                                        type="text"
                                                        value={item.value}
                                                        onChange={(e) => updateAminoAcid(index, 'value', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="13.5"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <input
                                                        type="text"
                                                        value={item.unit}
                                                        onChange={(e) => updateAminoAcid(index, 'unit', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="g"
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <button
                                                        onClick={() => removeAminoAcid(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">İçindekiler</label>
                                <textarea
                                    value={formData.ingredients}
                                    onChange={(e) => handleChange('ingredients', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                    placeholder="Ürünün içindekiler listesi..."
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-3">Özellikler</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newFeature}
                                        onChange={(e) => setNewFeature(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addToList('features', newFeature)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Yeni özellik ekle..."
                                    />
                                    <button
                                        onClick={() => addToList('features', newFeature)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                                            <span className="flex-1">{feature}</span>
                                            <button
                                                onClick={() => removeFromList('features', index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-3">Kullanım Şekli</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newUsage}
                                        onChange={(e) => setNewUsage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addToList('usage', newUsage)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Yeni kullanım adımı ekle..."
                                    />
                                    <button
                                        onClick={() => addToList('usage', newUsage)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.usage.map((step, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                                            <span className="font-medium text-gray-600">{index + 1}.</span>
                                            <span className="flex-1">{step}</span>
                                            <button
                                                onClick={() => removeFromList('usage', index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-5 h-5" />
                    {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
                <button
                    onClick={() => navigate('/admin/products')}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    İptal
                </button>
            </div>
        </div>
    );
}
