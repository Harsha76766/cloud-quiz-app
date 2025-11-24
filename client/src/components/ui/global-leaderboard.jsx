import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Calendar } from 'lucide-react';

export function GlobalLeaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/leaderboard');
            const data = await response.json();
            setLeaderboard(data.slice(0, 10)); // Top 10 only
            setLoading(false);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            setLoading(false);
        }
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <Trophy className="w-6 h-6 text-yellow-400" />;
            case 2:
                return <Medal className="w-6 h-6 text-gray-400" />;
            case 3:
                return <Medal className="w-6 h-6 text-amber-600" />;
            default:
                return <Award className="w-5 h-5 text-blue-400" />;
        }
    };

    const getRankBg = (rank) => {
        switch (rank) {
            case 1:
                return 'from-yellow-500/20 to-transparent border-yellow-500/30';
            case 2:
                return 'from-gray-400/20 to-transparent border-gray-400/30';
            case 3:
                return 'from-amber-600/20 to-transparent border-amber-600/30';
            default:
                return 'from-blue-500/10 to-transparent border-border/30';
        }
    };

    if (loading) {
        return (
            <div className="w-full max-w-5xl mx-auto px-4 py-12">
                <div className="text-center text-gray-400">Loading leaderboard...</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative border border-slate-700/50 rounded-2xl p-8 bg-slate-900/50 backdrop-blur-sm"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
                            <Trophy className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white">Global Leaderboard</h2>
                            <p className="text-sm text-gray-400 mt-1">Top 10 Quiz Masters</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm text-gray-400">Live</span>
                    </div>
                </div>

                {/* Table Headers */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-4">Player</div>
                    <div className="col-span-2">Quiz</div>
                    <div className="col-span-2">Score</div>
                    <div className="col-span-2">Date</div>
                </div>

                {/* Leaderboard Entries */}
                <motion.div
                    className="space-y-2"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.05,
                            }
                        }
                    }}
                    initial="hidden"
                    animate="visible"
                >
                    {leaderboard.map((entry, index) => {
                        const rank = index + 1;
                        return (
                            <motion.div
                                key={index}
                                variants={{
                                    hidden: {
                                        opacity: 0,
                                        x: -20,
                                        scale: 0.95
                                    },
                                    visible: {
                                        opacity: 1,
                                        x: 0,
                                        scale: 1,
                                        transition: {
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 25,
                                        },
                                    },
                                }}
                                whileHover={{
                                    y: -2,
                                    transition: { duration: 0.2 }
                                }}
                                className="relative"
                            >
                                <div className={`relative bg-gradient-to-r ${getRankBg(rank)} border rounded-xl p-4 overflow-hidden`}>
                                    <div className="relative grid grid-cols-12 gap-4 items-center">
                                        {/* Rank Number */}
                                        <div className="col-span-1">
                                            <span className={`text-2xl font-bold ${rank <= 3 ? 'text-white' : 'text-gray-400'}`}>
                                                {String(rank).padStart(2, '0')}
                                            </span>
                                        </div>

                                        {/* Rank Icon */}
                                        <div className="col-span-1">
                                            {getRankIcon(rank)}
                                        </div>

                                        {/* Player Email */}
                                        <div className="col-span-4">
                                            <span className="text-white font-medium">
                                                {entry.user_email || 'Anonymous'}
                                            </span>
                                        </div>

                                        {/* Quiz Title */}
                                        <div className="col-span-2">
                                            <span className="text-gray-300 text-sm">
                                                {entry.quizzes?.title || 'Quiz'}
                                            </span>
                                        </div>

                                        {/* Score */}
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`px-3 py-1.5 rounded-lg ${entry.score >= 90 ? 'bg-green-500/20 border border-green-500/30' :
                                                        entry.score >= 70 ? 'bg-blue-500/20 border border-blue-500/30' :
                                                            'bg-orange-500/20 border border-orange-500/30'
                                                    }`}>
                                                    <span className={`text-sm font-bold ${entry.score >= 90 ? 'text-green-400' :
                                                            entry.score >= 70 ? 'text-blue-400' :
                                                                'text-orange-400'
                                                        }`}>
                                                        {entry.score}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(entry.completed_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {leaderboard.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No scores yet. Be the first to complete a quiz!</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
