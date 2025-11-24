import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Award, Trophy } from 'lucide-react';
import { getAchievements, createAchievement, updateAchievement, deleteAchievement } from '../services/api';
import Modal from './Modal';

export default function AdminAchievements() {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAchievement, setEditingAchievement] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', xp_reward: 10, icon: '🏆' });

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const data = await getAchievements();
            setAchievements(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching achievements:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAchievement) {
                await updateAchievement(editingAchievement.id, formData);
            } else {
                await createAchievement(formData);
            }
            fetchAchievements();
            closeModal();
        } catch (error) {
            console.error('Error saving achievement:', error);
            alert('Failed to save achievement');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this achievement?')) return;
        try {
            await deleteAchievement(id);
            fetchAchievements();
        } catch (error) {
            console.error('Error deleting achievement:', error);
            alert('Failed to delete achievement');
        }
    };

    const openModal = (achievement = null) => {
        if (achievement) {
            setEditingAchievement(achievement);
            setFormData({
                name: achievement.name,
                description: achievement.description,
                xp_reward: achievement.xp_reward,
                icon: achievement.icon
            });
        } else {
            setEditingAchievement(null);
            setFormData({ name: '', description: '', xp_reward: 10, icon: '🏆' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAchievement(null);
    };

    if (loading) return <div className="text-center p-8">Loading achievements...</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Achievements</h2>
                    <p className="text-gray-400 text-sm">{achievements.length} achievements available</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-accent text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center space-x-2 hover:bg-blue-400 transition-colors"
                >
                    <Plus size={20} />
                    <span>Create Achievement</span>
                </button>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg hover:border-accent transition-colors"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="text-5xl">{achievement.icon}</div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => openModal(achievement)}
                                    className="p-2 text-yellow-400 hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(achievement.id)}
                                    className="p-2 text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{achievement.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">{achievement.description}</p>
                        <div className="flex items-center space-x-2">
                            <Award size={16} className="text-yellow-400" />
                            <span className="text-yellow-400 font-bold">{achievement.xp_reward} XP</span>
                        </div>
                    </div>
                ))}
                {achievements.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-12 bg-slate-800 rounded-xl border border-slate-700">
                        <Trophy size={48} className="mx-auto mb-4 text-gray-600" />
                        <p className="text-lg">No achievements created yet.</p>
                        <p className="text-sm mt-2">Create your first achievement to get started!</p>
                    </div>
                )}
            </div>

            {/* Achievement Form Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingAchievement ? 'Edit Achievement' : 'Create Achievement'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Achievement Name</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="First Quiz Completed"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea
                            className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Complete your first quiz"
                            rows={3}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">XP Reward</label>
                            <input
                                type="number"
                                className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                                value={formData.xp_reward}
                                onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) })}
                                min="1"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Icon (Emoji)</label>
                            <input
                                type="text"
                                className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none text-2xl text-center"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                placeholder="🏆"
                                maxLength={2}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-accent text-slate-900 font-bold py-2 rounded hover:bg-blue-400 transition-colors"
                    >
                        {editingAchievement ? 'Update Achievement' : 'Create Achievement'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
