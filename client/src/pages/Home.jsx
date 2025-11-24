import { BackgroundPaths } from '../components/ui/background-paths';
import { GlobalLeaderboard } from '../components/ui/global-leaderboard';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-slate-950">
            <div onClick={() => navigate('/dashboard')}>
                <BackgroundPaths title="Cloud Quiz" />
            </div>
            <GlobalLeaderboard />
        </div>
    );
}
