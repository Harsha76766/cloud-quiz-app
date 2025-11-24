import { LayoutDashboard, List, FileQuestion, Users, BarChart2, Award, Settings } from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'categories', label: 'Categories', icon: List },
        { id: 'quizzes', label: 'Quizzes', icon: FileQuestion },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
        { id: 'achievements', label: 'Achievements', icon: Award },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="w-64 bg-slate-800 h-screen fixed left-0 top-0 border-r border-slate-700 flex flex-col">
            <div className="p-6 border-b border-slate-700">
                <h1 className="text-2xl font-bold text-accent">Admin Panel</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                                    ? 'bg-accent text-slate-900 font-bold'
                                    : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-slate-700">
                <div className="text-xs text-gray-500 text-center">
                    v1.0.0
                </div>
            </div>
        </div>
    );
}
