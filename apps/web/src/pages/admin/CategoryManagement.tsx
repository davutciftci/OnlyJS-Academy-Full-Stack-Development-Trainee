import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { Category } from '../../types';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../../services/adminService';

export default function CategoryManagement() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState<CreateCategoryRequest | UpdateCategoryRequest>({
        name: '',
        slug: '',
        description: '',
        isActive: true,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await adminService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Kategoriler yüklenemedi:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            isActive: category.isActive,
        });
        setIsEditing(true);
    };

    const handleCreate = () => {
        setEditingCategory(null);
        setFormData({
            name: '',
            slug: '',
            description: '',
            isActive: true,
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditingCategory(null);
        setFormData({ name: '', slug: '', description: '', isActive: true });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                await adminService.updateCategory(editingCategory.id, formData);
            } else {
                await adminService.createCategory(formData as CreateCategoryRequest);
            }
            await fetchCategories();
            handleCancel();
        } catch (error) {
            console.error('Kategori kaydedilemedi:', error);
            alert('Kategori kaydedilirken bir hata oluştu.');
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`"${name}" kategorisini silmek istediğinizden emin misiniz?`)) {
            return;
        }

        try {
            await adminService.deleteCategory(id);
            await fetchCategories();
        } catch (error) {
            console.error('Kategori silinemedi:', error);
            alert('Kategori silinirken bir hata oluştu.');
        }
    };

    if (isLoading) {
        return <div className="text-center py-8">Yükleniyor...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Kategori Yönetimi</h1>
                <button
                    onClick={handleCreate}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Kategori
                </button>
            </div>

            {isEditing && (
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow mb-6 p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kategori Adı *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Slug *
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Açıklama
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Aktif</span>
                        </label>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            Kaydet
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                        >
                            <X className="w-5 h-5" />
                            İptal
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kategori Adı
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Slug
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Açıklama
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Durum
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                İşlemler
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{category.slug}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-500">{category.description || '-'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {category.isActive ? 'Aktif' : 'Pasif'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 mr-3"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id, category.name)}
                                        className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {categories.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        Kategori bulunamadı
                    </div>
                )}
            </div>
        </div>
    );
}
