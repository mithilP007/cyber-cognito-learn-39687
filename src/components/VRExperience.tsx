import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, Mountain, Waves, Trees, Music, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface Environment {
  id: string;
  name: string;
  icon: any;
  color: string;
  musicUrl: string;
  description: string;
}

const environments: Environment[] = [
  {
    id: 'mountain',
    name: 'Mountain Peak',
    icon: Mountain,
    color: '#00f0ff',
    musicUrl: 'ambient-mountain',
    description: 'Focus and clarity in serene heights'
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    icon: Waves,
    color: '#ff00ff',
    musicUrl: 'ambient-ocean',
    description: 'Deep concentration with calming waves'
  },
  {
    id: 'forest',
    name: 'Sacred Forest',
    icon: Trees,
    color: '#00ff41',
    musicUrl: 'ambient-forest',
    description: 'Natural learning environment'
  },
  {
    id: 'cosmic',
    name: 'Cosmic Space',
    icon: Zap,
    color: '#ffd700',
    musicUrl: 'ambient-space',
    description: 'Infinite potential and creativity'
  }
];

export const VRExperience = () => {
  const [selectedEnv, setSelectedEnv] = useState<Environment>(environments[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let rotation = 0;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; size: number }> = [];

    // Initialize particles based on environment
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(17, 24, 39, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw environment-specific visuals
      if (selectedEnv.id === 'mountain') {
        // Mountain peaks
        ctx.strokeStyle = selectedEnv.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = selectedEnv.color;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 50) {
          const y = centerY + Math.sin(x * 0.01 + rotation) * 50;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (selectedEnv.id === 'ocean') {
        // Ocean waves
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.strokeStyle = selectedEnv.color;
          ctx.lineWidth = 3;
          ctx.shadowBlur = 15;
          ctx.shadowColor = selectedEnv.color;
          for (let x = 0; x < canvas.width; x++) {
            const y = centerY + Math.sin(x * 0.02 + rotation + i) * (30 - i * 10);
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else if (selectedEnv.id === 'forest') {
        // Forest particles
        particles.forEach((p) => {
          ctx.fillStyle = selectedEnv.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = selectedEnv.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          
          p.x += p.vx;
          p.y += p.vy;
          
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });
      } else if (selectedEnv.id === 'cosmic') {
        // Cosmic spirals
        for (let i = 0; i < 5; i++) {
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(rotation + i * 0.3);
          ctx.beginPath();
          ctx.strokeStyle = selectedEnv.color;
          ctx.lineWidth = 2;
          ctx.shadowBlur = 25;
          ctx.shadowColor = selectedEnv.color;
          for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
            const r = angle * 5;
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);
            ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.restore();
        }
      }

      rotation += 0.02;
      requestAnimationFrame(animate);
    };

    animate();
  }, [selectedEnv]);

  const toggleMusic = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }

    if (isPlaying) {
      oscillatorRef.current?.stop();
      oscillatorRef.current = null;
      setIsPlaying(false);
      toast.info('Music paused');
    } else {
      const oscillator = audioContextRef.current.createOscillator();
      oscillatorRef.current = oscillator;
      
      // Set frequency based on environment
      const frequencies: Record<string, number> = {
        mountain: 432,
        ocean: 396,
        forest: 528,
        cosmic: 639
      };
      
      oscillator.frequency.value = frequencies[selectedEnv.id];
      oscillator.type = 'sine';
      
      if (gainNodeRef.current) {
        oscillator.connect(gainNodeRef.current);
        gainNodeRef.current.gain.value = volume[0] / 100;
      }
      
      oscillator.start();
      setIsPlaying(true);
      toast.success(`♪ ${selectedEnv.name} soundscape playing`);
    }
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume[0] / 100;
    }
  }, [volume]);

  const handleEnvChange = (env: Environment) => {
    if (isPlaying) {
      oscillatorRef.current?.stop();
      setIsPlaying(false);
    }
    setSelectedEnv(env);
    toast.info(`Entering ${env.name}`);
  };

  return (
    <Card className="cyber-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl gradient-text">AR/VR Experience</CardTitle>
            <CardDescription>Immersive learning environments with adaptive music</CardDescription>
          </div>
          <Badge className="neon-border" style={{ backgroundColor: `${selectedEnv.color}20`, borderColor: selectedEnv.color }}>
            {selectedEnv.name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="environments" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="environments">Environments</TabsTrigger>
            <TabsTrigger value="session">Current Session</TabsTrigger>
          </TabsList>

          <TabsContent value="environments" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {environments.map((env) => (
                <Button
                  key={env.id}
                  onClick={() => handleEnvChange(env)}
                  className={`h-20 flex flex-col gap-2 border-2 transition-all ${
                    selectedEnv.id === env.id
                      ? 'neon-border bg-primary/20'
                      : 'border-muted bg-card hover:bg-muted/50'
                  }`}
                  variant="outline"
                >
                  <env.icon className="w-5 h-5" style={{ color: env.color }} />
                  <span className="text-xs font-medium">{env.name}</span>
                </Button>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-primary/20">
              <p className="text-sm text-muted-foreground">{selectedEnv.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="session" className="space-y-4">
            <canvas
              ref={canvasRef}
              className="w-full h-48 rounded-lg border border-primary/20 bg-background/50"
            />

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={toggleMusic}
                  size="lg"
                  className={isPlaying ? 'neon-border bg-primary/20' : ''}
                  variant={isPlaying ? 'default' : 'outline'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                  {isPlaying ? 'Pause' : 'Play'} Soundscape
                </Button>
                
                <Music className="w-5 h-5 text-primary animate-neon-pulse" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Volume
                  </label>
                  <span className="text-sm text-muted-foreground">{volume[0]}%</span>
                </div>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs text-muted-foreground">Session Time</p>
                  <p className="text-lg font-bold gradient-text">0:00</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                  <p className="text-xs text-muted-foreground">Focus Score</p>
                  <p className="text-lg font-bold text-secondary">--</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};