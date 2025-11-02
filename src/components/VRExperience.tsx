import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, Mountain, Waves, Trees, Music, Zap, Sunrise, Cherry, Sparkles, CloudRain, Wind, Droplet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface Environment {
  id: string;
  name: string;
  icon: any;
  color: string;
  frequency: number;
  description: string;
  location: string;
}

const environments: Environment[] = [
  {
    id: 'mountain',
    name: 'Mountain Peak',
    icon: Mountain,
    color: '#00f0ff',
    frequency: 432,
    description: 'Focus and clarity in serene heights',
    location: 'Himalayas, Tibet'
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    icon: Waves,
    color: '#0ea5e9',
    frequency: 396,
    description: 'Deep concentration with calming waves',
    location: 'Maldives'
  },
  {
    id: 'forest',
    name: 'Sacred Forest',
    icon: Trees,
    color: '#00ff41',
    frequency: 528,
    description: 'Natural learning environment',
    location: 'Amazon Rainforest'
  },
  {
    id: 'cosmic',
    name: 'Cosmic Space',
    icon: Zap,
    color: '#ffd700',
    frequency: 639,
    description: 'Infinite potential and creativity',
    location: 'Deep Space'
  },
  {
    id: 'beach',
    name: 'Beach Sunset',
    icon: Sunrise,
    color: '#f97316',
    frequency: 417,
    description: 'Peaceful evening by the shore',
    location: 'Bali, Indonesia'
  },
  {
    id: 'garden',
    name: 'Japanese Garden',
    icon: Cherry,
    color: '#ec4899',
    frequency: 741,
    description: 'Zen meditation and balance',
    location: 'Kyoto, Japan'
  },
  {
    id: 'aurora',
    name: 'Northern Lights',
    icon: Sparkles,
    color: '#22c55e',
    frequency: 852,
    description: 'Mystical aurora meditation',
    location: 'Iceland'
  },
  {
    id: 'rainforest',
    name: 'Tropical Rainforest',
    icon: CloudRain,
    color: '#10b981',
    frequency: 396,
    description: 'Living jungle soundscape',
    location: 'Costa Rica'
  },
  {
    id: 'desert',
    name: 'Desert Dunes',
    icon: Wind,
    color: '#d97706',
    frequency: 528,
    description: 'Vast stillness and clarity',
    location: 'Sahara Desert'
  },
  {
    id: 'waterfall',
    name: 'Hidden Waterfall',
    icon: Droplet,
    color: '#06b6d4',
    frequency: 639,
    description: 'Flowing energy and renewal',
    location: 'New Zealand'
  }
];

