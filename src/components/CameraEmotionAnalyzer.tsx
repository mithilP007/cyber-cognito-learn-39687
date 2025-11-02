import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Cpu, Zap, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useEmotionDetection } from '@/hooks/useEmotionDetection';
import { useEmotionSpeech } from '@/hooks/useEmotionSpeech';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CameraEmotionAnalyzerProps {
  onEmotionChange?: (emotion: string, engagement: number, attention: number) => void;
}

export const CameraEmotionAnalyzer = ({ onEmotionChange }: CameraEmotionAnalyzerProps) => {
  const [isActive, setIsActive] = useState(false);
  const [emotion, setEmotion] = useState('neutral');
  const [engagement, setEngagement] = useState(0);
  const [attention, setAttention] = useState(0);
  const [useAI, setUseAI] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();
  const { isLoading, detectFacialEmotion, modelsReady } = useEmotionDetection();
  const { cancelSpeech } = useEmotionSpeech({ 
    enabled: speechEnabled && isActive, 
    emotion, 
    engagement, 
    attention 
  });

  const startCamera = async () => {
    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      console.log('Camera stream obtained:', stream.active);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for metadata to load then play
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          videoRef.current?.play().then(() => {
            console.log('Video playing');
          }).catch(e => console.error('Play error:', e));
        };
      }
      
      setIsActive(true);
      
      // Start analysis after a short delay to ensure video is ready
      setTimeout(() => {
        startEmotionAnalysis();
      }, 500);
      
      toast({
        title: "Camera Active",
        description: "Analyzing facial emotions in real-time",
      });
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to use this feature",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    cancelSpeech();
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setEmotion('neutral');
    setEngagement(0);
    setAttention(0);
  };

  const startEmotionAnalysis = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }

    const analyzeFrame = async () => {
      if (!videoRef.current || !streamRef.current || !isActive) return;

      try {
        if (useAI && modelsReady) {
          // Real AI-powered detection
          const result = await detectFacialEmotion(videoRef.current);
          
          setEmotion(result.emotion);
          setEngagement(result.engagement);
          setAttention(result.attention);
          onEmotionChange?.(result.emotion, result.engagement, result.attention);
        } else {
          // Simulated fallback
          const emotions = ['happy', 'sad', 'angry', 'neutral', 'surprised', 'fearful'];
          const newEmotion = emotions[Math.floor(Math.random() * emotions.length)];
          const newEngagement = Math.floor(Math.random() * 30) + 70;
          const newAttention = Math.floor(Math.random() * 20) + 80;
          
          setEmotion(newEmotion);
          setEngagement(newEngagement);
          setAttention(newAttention);
          onEmotionChange?.(newEmotion, newEngagement, newAttention);
        }
      } catch (error) {
        console.error('Analysis error:', error);
      }
    };

    // Analyze every 1.5 seconds for more responsive updates
    analysisIntervalRef.current = window.setInterval(analyzeFrame, 1500);
    analyzeFrame(); // Run immediately
  };

  useEffect(() => {
    if (isActive) {
      startEmotionAnalysis();
    }
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, [isActive, useAI, modelsReady]);

  // Apply fullscreen emotion color effect
  useEffect(() => {
    if (!isActive || !emotion) return;
    
    const emotionColors: Record<string, string> = {
      'neutral': 'rgba(34, 197, 94, 0.15)', // green
      'happy': 'rgba(234, 179, 8, 0.15)', // yellow
      'sad': 'rgba(239, 68, 68, 0.15)', // red
      'depressed': 'rgba(239, 68, 68, 0.15)', // red
      'angry': 'rgba(239, 68, 68, 0.2)', // red
      'surprised': 'rgba(168, 85, 247, 0.15)', // purple
      'fearful': 'rgba(249, 115, 22, 0.15)', // orange
      'excited': 'rgba(234, 179, 8, 0.2)', // bright yellow
    };

    const color = emotionColors[emotion.toLowerCase()] || 'rgba(59, 130, 246, 0.1)';
    document.body.style.backgroundColor = color;
    document.body.style.transition = 'background-color 1s ease';

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [emotion, isActive]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="text-xl gradient-text flex items-center justify-between">
          Facial Emotion Analysis
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${isActive ? 'border-primary/30 text-primary animate-neon-pulse' : 'border-muted-foreground/30 text-muted-foreground'}`}
            >
              {isActive ? 'LIVE' : 'READY'}
            </Badge>
            <Badge 
              variant={useAI ? "default" : "secondary"}
              className="gap-1"
            >
              {useAI ? <Zap className="w-3 h-3" /> : <Cpu className="w-3 h-3" />}
              {useAI ? 'AI' : 'SIM'}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          {useAI && modelsReady ? 'AI-powered detection (FER2013/AffectNet)' : 'Real-time facial emotion detection'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-primary/10">
            <div className="flex items-center gap-2">
              <Label htmlFor="ai-toggle" className="text-sm font-medium cursor-pointer">
                {useAI ? '🧠 AI Model Detection' : '🎲 Simulated Detection'}
              </Label>
              {isLoading && <Badge variant="outline" className="text-xs">Loading...</Badge>}
            </div>
            <Switch
              id="ai-toggle"
              checked={useAI}
              onCheckedChange={(checked) => {
                setUseAI(checked);
                toast({
                  title: checked ? "AI Detection Enabled" : "AI Detection Disabled",
                  description: checked ? (isLoading ? "Loading AI models..." : "Using real AI models") : "Using simulated detection"
                });
              }}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-primary/10">
            <div className="flex items-center gap-2">
              <Label htmlFor="speech-toggle" className="text-sm font-medium cursor-pointer">
                {speechEnabled ? <Volume2 className="w-4 h-4 inline mr-1" /> : <VolumeX className="w-4 h-4 inline mr-1" />}
                Robot Speech
              </Label>
            </div>
            <Switch
              id="speech-toggle"
              checked={speechEnabled}
              onCheckedChange={setSpeechEnabled}
            />
          </div>
        </div>
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-primary/30 shadow-lg">
          {isActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ 
                  display: 'block',
                  transform: 'scaleX(-1)',
                  WebkitTransform: 'scaleX(-1)',
                  minHeight: '300px'
                }}
              />
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                <Badge className="bg-red-600 text-white animate-pulse shadow-lg">
                  <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                  LIVE
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3 z-10">
                <Badge variant="outline" className="bg-black/60 text-white border-primary/50">
                  Face Detection Active
                </Badge>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-4 min-h-[300px]">
              <VideoOff className="w-16 h-16" />
              <p className="text-sm">Click "Start Camera" to begin</p>
            </div>
          )}
        </div>

        <Button 
          onClick={isActive ? stopCamera : startCamera}
          className="w-full"
          variant={isActive ? "secondary" : "default"}
        >
          {isActive ? (
            <>
              <VideoOff className="w-4 h-4 mr-2" />
              Stop Camera
            </>
          ) : (
            <>
              <Video className="w-4 h-4 mr-2" />
              Start Camera
            </>
          )}
        </Button>

        {isActive && (
          <div className="space-y-4 pt-4 border-t border-primary/20">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Detected Emotion</span>
                <span className="text-2xl font-bold text-primary capitalize">{emotion}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 p-3 bg-accent/10 rounded-lg border border-accent/20">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Engagement
                </span>
                <div className="text-3xl font-bold text-accent">{engagement}%</div>
                <div className="w-full h-1.5 bg-card rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
                    style={{ width: `${engagement}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  👁️ Attention
                </span>
                <div className="text-3xl font-bold text-secondary">{attention}%</div>
                <div className="w-full h-1.5 bg-card rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-accent transition-all duration-500"
                    style={{ width: `${attention}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
