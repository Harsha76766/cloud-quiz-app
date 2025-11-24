import { useState, useEffect } from 'react';
import { Users, Shield, Ban, CheckCircle, XCircle, Award } from 'lucide-react';
import { getUsers, updateUser } from '../services/api';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, admin, user, banned

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUser(userId, { role: newRole });
            fetchUsers();
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update user role');
        }
    };

    const handleBanToggle = async (userId, currentBanStatus) => {
        try {
            await updateUser(userId, { banned: !currentBanStatus });
            fetchUsers();
        } catch (error) {
            console.error('Error toggling ban status:', error);
            alert('Failed to update ban status');
        }
    };

    const filteredUsers = users.filter(user => {
        if (filter === 'admin') return user.role === 'admin';
        if (filter === 'user') return user.role === 'user';
        if (filter === 'banned') return user.banned;
        return true;
    });

    if (loading) return <div className="text-center p-8">Loading users...</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold">User Management</h2>
                    <p className="text-gray-400 text-sm">{users.length} total users</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6 flex gap-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'all' ? 'bg-accent text-slate-900' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                >
                    All Users ({users.length})
                </button>
                <button
                    onClick={() => setFilter('admin')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'admin' ? 'bg-accent text-slate-900' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                >
                    Admins ({users.filter(u => u.role === 'admin').length})
                </button>
                <button
                    onClick={() => setFilter('user')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'user' ? 'bg-accent text-slate-900' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                >
                    Regular Users ({users.filter(u => u.role === 'user').length})
                </button>
                <button
                    onClick={() => setFilter('banned')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'banned' ? 'bg-accent text-slate-900' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                >
                    Banned ({users.filter(u => u.banned).length})
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-700">
                        <tr>
                            <th className="text-left p-4 font-semibold">Email</th>
                            <th className="text-left p-4 font-semibold">Role</th>
                            <th className="text-left p-4 font-semibold">XP</th>
                            <th className="text-left p-4 font-semibold">Streak</th>
                            <th className="text-left p-4 font-semibold">Status</th>
                            <th className="text-left p-4 font-semibold">Joined</th>
                            <th className="text-left p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-t border-slate-700 hover:bg-slate-750">
                                <td className="p-4">
                                    <div className="flex items-center space-x-2">
                                        <Users size={16} className="text-gray-400" />
                                        <span>{user.email}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="p-2 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center space-x-1">
                                        <Award size={16} className="text-yellow-400" />
                                        <span>{user.xp || 0}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="text-orange-400 font-bold">{user.streak || 0}🔥</span>
                                </td>
                                <td className="p-4">
                                    {user.banned ? (
                                        <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400 flex items-center space-x-1 w-fit">
                                            <XCircle size={14} />
                                            <span>Banned</span>
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400 flex items-center space-x-1 w-fit">
                                            <CheckCircle size={14} />
                                            <span>Active</span>
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-gray-400 text-sm">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleBanToggle(user.id, user.banned)}
                                        className={`px-3 py-1 rounded-lg font-semibold transition-colors ${user.banned
                                                ? 'bg-green-600 hover:bg-green-500 text-white'
                                                : 'bg-red-600 hover:bg-red-500 text-white'
                                            }`}
                                    >
                                        {user.banned ? 'Unban' : 'Ban'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="text-center text-gray-500 py-8">No users found.</div>
                )}
            </div>
        </div>
    );
}
