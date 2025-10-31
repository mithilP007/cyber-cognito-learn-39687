import { Brain, Activity, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-primary/30 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary animate-neon-pulse" />
          <span className="text-2xl font-bold gradient-text">NeuroLearn</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-foreground/80 hover:text-primary transition-colors">
            Features
          </a>
          <a href="#dashboard" className="text-foreground/80 hover:text-primary transition-colors">
            Dashboard
          </a>
          <a href="#about" className="text-foreground/80 hover:text-primary transition-colors">
            About
          </a>
        </div>

        <Button className="neon-border bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground">
          <Activity className="w-4 h-4 mr-2" />
          Start Session
        </Button>
      </div>
    </nav>
  );
};
