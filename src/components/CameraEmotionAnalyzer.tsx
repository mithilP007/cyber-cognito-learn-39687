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
import emotionThemeConfigJson from '@/config/emotionThemes.json';

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

type EmotionThemeOverrides = Partial<EmotionTheme>;
type EmotionThemeOverridesInput = EmotionThemeOverrides | string;

type BaseEmotionKey =
  | 'sad'
  | 'happy'
  | 'neutral'
  | 'focus'
  | 'anxious'
  | 'angry'
  | 'surprised'
  | 'disgusted'
  | 'fearful';

type EmotionThemeConfig = {
  defaultTheme?: EmotionThemeOverridesInput;
  emotions?: Partial<Record<BaseEmotionKey, EmotionThemeOverridesInput>>;
  aliases?: Record<string, BaseEmotionKey>;
};

const emotionThemeConfig = emotionThemeConfigJson as EmotionThemeConfig;
const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

const hexToHslTriplet = (hex: string): string | null => {
  if (!HEX_COLOR_REGEX.test(hex)) return null;

  const normalized =
    hex.length === 4
      ? `#${hex
          .slice(1)
          .split('')
          .map(char => char + char)
          .join('')}`
      : hex.toUpperCase();

  const r = parseInt(normalized.slice(1, 3), 16) / 255;
  const g = parseInt(normalized.slice(3, 5), 16) / 255;
  const b = parseInt(normalized.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
      default:
        break;
    }

    h *= 60;
  }

  const hue = Math.round((h + 360) % 360);
  const saturation = Math.round(s * 100);
  const lightness = Math.round(l * 100);

  return `${hue} ${saturation}% ${lightness}%`;
};

const stripHslWrapper = (value: string): string => {
  const trimmed = value.trim();
  if (trimmed.toLowerCase().startsWith('hsl(') && trimmed.endsWith(')')) {
    return trimmed.slice(4, -1).trim();
  }
  return trimmed;
};

