import { useState, useRef, useEffect, useCallback } from 'react';
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

// Emotion types for type safety
type EmotionType = 'sad' | 'depression' | 'depressed' | 'happy' | 'neutral' | 'focus' | 'focused' | 'anxious' | 'anxiety' | 'angry' | 'surprised' | 'disgusted' | 'fearful';

// Emotion to background color mapping with proper typing
const emotionColorMap: Record<EmotionType, string> = {
  sad: '#ff4444',
  depression: '#ff4444',
  depressed: '#ff4444',
  happy: '#ffeb3b',
  neutral: '#4caf50',
  focus: '#4caf50',
  focused: '#4caf50',
  anxious: '#9c27b0',
  anxiety: '#9c27b0',
  angry: '#ff6b6b',
  surprised: '#ffa726',
  disgusted: '#8d6e63',
  fearful: '#9c27b0',
};

// Constants for magic numbers
const ANALYSIS_INTERVAL_MS = 1000;
const DEFAULT_COLOR = '#4caf50';

const getEmotionColor = (emotion: string): string => {
  const normalized = emotion.toLowerCase() as EmotionType;
  return emotionColorMap[normalized] || DEFAULT_COLOR;
};

export const CameraEmotionAnalyzer = ({ onEmotionChange }: CameraEmotionAnalyzerProps) => {
  const [isActive, setIsActive] = useState(false);
  const [emotion, setEmotion] = useState('neutral');
  const [engagement, setEngagement] = useState(0);
  const [attention, setAttention] = useState(0);
  const [useAI, setUseAI] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_COLOR);
  const [isMounted, setIsMounted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<number | null>(null);

  const { toast } = useToast();
  const { isLoading, detectFacialEmotion, modelsReady } = useEmotionDetection();
  const { cancelSpeech } = useEmotionSpeech({
    enabled: speechEnabled && isActive,
    emotion,
    engagement,
    attention,
  });

  // Component mount tracking
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Start camera function
  const startCamera = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      });
      
      if (!isMounted) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      await videoRef.current.play();

      toast({
        title: 'Camera started',
        description: 'Emotion analysis is now active.',
      });
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: 'Camera access denied',
        description: 'Please allow camera permissions to use this feature.',
        variant: 'destructive',
      });
      setIsActive(false);
    }
  }, [toast, isMounted]);

  // Stop camera function
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (analysisIntervalRef.current !== null) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
  }, []);

  // Analyze emotions function with proper checks
  const startEmotionDetection = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !useAI || !modelsReady) {
      return;
    }

    // Clear any existing interval
    if (analysisIntervalRef.current !== null) {
      clearInterval(analysisIntervalRef.current);
    }

    analysisIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current || !isMounted || !isActive) {
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const result = await detectFacialEmotion(canvas);
      
      if (!isMounted) return;

      if (result) {
        setEmotion(result.emotion);
        setEngagement(result.engagement);
        setAttention(result.attention);
        setBackgroundColor(getEmotionColor(result.emotion));

        onEmotionChange?.(result.emotion, result.engagement, result.attention);
      }
    }, ANALYSIS_INTERVAL_MS);
  }, [useAI, modelsReady, detectFacialEmotion, onEmotionChange, isMounted, isActive]);

  // Toggle camera with proper cleanup
  const toggleCamera = useCallback(async () => {
    if (isActive) {
      stopCamera();
      setIsActive(false);
      toast({
        title: 'Camera stopped',
        description: 'Emotion analysis has been disabled.',
      });
    } else {
      setIsActive(true);
      await startCamera();
    }
  }, [isActive, startCamera, stopCamera, toast]);

  // Effect: Start/stop emotion detection based on camera and AI settings
  useEffect(() => {
    if (isActive && useAI && modelsReady) {
      startEmotionDetection();
    } else if (analysisIntervalRef.current !== null) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }

    return () => {
      if (analysisIntervalRef.current !== null) {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
    };
  }, [isActive, useAI, modelsReady, startEmotionDetection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      cancelSpeech();
    };
  }, [stopCamera, cancelSpeech]);

  return (
    <div className="relative">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" aria-hidden="true" />
            Camera Emotion Analyzer
          </CardTitle>
          <CardDescription>
            Real-time facial emotion detection and engagement tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Video Display */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
              aria-label="Live camera feed for emotion detection"
            />
            <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
            
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                <p className="text-muted-foreground" role="status">
                  Camera is off
                </p>
              </div>
            )}
          </div>

          {/* Emotion Stats */}
          {isActive && (
            <div className="grid grid-cols-3 gap-4" role="region" aria-label="Emotion statistics">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Emotion</p>
                <Badge variant="secondary" className="mt-1">
                  {emotion}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Engagement</p>
                <p className="text-lg font-semibold">{engagement}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Attention</p>
                <p className="text-lg font-semibold">{attention}%</p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ai-toggle" className="flex items-center gap-2">
                {useAI ? <Cpu className="h-4 w-4" aria-hidden="true" /> : <Zap className="h-4 w-4" aria-hidden="true" />}
                AI-Powered Detection
              </Label>
              <Switch
                id="ai-toggle"
                checked={useAI}
                onCheckedChange={setUseAI}
                disabled={isActive}
                aria-describedby="ai-toggle-description"
              />
            </div>
            <p id="ai-toggle-description" className="sr-only">
              Enable or disable AI-powered emotion detection
            </p>

            <div className="flex items-center justify-between">
              <Label htmlFor="speech-toggle" className="flex items-center gap-2">
                {speechEnabled ? <Volume2 className="h-4 w-4" aria-hidden="true" /> : <VolumeX className="h-4 w-4" aria-hidden="true" />}
                Voice Feedback
              </Label>
              <Switch
                id="speech-toggle"
                checked={speechEnabled}
                onCheckedChange={setSpeechEnabled}
                aria-describedby="speech-toggle-description"
              />
            </div>
            <p id="speech-toggle-description" className="sr-only">
              Enable or disable voice feedback for emotions
            </p>
          </div>

          {/* Action Button */}
          <Button
            onClick={toggleCamera}
            disabled={isLoading}
            className="w-full"
            variant={isActive ? 'destructive' : 'default'}
            aria-label={isActive ? 'Stop camera' : 'Start camera'}
          >
            {isActive ? (
              <>
                <VideoOff className="mr-2 h-4 w-4" aria-hidden="true" /> Stop Camera
              </>
            ) : (
              <>
                <Video className="mr-2 h-4 w-4" aria-hidden="true" />
                {isLoading ? 'Loading AI Models...' : 'Start Camera'}
              </>
            )}
          </Button>

          {/* Status Messages */}
          {!modelsReady && !isLoading && (
            <p className="text-sm text-yellow-600 text-center" role="alert">
              AI models not loaded. Emotion detection will be limited.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Optional: overlay glow around whole screen */}
      {isActive && (
        <div
          style={{
            pointerEvents: 'none',
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 0,
            background: `radial-gradient(circle at center, ${backgroundColor}33 30%, transparent 85%)`,
            transition: 'background 0.5s',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
