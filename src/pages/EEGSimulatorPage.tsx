import { Navigation } from '@/components/Navigation';
import EEGSimulator from '@/components/EEGSimulator';
import WorkflowDiagram from '@/components/WorkflowDiagram';
import { AnimatedBackground } from '@/components/AnimatedBackground';

const EEGSimulatorPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBackground />
      <Navigation />
      <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto space-y-12">
        {/* Visual Workflow Diagram Section */}
        <section className="space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              EEG Learning System Workflow
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore how our EEG-driven learning system processes brainwaves into personalized experiences
            </p>
          </div>
          <WorkflowDiagram />
        </section>

        {/* EEG Simulator Section */}
        <section className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">
              Live EEG Simulator
            </h2>
            <p className="text-muted-foreground">
              Experience real-time brainwave simulation and monitoring
            </p>
          </div>
          <EEGSimulator />
        </section>
      </div>
    </div>
  );
};

export default EEGSimulatorPage;