const normalizeColorValue = (value: string | undefined, fallback: string): string => {
  if (!value?.trim()) {
    return fallback;
  }

  const trimmed = value.trim();

  if (HEX_COLOR_REGEX.test(trimmed)) {
    const converted = hexToHslTriplet(trimmed);
    return converted ?? fallback;
  }

  if (/^hsl\(/i.test(trimmed)) {
    return stripHslWrapper(trimmed);
  }

  return trimmed;
};

const resolveThemeOverrides = (
  input?: EmotionThemeOverridesInput,
): EmotionThemeOverrides | undefined => {
  if (!input) return undefined;

  if (typeof input === 'string') {
    const accent = input;
    return {
      primary: accent,
      border: accent,
      ring: accent,
      emotionColor: accent,
    };
  }

  return input;
};

const DEFAULT_THEME_BASE: EmotionTheme = {
  background: '220 25% 8%',
  foreground: '180 100% 95%',
  primary: '187 100% 50%',
  primaryForeground: '220 25% 8%',
  border: '187 100% 50%',
  ring: '187 100% 50%',
  emotionColor: '140 70% 60%',
};

const defaultThemeOverrides = resolveThemeOverrides(emotionThemeConfig.defaultTheme);

const buildTheme = (overridesInput?: EmotionThemeOverridesInput): EmotionTheme => {
  const overrides = resolveThemeOverrides(overridesInput);
  const merged = {
    ...DEFAULT_THEME_BASE,
    ...(defaultThemeOverrides ?? {}),
    ...(overrides ?? {}),
  };

  return {
    background: normalizeColorValue(merged.background, DEFAULT_THEME_BASE.background),
    foreground: normalizeColorValue(merged.foreground, DEFAULT_THEME_BASE.foreground),
    primary: normalizeColorValue(merged.primary, DEFAULT_THEME_BASE.primary),
    primaryForeground: normalizeColorValue(
      merged.primaryForeground,
      DEFAULT_THEME_BASE.primaryForeground,
    ),
    border: normalizeColorValue(merged.border, DEFAULT_THEME_BASE.border),
    ring: normalizeColorValue(merged.ring, DEFAULT_THEME_BASE.ring),
    emotionColor: normalizeColorValue(merged.emotionColor, DEFAULT_THEME_BASE.emotionColor),
  };
};

const DEFAULT_THEME: EmotionTheme = buildTheme();

const emotionThemeOverrides = emotionThemeConfig.emotions ?? {};

const BASE_EMOTION_THEMES = {
  sad: buildTheme(emotionThemeOverrides.sad),
  happy: buildTheme(emotionThemeOverrides.happy),
  neutral: buildTheme(emotionThemeOverrides.neutral),
  focus: buildTheme(emotionThemeOverrides.focus),
  anxious: buildTheme(emotionThemeOverrides.anxious),
  angry: buildTheme(emotionThemeOverrides.angry),
  surprised: buildTheme(emotionThemeOverrides.surprised),
  disgusted: buildTheme(emotionThemeOverrides.disgusted),
  fearful: buildTheme(emotionThemeOverrides.fearful),
} satisfies Record<BaseEmotionKey, EmotionTheme>;

const EMOTION_THEME_ALIASES: Record<string, EmotionTheme> = {
  ...BASE_EMOTION_THEMES,
  ...Object.fromEntries(
    Object.entries(emotionThemeConfig.aliases ?? {}).map(([alias, target]) => [
      alias,
      BASE_EMOTION_THEMES[target as BaseEmotionKey] ?? DEFAULT_THEME,
    ]),
  ),
};

const DEFAULT_MANUAL_EMOTION: keyof typeof BASE_EMOTION_THEMES = 'neutral';

const MANUAL_TESTER_OPTIONS: Array<{ key: keyof typeof BASE_EMOTION_THEMES; label: string }> = [
  { key: 'happy', label: 'Happy' },
  { key: 'neutral', label: 'Neutral' },
  { key: 'focus', label: 'Focused' },
  { key: 'sad', label: 'Sad' },
  { key: 'anxious', label: 'Anxious' },
  { key: 'angry', label: 'Angry' },
  { key: 'surprised', label: 'Surprised' },
  { key: 'disgusted', label: 'Disgusted' },
  { key: 'fearful', label: 'Fearful' },
];

const PREVIEW_EMOTIONS: EmotionType[] = [
  'neutral',
  'happy',
  'sad',
  'focus',
  'anxious',
  'angry',
  'surprised',
  'disgusted',
  'fearful',
];

// Constants for magic numbers
const ANALYSIS_INTERVAL_MS = 1000;

export const CameraEmotionAnalyzer = ({ onEmotionChange }: CameraEmotionAnalyzerProps) => {
  const [isActive, setIsActive] = useState(false);
  const [emotion, setEmotion] = useState('neutral');
  const [engagement, setEngagement] = useState(0);
  const [attention, setAttention] = useState(0);
  const [useAI, setUseAI] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [manualMode, setManualMode] = useState(false);
  const [manualEmotion, setManualEmotion] = useState<keyof typeof BASE_EMOTION_THEMES | null>(null);
  const [activeTheme, setActiveTheme] = useState<EmotionTheme>(DEFAULT_THEME);
  const [isMounted, setIsMounted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<number | null>(null);
  const defaultThemeVarsRef = useRef<Record<string, string> | null>(null);
  const isStartingRef = useRef(false);
  const isMountedRef = useRef(true);

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

  // Monitor video stream health
  useEffect(() => {
    if (!isActive || !streamRef.current) return;

    let restartAttempted = false;

    const checkStreamHealth = () => {
      if (!streamRef.current || !isMountedRef.current || !isActive) return;
      
      const activeTracks = streamRef.current.getTracks().filter(track => track.readyState === 'live');
      if (activeTracks.length === 0 && videoRef.current && !restartAttempted) {
        console.warn('All stream tracks ended unexpectedly');
        restartAttempted = true;
        // Don't auto-restart, just log the issue
        // User can manually restart if needed
      }
    };

    const healthCheckInterval = setInterval(checkStreamHealth, 2000);
    return () => {
      clearInterval(healthCheckInterval);
      restartAttempted = false;
    };
  }, [isActive]);

  // Start camera function
  const startCamera = useCallback(async () => {
    // Prevent multiple simultaneous starts
    if (isStartingRef.current) {
      console.log('Camera start already in progress');
      return;
    }

    if (!videoRef.current) {
      console.warn('Video ref not available');
      setIsActive(false);
      return;
    }

    // If we already have an active stream, don't restart
    if (streamRef.current) {
      const activeTracks = streamRef.current.getTracks().filter(track => track.readyState === 'live');
      if (activeTracks.length > 0) {
        console.log('Stream already active, reusing existing stream');
        // Make sure video element has the stream
        if (videoRef.current.srcObject !== streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.play().catch(err => {
            console.warn('Failed to play existing stream:', err);
          });
        }
        isStartingRef.current = false;
        return;
      }
    }

    isStartingRef.current = true;

    // Stop any existing stream first
    if (streamRef.current) {
      console.log('Stopping existing stream');
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
      streamRef.current = null;
    }

    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user', 
          width: { ideal: 640 }, 
          height: { ideal: 480 } 
        },
      });
      
      console.log('Camera access granted, stream obtained');
      
      // Note: We continue even if component appears unmounted during React StrictMode remounts.
      // The stream will be properly cleaned up on actual unmount.

      const video = videoRef.current;
      
      // Double-check video ref is still valid
      if (!video) {
        console.warn('Video element no longer available');
        stream.getTracks().forEach(track => track.stop());
        isStartingRef.current = false;
        setIsActive(false);
        return;
      }
      
      // Store stream reference BEFORE setting srcObject
      streamRef.current = stream;
      
      // Set the stream to the video element
      console.log('Setting stream to video element');
      video.srcObject = stream;

      // Wait for the video to be ready before playing
      console.log('Waiting for video metadata...');
      await new Promise<void>((resolve, reject) => {
        // Check if already ready
        if (video.readyState >= 2) {
          console.log('Video already ready');
          resolve();
          return;
        }

        let resolved = false;
        const cleanup = () => {
          if (resolved) return;
          video.removeEventListener('loadedmetadata', handleLoadedMetadata);
          video.removeEventListener('loadeddata', handleLoadedData);
          video.removeEventListener('canplay', handleCanPlay);
          video.removeEventListener('error', handleError);
        };

        const handleLoadedMetadata = () => {
          if (resolved) return;
          console.log('Video metadata loaded');
          resolved = true;
          cleanup();
          resolve();
        };

        const handleLoadedData = () => {
          if (resolved) return;
          console.log('Video data loaded');
          resolved = true;
          cleanup();
          resolve();
        };

        const handleCanPlay = () => {
          if (resolved) return;
          console.log('Video can play');
          resolved = true;
          cleanup();
          resolve();
        };

        const handleError = (err: Event) => {
          if (resolved) return;
          console.error('Video element error:', err);
          resolved = true;
          cleanup();
          reject(err);
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
        video.addEventListener('loadeddata', handleLoadedData, { once: true });
        video.addEventListener('canplay', handleCanPlay, { once: true });
        video.addEventListener('error', handleError, { once: true });

        // Timeout after 5 seconds
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            cleanup();
            if (video.readyState >= 2) {
              console.log('Video ready (timeout check)');
              resolve();
            } else {
              console.error('Video metadata loading timeout, readyState:', video.readyState);
              reject(new Error('Video metadata loading timeout'));
            }
          }
        }, 5000);
      });

      // Final check before playing - ensure stream is still set
      if (!streamRef.current || streamRef.current !== stream) {
        console.warn('Stream reference lost during initialization, aborting play', {
          hasStream: !!streamRef.current,
          streamMatch: streamRef.current === stream,
        });
        // Don't stop the stream here - it might be valid, just the ref was cleared
        // The cleanup will handle it if component is actually unmounting
        isStartingRef.current = false;
        setIsActive(false);
        return;
      }

      // Ensure video dimensions are set
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.warn('Video dimensions are 0, waiting...');
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Now play the video
      console.log('Attempting to play video...');
      try {
        await video.play();
        console.log('Video playing successfully');
      } catch (playError) {
        console.error('Video play error:', playError);
        // Try to play again after a short delay
        setTimeout(async () => {
          if (video && streamRef.current && isMountedRef.current) {
            try {
              await video.play();
              console.log('Video play succeeded on retry');
            } catch (retryError) {
              console.error('Video play retry failed:', retryError);
            }
          }
        }, 100);
      }

      // Verify stream tracks are active
      const activeTracks = stream.getTracks().filter(track => track.readyState === 'live');
      console.log(`Stream status: ${activeTracks.length} active track(s) out of ${stream.getTracks().length} total`);
      
      if (activeTracks.length === 0) {
        console.error('No active tracks after setup!');
        toast({
          title: 'Camera Error',
          description: 'Camera stream ended unexpectedly. Please try again.',
          variant: 'destructive',
        });
        setIsActive(false);
        isStartingRef.current = false;
        return;
      }

      // Monitor tracks for unexpected stops
      stream.getTracks().forEach(track => {
        track.addEventListener('ended', () => {
          console.warn(`Track ended: ${track.kind}, readyState: ${track.readyState}`);
          if (isMountedRef.current && streamRef.current === stream) {
            toast({
              title: 'Camera Disconnected',
              description: 'Camera stream ended unexpectedly.',
              variant: 'destructive',
            });
            setIsActive(false);
          }
        });
      });

      isStartingRef.current = false;

      toast({
        title: 'Camera started',
        description: 'Emotion analysis is now active.',
      });
    } catch (error) {
      console.error('Camera error:', error);
      isStartingRef.current = false;
      
      // Clean up stream on error
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Please allow camera permissions to use this feature.';
      toast({
        title: 'Camera access denied',
        description: errorMessage,
        variant: 'destructive',
      });
      setIsActive(false);
    }
  }, [toast, isMounted]);

  // Stop camera function
  const stopCamera = useCallback(() => {
    console.log('Stopping camera...');
    isStartingRef.current = false;
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }
    if (analysisIntervalRef.current !== null) {
      window.clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    console.log('Camera stopped');
  }, []);

  const applyManualEmotion = useCallback((emotionKey: keyof typeof BASE_EMOTION_THEMES) => {
    const theme = BASE_EMOTION_THEMES[emotionKey];
    setManualMode(true);
    setManualEmotion(emotionKey);
    setActiveTheme(theme);
    setEmotion(emotionKey);
  }, []);

  const deactivateManualTester = useCallback(() => {
    setManualMode(false);
    setManualEmotion(null);
    setActiveTheme(DEFAULT_THEME);
    setEmotion('neutral');
  }, []);

  const toggleManualTester = useCallback(() => {
    if (manualMode) {
      deactivateManualTester();
      return;
    }

    const initialEmotion = manualEmotion ?? DEFAULT_MANUAL_EMOTION;
    applyManualEmotion(initialEmotion);
  }, [manualMode, manualEmotion, deactivateManualTester, applyManualEmotion]);

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
      if (!videoRef.current || !canvasRef.current || !isMountedRef.current || !isActive) {
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
      
      if (!isMountedRef.current) return;

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
      // Set active state first, then start camera
      setIsActive(true);
      // Small delay to ensure state is set
      await new Promise(resolve => setTimeout(resolve, 10));
      await startCamera();
      // If startCamera fails, it will set isActive to false
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

    if (manualMode || isActive) {
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
  }, [activeTheme, isActive, manualMode]);

  // Cleanup on unmount - only run once when component actually unmounts
  useEffect(() => {
    return () => {
      console.log('Component unmounting, cleaning up...', {
        hasStream: !!streamRef.current,
        activeTracks: streamRef.current?.getTracks().filter(t => t.readyState === 'live').length || 0,
      });
      isMountedRef.current = false;
      setIsMounted(false);
      
      // Only stop camera if we actually have a stream
      // This prevents stopping during React StrictMode double-mount in development
      if (streamRef.current) {
        const activeTracks = streamRef.current.getTracks().filter(t => t.readyState === 'live');
        if (activeTracks.length > 0) {
          console.log('Stopping camera on unmount');
          stopCamera();
        }
      }
      
      cancelSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run on mount/unmount

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
              preload="auto"
              style={{ minWidth: '100%', minHeight: '100%' }}
              aria-label="Live camera feed for emotion detection"
              onLoadedMetadata={() => {
                console.log('Video metadata loaded in onLoadedMetadata handler', {
                  videoWidth: videoRef.current?.videoWidth,
                  videoHeight: videoRef.current?.videoHeight,
                  readyState: videoRef.current?.readyState,
                });
                // Ensure video plays when metadata is loaded
                if (videoRef.current && streamRef.current && isActive) {
                  videoRef.current.play().catch(err => {
                    console.warn('Video autoplay failed in handler:', err);
                  });
                }
              }}
              onCanPlay={() => {
                console.log('Video can play in onCanPlay handler');
                if (videoRef.current && streamRef.current && isActive) {
                  videoRef.current.play().catch(err => {
                    console.warn('Video play failed in canplay handler:', err);
                  });
                }
              }}
              onPlay={() => {
                console.log('Video started playing', {
                  paused: videoRef.current?.paused,
                  ended: videoRef.current?.ended,
                  videoWidth: videoRef.current?.videoWidth,
                  videoHeight: videoRef.current?.videoHeight,
                });
              }}
              onPause={() => {
                console.log('Video paused', {
                  paused: videoRef.current?.paused,
                  ended: videoRef.current?.ended,
                });
              }}
              onError={(e) => {
                console.error('Video element error:', e, {
                  error: videoRef.current?.error,
                  networkState: videoRef.current?.networkState,
                  readyState: videoRef.current?.readyState,
                });
              }}
            />
            <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
            
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
                <p className="text-muted-foreground" role="status">
                  Camera is off
                </p>
              </div>
            )}
            
            {isActive && streamRef.current && (
              <div className="absolute top-2 right-2 z-10">
                <Badge variant="secondary" className="bg-green-500/80">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1" />
                  Live
                </Badge>
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

            <div className="pt-2">
              <Button
                type="button"
                variant={manualMode ? 'secondary' : 'outline'}
                onClick={toggleManualTester}
                className="w-full"
              >
                {manualMode ? 'Disable Emotion Tester' : 'Enable Emotion Tester'}
              </Button>
            </div>
          </div>
 
          {manualMode && (
            <div className="space-y-3 rounded-lg border border-primary/40 bg-background/80 p-4 shadow-inner backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Emotion Tester</h4>
                  <p className="text-xs text-muted-foreground">Pick an emotion to preview the animated theme.</p>
                </div>
                <Button type="button" size="sm" variant="ghost" onClick={deactivateManualTester}>
                  Exit tester
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {MANUAL_TESTER_OPTIONS.map(option => (
                  <Button
                    key={option.key}
                    type="button"
                    variant={manualEmotion === option.key ? 'default' : 'outline'}
                    onClick={() => applyManualEmotion(option.key)}
                    className="px-3"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

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
