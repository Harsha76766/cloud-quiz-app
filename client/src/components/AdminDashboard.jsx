import { useState, useEffect } from 'react';
import { Users, FileQuestion, CheckCircle, Activity } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { getAnalyticsOverview, getUserActivity, getQuizzes, getUsers } from '../services/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function AdminDashboard() {
    const [overview, setOverview] = useState(null);
    const [activity, setActivity] = useState([]);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [overviewData, activityData, quizzesData] = await Promise.all([
                getAnalyticsOverview(),
                getUserActivity(),
                getQuizzes()
            ]);

            setOverview(overviewData);
            setActivity(activityData);

            // Calculate total questions from quizzes (if needed, or fetch from a questions endpoint)
            // For now, we'll use a placeholder or calculate from existing data
            setTotalQuestions(quizzesData.length * 10); // Rough estimate

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    // Prepare chart data
    const chartData = {
        labels: activity.slice(-7).map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })),
        datasets: [
            {
                label: 'Quiz Attempts',
                data: activity.slice(-7).map(d => d.attempts),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#94a3b8' }
            },
            title: {
                display: true,
                text: 'Recent Activity (Last 7 Days)',
                color: '#e2e8f0'
            },
        },
        scales: {
            y: {
                ticks: { color: '#94a3b8' },
                grid: { color: '#334155' }
            },
            x: {
                ticks: { color: '#94a3b8' },
                grid: { color: '#334155' }
            }
        }
    };

    if (loading) {
        return <div className="text-center p-8">Loading dashboard...</div>;
    }

    const stats = [
        {
            label: 'Total Users',
            value: overview?.totalUsers || 0,
            icon: Users,
            color: 'bg-blue-500'
        },
        {
            label: 'Total Quizzes',
            value: overview?.totalQuizzes || 0,
            icon: FileQuestion,
            color: 'bg-purple-500'
        },
        {
            label: 'Quiz Attempts',
            value: overview?.totalAttempts || 0,
            icon: CheckCircle,
            color: 'bg-green-500'
        },
        {
            label: 'Avg Score',
            value: `${overview?.averageScore || 0}%`,
            icon: Activity,
            color: 'bg-orange-500'
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Dashboard Overview</h2>
                <button
                    onClick={fetchDashboardData}
                    className="px-4 py-2 bg-accent text-slate-900 rounded-lg font-semibold hover:bg-blue-400 transition-colors"
                >
                    Refresh Data
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex items-center space-x-4 hover:border-accent transition-colors">
                            <div className={`p-4 rounded-lg ${stat.color} bg-opacity-20`}>
                                <Icon className={`w-8 h-8 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                    {activity.length > 0 ? (
                        <Bar data={chartData} options={chartOptions} />
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            No activity data available yet
                        </div>
                    )}
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
                            <span className="text-gray-300">Total Users</span>
                            <span className="text-2xl font-bold text-blue-400">{overview?.totalUsers || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
                            <span className="text-gray-300">Total Quizzes</span>
                            <span className="text-2xl font-bold text-purple-400">{overview?.totalQuizzes || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
                            <span className="text-gray-300">Quiz Attempts</span>
                            <span className="text-2xl font-bold text-green-400">{overview?.totalAttempts || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
                            <span className="text-gray-300">Average Score</span>
                            <span className="text-2xl font-bold text-orange-400">{overview?.averageScore || 0}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
