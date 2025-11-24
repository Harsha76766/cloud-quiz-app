import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <nav className="bg-slate-800 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-accent">CloudQuiz</Link>
                <div className="space-x-4">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="hover:text-accent transition-colors">Dashboard</Link>
                            <Link to="/leaderboard" className="hover:text-accent transition-colors">Leaderboard</Link>
                            <Link to="/results" className="hover:text-accent transition-colors">My Results</Link>
                            <Link to="/admin" className="hover:text-accent transition-colors">Admin</Link>
                            <button onClick={handleLogout} className="hover:text-red-400 transition-colors">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="hover:text-accent transition-colors">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
