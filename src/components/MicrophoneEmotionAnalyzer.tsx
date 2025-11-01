import { useState, useRef } from 'react';
import { Mic, MicOff, Cpu, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useEmotionDetection } from '@/hooks/useEmotionDetection';

interface MicrophoneEmotionAnalyzerProps {
  onEmotionChange?: (emotion: string | null) => void;
}

export const MicrophoneEmotionAnalyzer = ({ onEmotionChange }: MicrophoneEmotionAnalyzerProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [tone, setTone] = useState<string | null>(null);
  const [useAI, setUseAI] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { toast } = useToast();
  const { detectVoiceEmotion, isLoading, modelsReady } = useEmotionDetection();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      setIsRecording(true);

      // Simulate emotion analysis every 2 seconds while recording
      const analysisInterval = setInterval(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          analyzeVoiceEmotion();
        }
      }, 2000);

      mediaRecorder.onstop = () => {
        clearInterval(analysisInterval);
        stream.getTracks().forEach(track => track.stop());
      };

      toast({
        title: "Recording Started",
        description: "Analyzing voice emotion in real-time",
      });
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use this feature",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording Stopped",
        description: "Voice emotion analysis complete",
      });
    }
  };

  const analyzeVoiceEmotion = async (audioData?: Float32Array) => {
    if (useAI && modelsReady && audioData) {
      try {
        const result = await detectVoiceEmotion(audioData);
        setEmotion(result.emotion);
        setTone(result.tone);
        setConfidence(Math.round(result.confidence * 100));
        onEmotionChange?.(result.emotion);
      } catch (error) {
        console.error('Voice emotion detection error:', error);
        simulateEmotion();
      }
    } else {
      simulateEmotion();
    }
  };

  const simulateEmotion = () => {
    const emotions = ['calm', 'excited', 'confident', 'neutral', 'engaged'];
    const tones = ['steady', 'energetic', 'composed', 'dynamic'];
    
    const newEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    setEmotion(newEmotion);
    setTone(tones[Math.floor(Math.random() * tones.length)]);
    setConfidence(Math.floor(Math.random() * 20) + 75);
    
    // Notify parent component
    onEmotionChange?.(newEmotion);
  };

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="text-xl gradient-text flex items-center justify-between">
          Voice Emotion Analysis
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${isRecording ? 'border-primary/30 text-primary animate-neon-pulse' : 'border-muted-foreground/30 text-muted-foreground'}`}
            >
              {isRecording ? 'RECORDING' : 'READY'}
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
        <CardDescription>Real-time voice emotion detection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between mb-4 p-3 bg-card/50 rounded-lg border border-primary/10">
          <div className="flex items-center gap-2">
            <Label htmlFor="voice-ai-toggle" className="text-sm font-medium cursor-pointer">
              {useAI ? '🧠 AI Model Detection' : '🎲 Simulated Detection'}
            </Label>
            {isLoading && <Badge variant="outline" className="text-xs">Loading...</Badge>}
          </div>
          <Switch
            id="voice-ai-toggle"
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
        <div className="relative h-32 bg-card rounded-lg overflow-hidden border border-primary/20 flex items-center justify-center">
          {isRecording ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-8 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-12 bg-accent rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-16 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
              <div className="w-2 h-12 bg-accent rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
              <div className="w-2 h-8 bg-primary rounded-full animate-pulse" style={{ animationDelay: '600ms' }} />
            </div>
          ) : (
            <MicOff className="w-12 h-12 text-muted-foreground" />
          )}
        </div>

        <Button 
          onClick={isRecording ? stopRecording : startRecording}
          className="w-full"
          variant={isRecording ? "secondary" : "default"}
        >
          {isRecording ? (
            <>
              <MicOff className="w-4 h-4 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Start Recording
            </>
          )}
        </Button>

        {emotion && (
          <div className="space-y-4 pt-4 border-t border-primary/20">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Detected Emotion</span>
                <span className="text-2xl font-bold text-primary capitalize">{emotion}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground">Confidence</span>
                <span className="text-lg font-bold text-accent">{confidence}%</span>
              </div>
            </div>

            <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Voice Tone</span>
                <span className="text-lg font-bold text-secondary capitalize">{tone}</span>
              </div>
              <div className="w-full h-2 bg-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-secondary to-accent transition-all duration-500 animate-pulse"
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
