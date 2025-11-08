import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Activity, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navigation = () => {
  const [dashboardOpen, setDashboardOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-primary/30 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary animate-neon-pulse" />
          <span className="text-2xl font-bold gradient-text">NeuroLearn</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">
            Home
          </Link>
          
          <div 
            className="relative"
            onMouseEnter={() => setDashboardOpen(true)}
            onMouseLeave={() => setDashboardOpen(false)}
          >
            <button className="flex items-center gap-1 text-foreground/80 hover:text-primary transition-colors">
              Dashboard
              {/* <ChevronDown className="w-4 h-4" /> */}
            </button>
            
            {/* {dashboardOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-primary/30 rounded-lg shadow-lg backdrop-blur-md overflow-hidden">
                <Link 
                  to="/dashboard" 
                  className="block px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  Main Dashboard
                </Link>
                <Link 
                  to="/dashboard/sub" 
                  className="block px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  Sub Dashboard
                </Link>
              </div>
            )} */}
          </div>
          
          <Link to="/eeg-simulator" className="text-foreground/80 hover:text-primary transition-colors">
            EEG Simulator
          </Link>
        </div>
        
        <Button className="neon-border bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground">
          <Activity className="w-4 h-4 mr-2" />
          Start Session
        </Button>
      </div>
    </nav>
  );
};
