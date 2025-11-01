import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const useWakeWord = (wakeWord: string = 'joker', onWakeDetected: () => void) => {
  const [isListening, setIsListening] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support wake word detection",
        variant: "destructive"
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      console.log('Wake word detection started');
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results as any)
        .map((result: any) => result[0].transcript.toLowerCase())
        .join(' ');

      console.log('Transcript:', transcript);

      if (transcript.includes(wakeWord.toLowerCase())) {
        console.log('Wake word detected!');
        setIsActive(true);
        onWakeDetected();
        
        // Deactivate after 30 seconds
        setTimeout(() => setIsActive(false), 30000);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // Restart on no-speech
        if (isListening) {
          recognition.start();
        }
      }
    };

    recognition.onend = () => {
      // Auto-restart if still supposed to be listening
      if (isListening) {
        try {
          recognition.start();
        } catch (e) {
          console.log('Recognition restart failed:', e);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [wakeWord, onWakeDetected, toast]);

  const startListening = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
        toast({
          title: "Wake Word Active",
          description: `Say "${wakeWord}" to activate the robot`,
        });
      }
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access for wake word detection",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast({
        title: "Wake Word Disabled",
        description: "Robot will not respond to wake word",
      });
    }
  };

  return {
    isListening,
    isActive,
    startListening,
    stopListening
  };
};
