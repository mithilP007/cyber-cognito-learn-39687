import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { AnimatedBackground } from '@/components/AnimatedBackground';

const MainDashboard = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBackground />
      <Navigation />
      <div className="pt-24">
        <Dashboard />
      </div>
    </div>
  );
};

export default MainDashboard;
