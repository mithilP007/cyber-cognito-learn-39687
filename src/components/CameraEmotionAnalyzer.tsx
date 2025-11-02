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

// Emotion to background color mapping
const emotionColorMap: Record<string, string> = {
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

const getEmotionColor = (emotion: string): string => {
  const normalized = emotion.toLowerCase();
  return emotionColorMap[normalized] || '#4caf50'; // Default to green
};

export const CameraEmotionAnalyzer = ({ onEmotionChange }: CameraEmotionAnalyzerProps) => {
  const [isActive, setIsActive] = useState(false);
  const [emotion, setEmotion] = useState('neutral');
  const [engagement, setEngagement] = useState(0);
  const [attention, setAttention] = useState(0);
  const [useAI, setUseAI] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#4caf50');
  
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
    attention 
  });

  // Start camera with proper error handling
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play();
              resolve(true);
            };
          }
        });
      }
      
      setIsActive(true);
      toast({
        title: 'Camera Started',
        description: 'Webcam is now active and analyzing emotions.',
      });
      
      // Start emotion detection if AI is enabled
      if (useAI && modelsReady) {
        startEmotionDetection();
      }
    } catch (error) {
      console.error('Failed to start camera:', error);
      toast({
        title: 'Camera Error',
        description: 'Failed to access webcam. Please check permissions.',
        variant: 'destructive',
      });
    }
  };

  // Stop camera and clean up resources
  const stopCamera = () => {
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
    
    cancelSpeech();
    setIsActive(false);
    setEmotion('neutral');
    setEngagement(0);
    setAttention(0);
    setBackgroundColor('#4caf50');
    
    toast({
      title: 'Camera Stopped',
      description: 'Webcam has been turned off.',
    });
  };

  // Start continuous emotion detection
  const startEmotionDetection = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }

    // Analyze emotions every 1 second for real-time feedback
    analysisIntervalRef.current = window.setInterval(async () => {
      if (videoRef.current && canvasRef.current && modelsReady) {
        try {
          const result = await detectFacialEmotion(videoRef.current);
          
          if (result) {
            const detectedEmotion = result.emotion;
            const engagementScore = result.engagement;
            const attentionScore = result.attention;
            
            setEmotion(detectedEmotion);
            setEngagement(engagementScore);
            setAttention(attentionScore);
            
            // Update background color based on emotion
            const color = getEmotionColor(detectedEmotion);
            setBackgroundColor(color);
            
            // Call callback if provided
            if (onEmotionChange) {
              onEmotionChange(detectedEmotion, engagementScore, attentionScore);
            }
          }
        } catch (error) {
          console.error('Emotion detection error:', error);
        }
      }
    }, 1000); // Detect every second
  };

  // Toggle camera
  const toggleCamera = () => {
    if (isActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      cancelSpeech();
    };
  }, []);

  // Restart detection when AI toggle changes
  useEffect(() => {
    if (isActive && useAI && modelsReady) {
      startEmotionDetection();
    } else if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
  }, [useAI, modelsReady, isActive]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          Emotion & Engagement Analyzer
        </CardTitle>
        <CardDescription>
          Real-time facial emotion detection and engagement tracking using AI
          {isLoading && " (Loading AI models...)"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Feed Container */}
        <div 
          className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden"
          style={{
            backgroundColor: isActive ? backgroundColor : '#1f2937',
            transition: 'background-color 0.5s ease'
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ display: isActive ? 'block' : 'none' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ display: 'none' }}
          />
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <VideoOff className="h-16 w-16 text-gray-600" />
            </div>
          )}
        </div>

        {/* Emotion Display */}
        {isActive && (
          <div className="flex flex-wrap gap-2 items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Detected Emotion:</span>
              <Badge 
                variant="outline" 
                className="text-lg font-semibold"
                style={{ 
                  backgroundColor: backgroundColor + '40',
                  borderColor: backgroundColor,
                  color: '#000'
                }}
              >
                {emotion.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Engagement: {engagement}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Cpu className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Attention: {attention}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Color Legend */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium mb-2">Emotion Color Mapping:</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded" style={{ backgroundColor: '#ff4444', color: '#fff' }}>Sad/Depression: Red</span>
            <span className="px-2 py-1 rounded" style={{ backgroundColor: '#ffeb3b', color: '#000' }}>Happy: Yellow</span>
            <span className="px-2 py-1 rounded" style={{ backgroundColor: '#4caf50', color: '#fff' }}>Neutral/Focus: Green</span>
            <span className="px-2 py-1 rounded" style={{ backgroundColor: '#9c27b0', color: '#fff' }}>Anxious: Purple</span>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="ai-toggle" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              AI Emotion Detection
            </Label>
            <Switch
              id="ai-toggle"
              checked={useAI}
              onCheckedChange={setUseAI}
              disabled={!modelsReady || isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="speech-toggle" className="flex items-center gap-2">
              {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Voice Feedback
            </Label>
            <Switch
              id="speech-toggle"
              checked={speechEnabled}
              onCheckedChange={setSpeechEnabled}
            />
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={toggleCamera}
          disabled={isLoading}
          className="w-full"
          variant={isActive ? 'destructive' : 'default'}
        >
          {isActive ? (
            <>
              <VideoOff className="mr-2 h-4 w-4" />
              Stop Camera
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4" />
              {isLoading ? 'Loading AI Models...' : 'Start Camera'}
            </>
          )}
        </Button>

        {/* Status Messages */}
        {!modelsReady && !isLoading && (
          <p className="text-sm text-yellow-600 text-center">
            AI models not loaded. Emotion detection will be limited.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
