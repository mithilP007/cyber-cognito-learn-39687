import { useState, useEffect, useRef } from 'react';
import { pipeline, ImageClassificationPipeline, AudioClassificationPipeline } from '@huggingface/transformers';
import { useToast } from '@/hooks/use-toast';

interface EmotionResult {
  label: string;
  score: number;
}

export const useEmotionDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [facialModel, setFacialModel] = useState<ImageClassificationPipeline | null>(null);
  const [audioModel, setAudioModel] = useState<AudioClassificationPipeline | null>(null);
  const { toast } = useToast();
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initModels = async () => {
      try {
        console.log('Loading emotion detection models...');
        
        // Load facial emotion model (trained on FER2013/AffectNet)
        // Using image classification model fine-tuned for emotions
        const facial = await pipeline(
          'image-classification',
          'Xenova/vit-base-patch16-224-in21k-finetuned-emotion',
          { device: 'webgpu' }
        );
        setFacialModel(facial);
        console.log('Facial emotion model loaded');

        // Load audio emotion model (trained on RAVDESS/CREMA-D)
        // Using audio classification model
        const audio = await pipeline(
          'audio-classification',
          'Xenova/wav2vec2-large-xlsr-53-emotion',
          { device: 'webgpu' }
        );
        setAudioModel(audio);
        console.log('Audio emotion model loaded');

        setIsLoading(false);
        toast({
          title: "AI Models Ready",
          description: "Advanced emotion detection activated",
        });
      } catch (error) {
        console.error('Error loading models:', error);
        // Fallback to CPU if WebGPU fails
        try {
          console.log('WebGPU failed, falling back to CPU...');
          const facial = await pipeline(
            'image-classification',
            'Xenova/vit-base-patch16-224-in21k-finetuned-emotion'
          );
          setFacialModel(facial);
          
          const audio = await pipeline(
            'audio-classification',
            'Xenova/wav2vec2-large-xlsr-53-emotion'
          );
          setAudioModel(audio);
          
          setIsLoading(false);
          toast({
            title: "AI Models Ready (CPU Mode)",
            description: "Emotion detection active with CPU inference",
          });
        } catch (cpuError) {
          console.error('CPU fallback failed:', cpuError);
          setIsLoading(false);
          toast({
            title: "Model Loading Failed",
            description: "Using simulated emotion detection",
            variant: "destructive"
          });
        }
      }
    };

    initModels();
  }, [toast]);

  const detectFacialEmotion = async (videoElement: HTMLVideoElement): Promise<{
    emotion: string;
    confidence: number;
    engagement: number;
    attention: number;
  }> => {
    if (!facialModel) {
      // Fallback to simulation
      const emotions = ['happy', 'sad', 'angry', 'neutral', 'surprised', 'fearful'];
      return {
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        confidence: Math.random() * 0.3 + 0.7,
        engagement: Math.floor(Math.random() * 30) + 70,
        attention: Math.floor(Math.random() * 20) + 80,
      };
    }

    try {
      // Create a canvas to capture video frame
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Cannot get canvas context');
      
      ctx.drawImage(videoElement, 0, 0);
      
      const results = await facialModel(canvas) as EmotionResult[];
      const topEmotion = results[0];
      
      // Map emotions to engagement/attention scores
      const engagementMap: Record<string, number> = {
        'happy': 85, 'surprised': 90, 'angry': 75, 'neutral': 70, 'sad': 50, 'fearful': 60
      };
      const attentionMap: Record<string, number> = {
        'happy': 80, 'surprised': 95, 'angry': 85, 'neutral': 75, 'sad': 60, 'fearful': 70
      };

      return {
        emotion: topEmotion.label,
        confidence: topEmotion.score,
        engagement: engagementMap[topEmotion.label] || 70,
        attention: attentionMap[topEmotion.label] || 75,
      };
    } catch (error) {
      console.error('Facial detection error:', error);
      return {
        emotion: 'neutral',
        confidence: 0.5,
        engagement: 70,
        attention: 75,
      };
    }
  };

  const detectVoiceEmotion = async (audioData: Float32Array): Promise<{
    emotion: string;
    confidence: number;
    tone: string;
  }> => {
    if (!audioModel) {
      // Fallback to simulation
      const emotions = ['calm', 'excited', 'confident', 'neutral', 'engaged'];
      const tones = ['steady', 'energetic', 'composed', 'dynamic'];
      return {
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        confidence: Math.random() * 0.25 + 0.75,
        tone: tones[Math.floor(Math.random() * tones.length)],
      };
    }

    try {
      // Convert Float32Array to the format expected by the model
      const results = await audioModel(audioData) as EmotionResult[];
      const topEmotion = results[0];
      
      // Map emotions to tones
      const toneMap: Record<string, string> = {
        'happy': 'energetic',
        'angry': 'intense',
        'sad': 'subdued',
        'neutral': 'steady',
        'calm': 'composed',
        'excited': 'dynamic'
      };

      return {
        emotion: topEmotion.label,
        confidence: topEmotion.score,
        tone: toneMap[topEmotion.label] || 'steady',
      };
    } catch (error) {
      console.error('Voice detection error:', error);
      return {
        emotion: 'neutral',
        confidence: 0.5,
        tone: 'steady',
      };
    }
  };

  return {
    isLoading,
    detectFacialEmotion,
    detectVoiceEmotion,
    modelsReady: facialModel !== null && audioModel !== null,
  };
};
