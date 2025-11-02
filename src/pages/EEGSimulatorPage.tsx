import { Navigation } from '@/components/Navigation';
import EEGSimulator from '@/components/EEGSimulator';
import { AnimatedBackground } from '@/components/AnimatedBackground';

const EEGSimulatorPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBackground />
      <Navigation />
      <div className="pt-24 px-6">
        <EEGSimulator />
      </div>
    </div>
  );
};

export default EEGSimulatorPage;
