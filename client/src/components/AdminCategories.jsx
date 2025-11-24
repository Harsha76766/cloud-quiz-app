import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import Modal from './Modal';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', icon: '', active: true });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, formData);
            } else {
                await createCategory(formData);
            }
            fetchCategories();
            closeModal();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save category');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await deleteCategory(id);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
        }
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, description: category.description, icon: category.icon, active: category.active });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '', icon: '', active: true });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    if (loading) return <div className="text-center p-8">Loading categories...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Categories</h2>
                <button
                    onClick={() => openModal()}
                    className="bg-accent text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center space-x-2 hover:bg-blue-400 transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Category</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg group hover:border-accent transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-700 rounded-lg text-2xl">
                                {category.icon === 'cloud' ? '☁️' : category.icon === 'wifi' ? '📡' : '📁'}
                            </div>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openModal(category)}
                                    className="p-2 hover:bg-slate-700 rounded-lg text-blue-400"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="p-2 hover:bg-slate-700 rounded-lg text-red-400"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">{category.description}</p>
                        <div className="flex items-center space-x-2 text-sm">
                            <span className={`w-2 h-2 rounded-full ${category.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="text-gray-500">{category.active ? 'Active' : 'Inactive'}</span>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingCategory ? 'Edit Category' : 'New Category'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea
                            className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Icon (emoji or text)</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="active"
                            className="w-4 h-4 rounded bg-slate-700 border-slate-600"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        />
                        <label htmlFor="active" className="text-sm text-gray-400">Active</label>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-accent text-slate-900 font-bold py-2 rounded hover:bg-blue-400 transition-colors"
                    >
                        {editingCategory ? 'Update Category' : 'Create Category'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
