import { Sparkles, Zap, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8 animate-float">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm text-foreground/80">
            Next-Gen Neuroadaptive Learning Platform
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
          Learn Smarter,
          <br />
          Not Harder
        </h1>

        <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-12">
          Experience the future of education with real-time emotion tracking, EEG integration,
          and AI-powered adaptive learning that responds to your mental state.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            size="lg"
            className="neon-border bg-primary text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary))] transition-all"
          >
            <Zap className="w-5 h-5 mr-2" />
            Launch Dashboard
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-secondary text-secondary hover:bg-secondary/10"
          >
            <BrainCircuit className="w-5 h-5 mr-2" />
            Explore Features
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { value: '100%', label: 'Real-time Adaptation' },
            { value: '5+', label: 'Input Modalities' },
            { value: 'AR/VR', label: 'Immersive Experience' },
          ].map((stat, i) => (
            <div key={i} className="cyber-card p-6 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-foreground/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
