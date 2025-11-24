import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, FileQuestion } from 'lucide-react';
import { getQuizzes, createQuiz, updateQuiz, deleteQuiz, getCategories } from '../services/api';
import Modal from './Modal';
import AdminQuestions from './AdminQuestions';

export default function AdminQuizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', category: '', difficulty: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', category: '', difficulty: 'Easy', active: true });
    const [selectedQuizForQuestions, setSelectedQuizForQuestions] = useState(null);

    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = async () => {
        try {
            const [quizzesData, categoriesData] = await Promise.all([
                getQuizzes(filters),
                getCategories()
            ]);
            setQuizzes(quizzesData);
            setCategories(categoriesData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingQuiz) {
                await updateQuiz(editingQuiz.id, formData);
            } else {
                await createQuiz(formData);
            }
            fetchData();
            closeModal();
        } catch (error) {
            console.error('Error saving quiz:', error);
            alert('Failed to save quiz');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this quiz?')) return;
        try {
            await deleteQuiz(id);
            fetchData();
        } catch (error) {
            console.error('Error deleting quiz:', error);
            alert('Failed to delete quiz');
        }
    };

    const openModal = (quiz = null) => {
        if (quiz) {
            setEditingQuiz(quiz);
            setFormData({
                title: quiz.title,
                description: quiz.description,
                category: quiz.category,
                difficulty: quiz.difficulty,
                active: quiz.active
            });
        } else {
            setEditingQuiz(null);
            setFormData({ title: '', description: '', category: '', difficulty: 'Easy', active: true });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingQuiz(null);
    };

    if (selectedQuizForQuestions) {
        return <AdminQuestions quiz={selectedQuizForQuestions} onBack={() => setSelectedQuizForQuestions(null)} />;
    }

    if (loading) return <div className="text-center p-8">Loading quizzes...</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold">Quizzes</h2>
                <button
                    onClick={() => openModal()}
                    className="bg-accent text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center space-x-2 hover:bg-blue-400 transition-colors"
                >
                    <Plus size={20} />
                    <span>Create Quiz</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        name="search"
                        placeholder="Search quizzes..."
                        className="w-full pl-10 p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                </div>
                <select
                    name="category"
                    className="p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                    value={filters.category}
                    onChange={handleFilterChange}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
                <select
                    name="difficulty"
                    className="p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                    value={filters.difficulty}
                    onChange={handleFilterChange}
                >
                    <option value="">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>

            {/* Quiz List */}
            <div className="space-y-4">
                {quizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-xl font-bold">{quiz.title}</h3>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${quiz.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                        quiz.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                    }`}>
                                    {quiz.difficulty}
                                </span>
                                {!quiz.active && (
                                    <span className="px-2 py-1 rounded text-xs font-bold bg-gray-600 text-gray-300">
                                        Inactive
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-400 text-sm mb-2">{quiz.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Category: {quiz.category}</span>
                                <span>•</span>
                                <span>Created: {new Date(quiz.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setSelectedQuizForQuestions(quiz)}
                                className="p-2 bg-slate-700 rounded-lg text-blue-400 hover:bg-slate-600 hover:text-white transition-colors flex items-center space-x-2"
                                title="Manage Questions"
                            >
                                <FileQuestion size={18} />
                                <span className="hidden md:inline">Questions</span>
                            </button>
                            <button
                                onClick={() => openModal(quiz)}
                                className="p-2 bg-slate-700 rounded-lg text-yellow-400 hover:bg-slate-600 hover:text-white transition-colors"
                                title="Edit"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(quiz.id)}
                                className="p-2 bg-slate-700 rounded-lg text-red-400 hover:bg-slate-600 hover:text-white transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                {quizzes.length === 0 && (
                    <div className="text-center text-gray-500 py-8">No quizzes found.</div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingQuiz ? 'Edit Quiz' : 'Create Quiz'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Category</label>
                            <select
                                className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
                            <select
                                className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
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
                        {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
