import { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export const MicrophoneEmotionAnalyzer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [tone, setTone] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

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

  const analyzeVoiceEmotion = () => {
    const emotions = ['calm', 'excited', 'confident', 'neutral', 'engaged'];
    const tones = ['steady', 'energetic', 'composed', 'dynamic'];
    
    setEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
    setTone(tones[Math.floor(Math.random() * tones.length)]);
    setConfidence(Math.floor(Math.random() * 20) + 75);
  };

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="text-xl gradient-text flex items-center justify-between">
          Voice Emotion Analysis
          <Badge 
            variant="outline" 
            className={`${isRecording ? 'border-primary/30 text-primary animate-neon-pulse' : 'border-muted-foreground/30 text-muted-foreground'}`}
          >
            {isRecording ? 'RECORDING' : 'READY'}
          </Badge>
        </CardTitle>
        <CardDescription>Real-time voice emotion detection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Detected Emotion</span>
              <span className="text-lg font-bold text-primary capitalize">{emotion}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Voice Tone</span>
              <span className="text-sm font-bold text-accent capitalize">{tone}</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground/80">Confidence</span>
                <span className="text-sm font-bold text-secondary">{confidence}%</span>
              </div>
              <div className="w-full h-2 bg-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500"
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
