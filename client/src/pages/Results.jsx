import { useEffect, useState } from 'react';
import { getUserResults } from '../services/api';
import { supabase } from '../services/supabase';

export default function Results() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                try {
                    const data = await getUserResults(user.id);
                    setResults(data);
                } catch (error) {
                    console.error(error);
                }
            }
            setLoading(false);
        };
        fetchResults();
    }, []);

    if (loading) return <div className="text-center mt-20">Loading results...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-8">Your Quiz History</h2>
            {results.length === 0 ? (
                <p className="text-gray-400">You haven't taken any quizzes yet.</p>
            ) : (
                <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700">
                    <table className="w-full text-left">
                        <thead className="bg-slate-700">
                            <tr>
                                <th className="p-4">Quiz Title</th>
                                <th className="p-4">Score</th>
                                <th className="p-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result) => (
                                <tr key={result.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                    <td className="p-4 font-medium">{result.quizzes?.title || 'Unknown Quiz'}</td>
                                    <td className="p-4 text-accent font-bold">{result.score}</td>
                                    <td className="p-4 text-gray-400">
                                        {new Date(result.completed_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
