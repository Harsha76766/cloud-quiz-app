import { useState, useEffect } from 'react';
import { TrendingUp, Users, Award, BarChart3, Activity } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { getAnalyticsOverview, getQuizPerformance, getUserActivity } from '../services/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function AdminAnalytics() {
    const [overview, setOverview] = useState(null);
    const [quizPerformance, setQuizPerformance] = useState([]);
    const [userActivity, setUserActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [overviewData, performanceData, activityData] = await Promise.all([
                getAnalyticsOverview(),
                getQuizPerformance(),
                getUserActivity()
            ]);
            setOverview(overviewData);
            setQuizPerformance(performanceData);
            setUserActivity(activityData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setLoading(false);
        }
    };

    // Chart configurations
    const userActivityChartData = {
        labels: userActivity.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'Quiz Attempts',
                data: userActivity.map(d => d.attempts),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const quizPerformanceChartData = {
        labels: quizPerformance.map(q => q.title),
        datasets: [
            {
                label: 'Average Score',
                data: quizPerformance.map(q => q.averageScore),
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
            },
            {
                label: 'Attempts',
                data: quizPerformance.map(q => q.attempts),
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#e2e8f0',
                },
            },
        },
        scales: {
            x: {
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(148, 163, 184, 0.1)' },
            },
            y: {
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(148, 163, 184, 0.1)' },
            },
        },
    };

    if (loading) return <div className="text-center p-8">Loading analytics...</div>;

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold">Analytics & Insights</h2>
                <p className="text-gray-400 text-sm">Monitor quiz performance and user engagement</p>
            </div>

            {/* Overview Stats */}
            {overview && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={<Users size={24} />}
                        title="Total Users"
                        value={overview.totalUsers}
                        color="blue"
                    />
                    <StatCard
                        icon={<BarChart3 size={24} />}
                        title="Total Quizzes"
                        value={overview.totalQuizzes}
                        color="green"
                    />
                    <StatCard
                        icon={<Activity size={24} />}
                        title="Quiz Attempts"
                        value={overview.totalAttempts}
                        color="purple"
                    />
                    <StatCard
                        icon={<Award size={24} />}
                        title="Avg Score"
                        value={`${overview.averageScore}%`}
                        color="yellow"
                    />
                </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* User Activity Chart */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                        <TrendingUp size={20} className="text-blue-400" />
                        <span>User Activity (Last 30 Days)</span>
                    </h3>
                    <div style={{ height: '300px' }}>
                        <Line data={userActivityChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Quiz Performance Chart */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                        <BarChart3 size={20} className="text-green-400" />
                        <span>Quiz Performance</span>
                    </h3>
                    <div style={{ height: '300px' }}>
                        <Bar data={quizPerformanceChartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Quiz Performance Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                    <h3 className="text-xl font-bold">Detailed Quiz Statistics</h3>
                </div>
                <table className="w-full">
                    <thead className="bg-slate-700">
                        <tr>
                            <th className="text-left p-4 font-semibold">Quiz Title</th>
                            <th className="text-left p-4 font-semibold">Attempts</th>
                            <th className="text-left p-4 font-semibold">Avg Score</th>
                            <th className="text-left p-4 font-semibold">Highest</th>
                            <th className="text-left p-4 font-semibold">Lowest</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizPerformance.map((quiz) => (
                            <tr key={quiz.id} className="border-t border-slate-700 hover:bg-slate-750">
                                <td className="p-4">{quiz.title}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-sm font-bold">
                                        {quiz.attempts}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className="font-bold text-green-400">{quiz.averageScore}%</span>
                                </td>
                                <td className="p-4 text-green-300">{quiz.highestScore}%</td>
                                <td className="p-4 text-red-300">{quiz.lowestScore}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {quizPerformance.length === 0 && (
                    <div className="text-center text-gray-500 py-8">No quiz data available yet.</div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, color }) {
    const colorClasses = {
        blue: 'bg-blue-500/20 text-blue-400',
        green: 'bg-green-500/20 text-green-400',
        purple: 'bg-purple-500/20 text-purple-400',
        yellow: 'bg-yellow-500/20 text-yellow-400',
    };

    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
}
