import { useState, useEffect } from 'react';
import { Settings, Save, Palette, Bell, Shield } from 'lucide-react';
import { getSettings, updateSetting } from '../services/api';

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        branding: { appName: 'CloudQuiz', primaryColor: '#3b82f6' },
        maintenance: { enabled: false, message: '' }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await getSettings();
            setSettings(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setLoading(false);
        }
    };

    const handleSaveBranding = async () => {
        setSaving(true);
        try {
            await updateSetting('branding', settings.branding);
            alert('Branding settings saved successfully!');
        } catch (error) {
            console.error('Error saving branding:', error);
            alert('Failed to save branding settings');
        }
        setSaving(false);
    };

    const handleSaveMaintenance = async () => {
        setSaving(true);
        try {
            await updateSetting('maintenance', settings.maintenance);
            alert('Maintenance settings saved successfully!');
        } catch (error) {
            console.error('Error saving maintenance:', error);
            alert('Failed to save maintenance settings');
        }
        setSaving(false);
    };

    const updateBranding = (field, value) => {
        setSettings({
            ...settings,
            branding: { ...settings.branding, [field]: value }
        });
    };

    const updateMaintenance = (field, value) => {
        setSettings({
            ...settings,
            maintenance: { ...settings.maintenance, [field]: value }
        });
    };

    if (loading) return <div className="text-center p-8">Loading settings...</div>;

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold">Application Settings</h2>
                <p className="text-gray-400 text-sm">Manage app configuration and branding</p>
            </div>

            <div className="space-y-6">
                {/* Branding Settings */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                            <Palette size={24} className="text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Branding</h3>
                            <p className="text-gray-400 text-sm">Customize app name and colors</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Application Name</label>
                            <input
                                type="text"
                                className="w-full p-3 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                                value={settings.branding?.appName || ''}
                                onChange={(e) => updateBranding('appName', e.target.value)}
                                placeholder="CloudQuiz"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Primary Color</label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="color"
                                    className="h-12 w-20 rounded cursor-pointer bg-slate-700 border border-slate-600"
                                    value={settings.branding?.primaryColor || '#3b82f6'}
                                    onChange={(e) => updateBranding('primaryColor', e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="flex-1 p-3 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                                    value={settings.branding?.primaryColor || '#3b82f6'}
                                    onChange={(e) => updateBranding('primaryColor', e.target.value)}
                                    placeholder="#3b82f6"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSaveBranding}
                            disabled={saving}
                            className="bg-accent text-slate-900 px-6 py-2 rounded-lg font-bold flex items-center space-x-2 hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            <span>{saving ? 'Saving...' : 'Save Branding'}</span>
                        </button>
                    </div>
                </div>

                {/* Maintenance Mode */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-yellow-500/20 rounded-lg">
                            <Shield size={24} className="text-yellow-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Maintenance Mode</h3>
                            <p className="text-gray-400 text-sm">Control app availability</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="maintenance-toggle"
                                className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-accent focus:ring-accent"
                                checked={settings.maintenance?.enabled || false}
                                onChange={(e) => updateMaintenance('enabled', e.target.checked)}
                            />
                            <label htmlFor="maintenance-toggle" className="text-sm">
                                Enable Maintenance Mode
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Maintenance Message</label>
                            <textarea
                                className="w-full p-3 rounded bg-slate-700 border border-slate-600 focus:border-accent outline-none"
                                value={settings.maintenance?.message || ''}
                                onChange={(e) => updateMaintenance('message', e.target.value)}
                                placeholder="We are currently under maintenance. Please check back later."
                                rows={3}
                            />
                        </div>

                        <button
                            onClick={handleSaveMaintenance}
                            disabled={saving}
                            className="bg-accent text-slate-900 px-6 py-2 rounded-lg font-bold flex items-center space-x-2 hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            <span>{saving ? 'Saving...' : 'Save Maintenance Settings'}</span>
                        </button>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-xl">
                    <div className="flex items-start space-x-3">
                        <Bell size={20} className="text-blue-400 mt-1" />
                        <div>
                            <h4 className="font-bold text-blue-400 mb-2">Settings Information</h4>
                            <ul className="text-sm text-gray-300 space-y-1">
                                <li>• Changes to branding will affect the entire application</li>
                                <li>• Maintenance mode will prevent regular users from accessing the app</li>
                                <li>• Admins can always access the app even in maintenance mode</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
