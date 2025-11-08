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
type EmotionType =
  | 'sad'
  | 'depression'
  | 'depressed'
  | 'happy'
  | 'neutral'
  | 'focus'
  | 'focused'
  | 'anxious'
  | 'anxiety'
  | 'angry'
  | 'surprised'
  | 'disgusted'
  | 'fearful';

type EmotionTheme = {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  border: string;
  ring: string;
  emotionColor: string;
};

const DEFAULT_THEME: EmotionTheme = {
  background: '220 25% 8%',
  foreground: '180 100% 95%',
  primary: '187 100% 50%',
  primaryForeground: '220 25% 8%',
  border: '187 100% 50%',
  ring: '187 100% 50%',
  emotionColor: '140 70% 60%',
};

const createTheme = (overrides: Partial<EmotionTheme>): EmotionTheme => ({
  ...DEFAULT_THEME,
  ...overrides,
});

const BASE_EMOTION_THEMES = {
  sad: createTheme({
    background: '220 45% 18%',
    foreground: '200 80% 92%',
    primary: '220 65% 55%',
    primaryForeground: '210 100% 98%',
    border: '220 55% 45%',
    ring: '220 75% 60%',
    emotionColor: '220 75% 60%',
  }),
  happy: createTheme({
    background: '50 100% 88%',
    foreground: '30 50% 15%',
    primary: '48 100% 55%',
    primaryForeground: '220 25% 8%',
    border: '48 100% 65%',
    ring: '48 100% 55%',
    emotionColor: '48 100% 55%',
  }),
  neutral: createTheme({
    background: '220 25% 10%',
    foreground: '180 50% 90%',
    primary: '187 100% 50%',
    primaryForeground: '220 25% 8%',
    border: '220 20% 35%',
    ring: '187 100% 50%',
    emotionColor: '187 100% 50%',
  }),
  focus: createTheme({
    background: '210 45% 16%',
    foreground: '160 30% 90%',
    primary: '160 70% 45%',
    primaryForeground: '220 25% 8%',
    border: '160 60% 40%',
    ring: '160 70% 45%',
    emotionColor: '160 70% 45%',
  }),
  anxious: createTheme({
    background: '275 35% 18%',
    foreground: '280 70% 92%',
    primary: '280 70% 55%',
    primaryForeground: '220 25% 8%',
    border: '280 55% 45%',
    ring: '280 70% 55%',
    emotionColor: '280 70% 55%',
  }),
  angry: createTheme({
    background: '5 65% 18%',
    foreground: '25 80% 95%',
    primary: '5 80% 55%',
    primaryForeground: '210 100% 98%',
    border: '5 70% 45%',
    ring: '5 80% 55%',
    emotionColor: '5 80% 55%',
  }),
  surprised: createTheme({
    background: '30 100% 85%',
    foreground: '24 60% 18%',
    primary: '30 100% 55%',
    primaryForeground: '220 25% 8%',
    border: '30 80% 50%',
    ring: '30 100% 55%',
    emotionColor: '30 100% 55%',
  }),
  disgusted: createTheme({
    background: '110 35% 22%',
    foreground: '100 40% 90%',
    primary: '110 55% 45%',
    primaryForeground: '220 25% 8%',
    border: '110 40% 40%',
    ring: '110 55% 45%',
    emotionColor: '110 55% 45%',
  }),
  fearful: createTheme({
    background: '260 40% 18%',
    foreground: '260 60% 92%',
    primary: '260 70% 55%',
    primaryForeground: '220 25% 8%',
    border: '260 55% 45%',
    ring: '260 70% 55%',
    emotionColor: '260 70% 55%',
  }),
} as const satisfies Record<string, EmotionTheme>;

const EMOTION_THEME_ALIASES: Record<string, EmotionTheme> = {
  sad: BASE_EMOTION_THEMES.sad,
  depression: BASE_EMOTION_THEMES.sad,
  depressed: BASE_EMOTION_THEMES.sad,
  happy: BASE_EMOTION_THEMES.happy,
  neutral: BASE_EMOTION_THEMES.neutral,
  focus: BASE_EMOTION_THEMES.focus,
  focused: BASE_EMOTION_THEMES.focus,
  anxious: BASE_EMOTION_THEMES.anxious,
  anxiety: BASE_EMOTION_THEMES.anxious,
  angry: BASE_EMOTION_THEMES.angry,
  surprised: BASE_EMOTION_THEMES.surprised,
  disgusted: BASE_EMOTION_THEMES.disgusted,
  fearful: BASE_EMOTION_THEMES.fearful,
};

// Constants for magic numbers
const ANALYSIS_INTERVAL_MS = 1000;

export const CameraEmotionAnalyzer = ({ onEmotionChange }: CameraEmotionAnalyzerProps) => {
  const [isActive, setIsActive] = useState(false);
  const [emotion, setEmotion] = useState('neutral');
  const [engagement, setEngagement] = useState(0);
  const [attention, setAttention] = useState(0);
  const [useAI, setUseAI] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [activeTheme, setActiveTheme] = useState<EmotionTheme>(DEFAULT_THEME);
  const [isMounted, setIsMounted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<number | null>(null);
  const defaultThemeVarsRef = useRef<Record<string, string> | null>(null);

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
      window.clearInterval(analysisIntervalRef.current);
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
      window.clearInterval(analysisIntervalRef.current);
    }

    analysisIntervalRef.current = window.setInterval(async () => {
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

      const result = await detectFacialEmotion(video);
      
      if (!isMounted) return;

      if (result) {
        const normalizedEmotion = result.emotion.toLowerCase();
        const theme = EMOTION_THEME_ALIASES[normalizedEmotion] ?? DEFAULT_THEME;

        setEmotion(result.emotion);
        setEngagement(result.engagement);
        setAttention(result.attention);
        setActiveTheme(theme);

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
      window.clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }

    return () => {
      if (analysisIntervalRef.current !== null) {
        window.clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
    };
  }, [isActive, useAI, modelsReady, startEmotionDetection]);

  // Effect: drive global background animation and theme variables
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const body = document.body;
    const cssVarKeys = [
      '--background',
      '--foreground',
      '--primary',
      '--primary-foreground',
      '--border',
      '--ring',
      '--emotion-color',
    ] as const;

    if (!defaultThemeVarsRef.current) {
      const computed = getComputedStyle(root);
      defaultThemeVarsRef.current = cssVarKeys.reduce<Record<string, string>>((acc, key) => {
        acc[key] = computed.getPropertyValue(key).trim();
        return acc;
      }, {});
    }

    const applyTheme = (theme: EmotionTheme) => {
      root.style.setProperty('--background', theme.background);
      root.style.setProperty('--foreground', theme.foreground);
      root.style.setProperty('--primary', theme.primary);
      root.style.setProperty('--primary-foreground', theme.primaryForeground);
      root.style.setProperty('--border', theme.border);
      root.style.setProperty('--ring', theme.ring);
      root.style.setProperty('--emotion-color', theme.emotionColor);
    };

    const resetTheme = () => {
      if (!defaultThemeVarsRef.current) return;
      cssVarKeys.forEach(key => {
        const value = defaultThemeVarsRef.current?.[key];
        if (value) {
          root.style.setProperty(key, value);
        } else {
          root.style.removeProperty(key);
        }
      });
    };

    if (isActive) {
      body.classList.add('emotion-bg-active');
      applyTheme(activeTheme);
    } else {
      body.classList.remove('emotion-bg-active');
      resetTheme();
    }

    return () => {
      body.classList.remove('emotion-bg-active');
      resetTheme();
    };
  }, [activeTheme, isActive]);

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

    </div>
  );
};
