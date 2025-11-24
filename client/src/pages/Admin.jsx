import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminDashboard from '../components/AdminDashboard';
import AdminCategories from '../components/AdminCategories';
import AdminQuizzes from '../components/AdminQuizzes';
import AdminUsers from '../components/AdminUsers';
import AdminAnalytics from '../components/AdminAnalytics';
import AdminAchievements from '../components/AdminAchievements';
import AdminSettings from '../components/AdminSettings';

export default function Admin() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <AdminDashboard />;
            case 'categories': return <AdminCategories />;
            case 'quizzes': return <AdminQuizzes />;
            case 'users': return <AdminUsers />;
            case 'analytics': return <AdminAnalytics />;
            case 'achievements': return <AdminAchievements />;
            case 'settings': return <AdminSettings />;
            default: return <AdminDashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 ml-64 p-8 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
}
