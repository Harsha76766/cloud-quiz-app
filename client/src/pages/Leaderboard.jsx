import { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/api';

export default function Leaderboard() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLeaderboard()
            .then(data => {
                setLeaders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center mt-20">Loading leaderboard...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-center">Global Leaderboard</h1>

            <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 text-gray-400 uppercase text-sm">
                        <tr>
                            <th className="px-6 py-4">Rank</th>
                            <th className="px-6 py-4">Quiz</th>
                            <th className="px-6 py-4">Score</th>
                            <th className="px-6 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {leaders.map((entry, index) => (
                            <tr key={index} className="hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-accent">#{index + 1}</td>
                                <td className="px-6 py-4">{entry.quizzes?.title || 'Unknown Quiz'}</td>
                                <td className="px-6 py-4 font-bold text-white">{entry.score}</td>
                                <td className="px-6 py-4 text-gray-400">
                                    {new Date(entry.completed_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {leaders.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                    No scores yet. Be the first!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
