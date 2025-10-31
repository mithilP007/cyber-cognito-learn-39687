import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const useRobotConversation = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const conversationRef = useRef<Message[]>([
    {
      role: 'system',
      content: 'You are an encouraging, enthusiastic AI learning companion robot. Keep responses brief (1-2 sentences), motivating, and personalized based on the user\'s emotional state. Use emojis occasionally. Be supportive and help them stay focused on learning.'
    }
  ]);

  const chat = async (userMessage: string, emotionContext?: {
    facialEmotion: string;
    voiceEmotion: string | null;
    engagement: number;
    attention: number;
  }): Promise<string> => {
    setIsProcessing(true);

    try {
      // Add emotion context to the message
      let contextualMessage = userMessage;
      if (emotionContext) {
        contextualMessage = `[User emotion: ${emotionContext.facialEmotion}, engagement: ${emotionContext.engagement}%, attention: ${emotionContext.attention}%] ${userMessage}`;
      }

      conversationRef.current.push({
        role: 'user',
        content: contextualMessage
      });

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: conversationRef.current
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Read the streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  fullResponse += content;
                }
              } catch (e) {
                // Skip malformed JSON
              }
            }
          }
        }
      }

      conversationRef.current.push({
        role: 'assistant',
        content: fullResponse
      });

      setIsProcessing(false);
      return fullResponse;
    } catch (error) {
      console.error('Chat error:', error);
      setIsProcessing(false);
      
      // Fallback responses based on emotion
      const fallbacks = [
        "I'm here to support you! Let's keep going! 💪",
        "You're doing great! Stay focused! ✨",
        "I believe in you! One step at a time! 🌟"
      ];
      return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
  };

  const reset = () => {
    conversationRef.current = [conversationRef.current[0]]; // Keep system message
  };

  return {
    chat,
    reset,
    isProcessing
  };
};
