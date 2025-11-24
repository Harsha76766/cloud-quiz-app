import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowLeft, Save, X } from 'lucide-react';
import { getQuestions, addQuestion, updateQuestion, deleteQuestion } from '../services/api';

export default function AdminQuestions({ quiz, onBack }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, [quiz.id]);

    const fetchQuestions = async () => {
        try {
            const data = await getQuestions(quiz.id);
            setQuestions(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching questions:', error);
            setLoading(false);
        }
    };

    const handleEdit = (question) => {
        setEditingId(question.id);
        setFormData({
            question_text: question.question_text,
            options: question.options, // Array of 4 strings
            correct_answer: question.correct_answer,
            explanation: question.explanation || '',
            time_limit: question.time_limit || 60
        });
    };

    const handleAddNew = () => {
        setEditingId('new');
        setFormData({
            question_text: '',
            options: ['', '', '', ''],
            correct_answer: '',
            explanation: '',
            time_limit: 60,
            quiz_id: quiz.id
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData(null);
    };

    const handleSave = async () => {
        try {
            if (editingId === 'new') {
                await addQuestion(formData);
            } else {
                await updateQuestion(editingId, formData);
            }
            fetchQuestions();
            handleCancel();
        } catch (error) {
            console.error('Error saving question:', error);
            alert('Failed to save question');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;
        try {
            await deleteQuestion(id);
            fetchQuestions();
        } catch (error) {
            console.error('Error deleting question:', error);
            alert('Failed to delete question');
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    if (loading) return <div>Loading questions...</div>;

    return (
        <div>
            <div className="flex items-center space-x-4 mb-8">
                <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold">Questions for: {quiz.title}</h2>
                    <p className="text-gray-400 text-sm">{questions.length} questions</p>
                </div>
            </div>

            {editingId === 'new' && (
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6 animate-fade-in">
                    <h3 className="text-xl font-bold mb-4">New Question</h3>
                    <QuestionForm
                        formData={formData}
                        setFormData={setFormData}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        handleOptionChange={handleOptionChange}
                    />
                </div>
            )}

            <div className="space-y-4">
                {questions.map((q, index) => (
                    <div key={q.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        {editingId === q.id ? (
                            <QuestionForm
                                formData={formData}
                                setFormData={setFormData}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                handleOptionChange={handleOptionChange}
                            />
                        ) : (
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold flex-1">
                                        <span className="text-gray-500 mr-2">#{index + 1}</span>
                                        {q.question_text}
                                    </h3>
                                    <div className="flex space-x-2 ml-4">
                                        <button onClick={() => handleEdit(q)} className="p-2 text-blue-400 hover:bg-slate-700 rounded-lg">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(q.id)} className="p-2 text-red-400 hover:bg-slate-700 rounded-lg">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                                    {q.options.map((opt, idx) => (
                                        <div key={idx} className={`p-2 rounded border ${opt === q.correct_answer ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-slate-700 border-slate-600 text-gray-300'}`}>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-sm text-gray-500 flex space-x-4">
                                    <span>Time Limit: {q.time_limit}s</span>
                                    {q.explanation && <span>Explanation: {q.explanation}</span>}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {editingId !== 'new' && (
                <button
                    onClick={handleAddNew}
                    className="fixed bottom-8 right-8 bg-accent text-slate-900 p-4 rounded-full shadow-lg hover:bg-blue-400 transition-colors z-10"
                >
                    <Plus size={24} />
                </button>
            )}
        </div>
    );
}

function QuestionForm({ formData, setFormData, onSave, onCancel, handleOptionChange }) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm text-gray-400 mb-1">Question Text</label>
                <input
                    type="text"
                    className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                    value={formData.question_text}
                    onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.options.map((opt, idx) => (
                    <div key={idx}>
                        <label className="block text-sm text-gray-400 mb-1">Option {idx + 1}</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                            value={opt}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                        />
                    </div>
                ))}
            </div>
            <div>
                <label className="block text-sm text-gray-400 mb-1">Correct Answer (Must match exactly)</label>
                <input
                    type="text"
                    className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                    value={formData.correct_answer}
                    onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Time Limit (seconds)</label>
                    <input
                        type="number"
                        className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                        value={formData.time_limit}
                        onChange={(e) => setFormData({ ...formData, time_limit: parseInt(e.target.value) })}
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Explanation (Optional)</label>
                    <input
                        type="text"
                        className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                        value={formData.explanation}
                        onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    />
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button onClick={onCancel} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button onClick={onSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 font-bold flex items-center space-x-2">
                    <Save size={18} />
                    <span>Save Question</span>
                </button>
            </div>
        </div>
    );
}
