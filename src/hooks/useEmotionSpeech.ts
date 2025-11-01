import { useEffect, useRef } from 'react';

interface EmotionSpeechConfig {
  enabled: boolean;
  emotion: string;
  engagement: number;
  attention: number;
}

export const useEmotionSpeech = ({ enabled, emotion, engagement, attention }: EmotionSpeechConfig) => {
  const lastEmotionRef = useRef<string>('');
  const speechTimeoutRef = useRef<number | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    if (!enabled || !synthRef.current || !emotion || emotion === lastEmotionRef.current) {
      return;
    }

    // Clear any pending speech
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }

    // Update last emotion
    lastEmotionRef.current = emotion;

    // Debounce speech to avoid too many announcements
    speechTimeoutRef.current = window.setTimeout(() => {
      if (!synthRef.current) return;

      // Cancel any ongoing speech
      synthRef.current.cancel();

      const emotionMessages: Record<string, string[]> = {
        happy: [
          `You're looking happy! Your engagement is at ${engagement}%`,
          `Great vibes! I can see you're feeling happy`,
          `Wonderful! Your positive energy shows ${engagement}% engagement`,
        ],
        sad: [
          `I notice you seem sad. Would you like to talk?`,
          `Your attention is at ${attention}%. Everything okay?`,
          `I'm here if you need support. You seem a bit down`,
        ],
        angry: [
          `I sense some frustration. Take a deep breath`,
          `Your intensity is high at ${engagement}%. Want to cool down?`,
          `I notice strong emotions. Let's work through this`,
        ],
        neutral: [
          `You're in a calm, neutral state`,
          `Balanced mood detected. Engagement at ${engagement}%`,
          `Nice and steady. You're focused`,
        ],
        surprised: [
          `Oh! You look surprised! Engagement spiked to ${engagement}%`,
          `Something caught your attention!`,
          `Wow, that's unexpected! High attention at ${attention}%`,
        ],
        fearful: [
          `I sense some concern. Everything alright?`,
          `You seem worried. I'm here to help`,
          `Take it easy. Your attention is at ${attention}%`,
        ],
      };

      const messages = emotionMessages[emotion.toLowerCase()] || [`I detected ${emotion} emotion`];
      const message = messages[Math.floor(Math.random() * messages.length)];

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      // Adjust voice characteristics based on emotion
      switch (emotion.toLowerCase()) {
        case 'happy':
          utterance.pitch = 1.2;
          utterance.rate = 1.1;
          break;
        case 'sad':
          utterance.pitch = 0.8;
          utterance.rate = 0.9;
          break;
        case 'angry':
          utterance.pitch = 0.9;
          utterance.rate = 1.2;
          break;
        case 'excited':
          utterance.pitch = 1.3;
          utterance.rate = 1.3;
          break;
      }

      synthRef.current.speak(utterance);
    }, 3000); // Wait 3 seconds before speaking to avoid spam

    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };
  }, [enabled, emotion, engagement, attention]);

  return {
    cancelSpeech: () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    },
  };
};
