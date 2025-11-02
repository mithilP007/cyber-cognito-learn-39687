import { Navigation } from '@/components/Navigation';
import EEGSimulator from '@/components/EEGSimulator';
import WorkflowDiagram from '@/components/WorkflowDiagram';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useState } from 'react';
import { AlertTriangle, Wifi, Monitor, Smartphone, Camera, Shield, Heart, Brain, Play, Pause } from 'lucide-react';

const EEGSimulatorPage = () => {
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  const [isDreamMode, setIsDreamMode] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <AnimatedBackground />
      <Navigation />
      
      {/* Waking/Dreaming Animated Overlay */}
      <div className={`fixed inset-0 pointer-events-none transition-all duration-1000 ${isDreamMode ? 'opacity-20' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-500/10 to-transparent animate-pulse" />
        {Array.from({length: 20}).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Simulation Mode Banner */}
        {isSimulationMode && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <h3 className="text-xl font-bold text-green-400">🧠 Simulation Mode Active</h3>
                <span className="text-sm text-green-300/80">(No device needed)</span>
              </div>
              <button 
                onClick={() => setIsDreamMode(!isDreamMode)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg transition-colors"
              >
                {isDreamMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isDreamMode ? 'Exit Dream Mode' : 'Enter Dream Mode'}</span>
              </button>
            </div>
            <p className="text-sm text-green-300/70 mt-2">
              Experience our EEG simulation without physical hardware. All brainwave patterns are generated algorithmically for demonstration purposes.
            </p>
          </div>
        )}

        {/* AR/PWA/Live Deployment Info Card */}
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Monitor className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-bold text-blue-400">AR/PWA Deployment Info</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-cyan-400">Progressive Web App</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Install directly to your device for offline access and native app experience.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-purple-400">AR Integration</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Augmented reality overlays for immersive brainwave visualization and learning environments.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Wifi className="w-5 h-5 text-green-400" />
                <span className="font-semibold text-green-400">Live Deployment</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Real-time updates and cloud synchronization for seamless multi-device experience.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-blue-500/20">
            <div className="text-sm text-muted-foreground">
              📱 Install Instructions: Tap browser menu → "Add to Home Screen"
            </div>
            <a href="#screenshot" className="text-blue-400 hover:text-blue-300 text-sm underline">
              View Screenshots →
            </a>
          </div>
        </div>

        {/* Safety & Ethics Section */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-amber-400" />
            <h3 className="text-2xl font-bold text-amber-400">Safety & Ethics</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-400">Comfort & Consent</h4>
                  <p className="text-sm text-muted-foreground">Your wellbeing is our priority</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Informed consent required before any data collection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Real-time comfort monitoring and adjustment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Immediate stop/pause available at any time</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-blue-400 animate-bounce" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-400">Design Notes</h4>
                  <p className="text-sm text-muted-foreground">Ethical considerations</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span>Privacy-first architecture with local processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span>Transparent algorithms and open-source components</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span>Regular ethical review and bias assessment</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-400">Important Safety Notice</p>
                <p className="text-amber-300/80 mt-1">
                  This technology is for educational and research purposes. Not intended for medical diagnosis or treatment. Always consult healthcare professionals for medical concerns.
                </p>
              </div>
            </div>
          </div>
        </div>

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
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default EEGSimulatorPage;
