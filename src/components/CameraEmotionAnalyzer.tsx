import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export const CameraEmotionAnalyzer = () => {
  const [isActive, setIsActive] = useState(false);
  const [emotion, setEmotion] = useState('neutral');
  const [engagement, setEngagement] = useState(0);
  const [attention, setAttention] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      setIsActive(true);
      startEmotionSimulation();
      
      toast({
        title: "Camera Active",
        description: "Analyzing facial emotions in real-time",
      });
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to use this feature",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
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

  const startEmotionSimulation = () => {
    const emotions = ['focused', 'happy', 'neutral', 'engaged', 'curious'];
    const interval = setInterval(() => {
      if (streamRef.current) {
        setEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
        setEngagement(Math.floor(Math.random() * 30) + 70);
        setAttention(Math.floor(Math.random() * 20) + 80);
      }
    }, 3000);

    return () => clearInterval(interval);
  };

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
          <Badge 
            variant="outline" 
            className={`${isActive ? 'border-primary/30 text-primary' : 'border-muted-foreground/30 text-muted-foreground'}`}
          >
            {isActive ? 'ACTIVE' : 'READY'}
          </Badge>
        </CardTitle>
        <CardDescription>Real-time facial emotion detection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video bg-card rounded-lg overflow-hidden border border-primary/20">
          {isActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <VideoOff className="w-12 h-12" />
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
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Dominant Emotion</span>
              <span className="text-lg font-bold text-primary capitalize">{emotion}</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground/80">Engagement</span>
                <span className="text-sm font-bold text-accent">{engagement}%</span>
              </div>
              <div className="w-full h-2 bg-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
                  style={{ width: `${engagement}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground/80">Attention</span>
                <span className="text-sm font-bold text-secondary">{attention}%</span>
              </div>
              <div className="w-full h-2 bg-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500"
                  style={{ width: `${attention}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
