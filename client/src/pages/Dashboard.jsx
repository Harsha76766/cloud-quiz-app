import { useEffect, useState } from 'react';
import { getQuizzes } from '../services/api';
import { Link } from 'react-router-dom';
import { Trophy, Zap, Server } from 'lucide-react';

export default function Dashboard() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getQuizzes().then(data => {
            setQuizzes(data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const getIcon = (category) => {
        switch (category.toLowerCase()) {
            case 'cloud': return <Server className="w-8 h-8 text-blue-400" />;
            case 'edge': return <Zap className="w-8 h-8 text-yellow-400" />;
            default: return <Trophy className="w-8 h-8 text-purple-400" />;
        }
    };

    if (loading) return <div className="text-center mt-20">Loading quizzes...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-8">Available Quizzes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map(quiz => (
                    <div key={quiz.id} className="bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            {getIcon(quiz.category)}
                            <span className={`text-xs font-bold px-2 py-1 rounded ${quiz.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                                    quiz.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                        'bg-red-500/20 text-red-300'
                                }`}>
                                {quiz.difficulty}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                        <p className="text-gray-400 mb-6 text-sm">{quiz.description}</p>
                        <Link
                            to={`/quiz/${quiz.id}`}
                            className="block w-full text-center bg-slate-700 hover:bg-accent hover:text-slate-900 text-white font-bold py-2 rounded transition-colors"
                        >
                            Start Quiz
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
