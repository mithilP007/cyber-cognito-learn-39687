import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Dashboard } from '@/components/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBackground />
      <Navigation />
      <Hero />
      <Dashboard />
    </div>
  );
};

export default Index;