export const VRExperience = () => {
  const [selectedEnv, setSelectedEnv] = useState<Environment>(environments[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [sessionTime, setSessionTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let rotation = 0;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; size: number }> = [];

    for (let i = 0; i < 100; i++) {
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

      ctx.strokeStyle = selectedEnv.color;
      ctx.fillStyle = selectedEnv.color;
      ctx.shadowColor = selectedEnv.color;

      switch (selectedEnv.id) {
        case 'mountain':
          ctx.lineWidth = 2;
          ctx.shadowBlur = 20;
          ctx.beginPath();
          for (let x = 0; x < canvas.width; x += 50) {
            const y = centerY + Math.sin(x * 0.01 + rotation) * 50;
            ctx.lineTo(x, y);
          }
          ctx.stroke();
          break;

        case 'ocean':
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.shadowBlur = 15;
            for (let x = 0; x < canvas.width; x++) {
              const y = centerY + Math.sin(x * 0.02 + rotation + i) * (30 - i * 10);
              ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
          break;

        case 'beach':
          // Sun
          ctx.shadowBlur = 30;
          ctx.beginPath();
          ctx.arc(centerX, centerY - 30, 40, 0, Math.PI * 2);
          ctx.fill();
          // Waves
          ctx.lineWidth = 2;
          ctx.shadowBlur = 10;
          for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            for (let x = 0; x < canvas.width; x++) {
              const y = centerY + 50 + i * 15 + Math.sin(x * 0.03 + rotation + i * 0.5) * 8;
              ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
          break;

        case 'garden':
          // Cherry blossoms
          particles.forEach((p, idx) => {
            if (idx % 3 === 0) {
              ctx.shadowBlur = 15;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
              ctx.fill();
              p.y += 0.5;
              if (p.y > canvas.height) p.y = 0;
            }
          });
          break;

        case 'aurora':
          // Aurora waves
          for (let i = 0; i < 5; i++) {
            ctx.shadowBlur = 25;
            ctx.globalAlpha = 0.3 + i * 0.1;
            ctx.beginPath();
            for (let x = 0; x < canvas.width; x++) {
              const y = centerY + Math.sin(x * 0.01 + rotation + i) * (50 + i * 10);
              ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
          break;

        case 'rainforest':
          // Rain drops
          particles.forEach((p) => {
            ctx.shadowBlur = 5;
            ctx.fillRect(p.x, p.y, 2, 10);
            p.y += 5;
            if (p.y > canvas.height) {
              p.y = 0;
              p.x = Math.random() * canvas.width;
            }
          });
          break;

        case 'desert':
          // Sand dunes
          ctx.lineWidth = 3;
          ctx.shadowBlur = 20;
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            for (let x = 0; x < canvas.width; x += 5) {
              const y = centerY + Math.sin(x * 0.005 + rotation + i * 2) * (40 + i * 10);
              ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
          break;

        case 'waterfall':
          // Cascading water
          for (let i = 0; i < canvas.width; i += 20) {
            ctx.shadowBlur = 10;
            const height = 40 + Math.sin(i * 0.1 + rotation) * 20;
            ctx.fillRect(i, centerY - height, 5, canvas.height);
          }
          break;

        case 'forest':
        case 'cosmic':
        default:
          particles.forEach((p) => {
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
          });
          break;
      }

      rotation += 0.02;
      requestAnimationFrame(animate);
    };

    animate();
  }, [selectedEnv]);

  useEffect(() => {
    if (isPlaying && !timerRef.current) {
      timerRef.current = window.setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else if (!isPlaying && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying]);

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
      toast.info('🎵 Music paused');
    } else {
      const oscillator = audioContextRef.current.createOscillator();
      oscillatorRef.current = oscillator;
      
      oscillator.frequency.value = selectedEnv.frequency;
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
    setSessionTime(0);
    toast.info(`🌍 Entering ${env.name} - ${env.location}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="cyber-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl gradient-text">AR/VR Meditation Worlds</CardTitle>
            <CardDescription>10 real-world locations with healing frequencies</CardDescription>
          </div>
          <Badge className="neon-border px-3 py-1" style={{ backgroundColor: `${selectedEnv.color}20`, borderColor: selectedEnv.color }}>
            {selectedEnv.name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="environments" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="environments">🌍 Locations</TabsTrigger>
            <TabsTrigger value="session">🧘 Session</TabsTrigger>
          </TabsList>

          <TabsContent value="environments" className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {environments.map((env) => (
                <Button
                  key={env.id}
                  onClick={() => handleEnvChange(env)}
                  className={`h-24 flex flex-col gap-1 border-2 transition-all ${
                    selectedEnv.id === env.id
                      ? 'neon-border bg-primary/20 scale-105'
                      : 'border-muted bg-card hover:bg-muted/50 hover:scale-102'
                  }`}
                  variant="outline"
                >
                  <env.icon className="w-5 h-5" style={{ color: env.color }} />
                  <span className="text-xs font-bold">{env.name}</span>
                  <span className="text-[10px] text-muted-foreground">{env.location}</span>
                </Button>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-primary/20 space-y-2">
              <p className="text-sm font-medium text-primary">{selectedEnv.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>📍 {selectedEnv.location}</span>
                <span>🎵 {selectedEnv.frequency}Hz (Healing Frequency)</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="session" className="space-y-4">
            <canvas
              ref={canvasRef}
              className="w-full h-56 rounded-lg border-2 border-primary/30 bg-background/50 shadow-lg"
            />

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={toggleMusic}
                  size="lg"
                  className={`flex-1 ${isPlaying ? 'neon-border bg-primary/20 animate-neon-pulse' : ''}`}
                  variant={isPlaying ? 'default' : 'outline'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                  {isPlaying ? 'Pause' : 'Play'} {selectedEnv.frequency}Hz
                </Button>
                
                <Music className="w-6 h-6 text-primary animate-neon-pulse" />
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

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs text-muted-foreground">Session Time</p>
                  <p className="text-lg font-bold gradient-text">{formatTime(sessionTime)}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                  <p className="text-xs text-muted-foreground">Frequency</p>
                  <p className="text-lg font-bold text-secondary">{selectedEnv.frequency}Hz</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-xs font-bold text-accent truncate">{selectedEnv.location.split(',')[0]}</p>
                </div>
              </div>

              {isPlaying && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-center">
                  <p className="text-sm text-muted-foreground">🧘 Deep meditation in progress...</p>
                  <p className="text-xs text-muted-foreground mt-1">Let the healing frequency guide you</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};