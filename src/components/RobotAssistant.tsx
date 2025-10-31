import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Sparkles, Heart, Zap } from 'lucide-react';

interface RobotAssistantProps {
  facialEmotion: string;
  voiceEmotion: string | null;
  engagement: number;
  attention: number;
}

const encouragingMessages = {
  distracted: [
    "Hey! Let's refocus together! 🎯",
    "I believe in you! Take a deep breath 💪",
    "You've got this! Let's tackle one thing at a time 🌟",
    "Break time? Or ready to conquer this? 🚀"
  ],
  sad: [
    "I'm here for you! You're doing amazing 💙",
    "Every small step counts! Keep going! 🌈",
    "You're stronger than you think! 💪✨",
    "Tomorrow is a new day full of possibilities! 🌅"
  ],
  low_engagement: [
    "Let's energize! You can do this! ⚡",
    "Time to shine! Show what you're made of! ✨",
    "Let's turn this around together! 🔥",
    "Your potential is unlimited! 🚀"
  ],
  happy: [
    "Amazing energy! Keep it up! 🎉",
    "You're crushing it! So proud! 🌟",
    "Your smile is contagious! Love it! 😊",
    "That's the spirit! Unstoppable! 🚀"
  ],
  neutral: [
    "Steady and focused! Great work! 👍",
    "You're in the zone! Keep flowing! 🌊",
    "Consistent effort = success! 📈",
    "Looking good! Stay on track! ✅"
  ],
  engaged: [
    "Wow! Your focus is incredible! 🔥",
    "This is what peak performance looks like! ⭐",
    "You're absolutely nailing this! 💯",
    "Keep this momentum going! 🎯"
  ]
};

export const RobotAssistant = ({ facialEmotion, voiceEmotion, engagement, attention }: RobotAssistantProps) => {
  const [message, setMessage] = useState("");
  const [robotMood, setRobotMood] = useState<'happy' | 'encouraging' | 'excited'>('happy');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Determine robot mood and message based on emotions
    let mood: 'happy' | 'encouraging' | 'excited' = 'happy';
    let messageCategory = 'neutral';

    if (engagement < 60 || attention < 70) {
      mood = 'encouraging';
      messageCategory = 'low_engagement';
    } else if (facialEmotion === 'sad' || voiceEmotion === 'calm') {
      mood = 'encouraging';
      messageCategory = 'sad';
    } else if (facialEmotion === 'focused' && engagement > 80) {
      mood = 'excited';
      messageCategory = 'engaged';
    } else if (facialEmotion === 'happy' || voiceEmotion === 'excited') {
      mood = 'excited';
      messageCategory = 'happy';
    } else if (facialEmotion === 'engaged') {
      mood = 'excited';
      messageCategory = 'engaged';
    }

    setRobotMood(mood);
    
    // Pick random message from category
    const messages = encouragingMessages[messageCategory as keyof typeof encouragingMessages];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  }, [facialEmotion, voiceEmotion, engagement, attention]);

  const getRobotColor = () => {
    switch (robotMood) {
      case 'encouraging': return 'text-secondary';
      case 'excited': return 'text-accent';
      default: return 'text-primary';
    }
  };

  const getRobotAnimation = () => {
    switch (robotMood) {
      case 'encouraging': return 'animate-bounce';
      case 'excited': return 'animate-pulse';
      default: return '';
    }
  };

  return (
    <Card className="cyber-card relative overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Robot Avatar */}
          <div className={`relative ${getRobotAnimation()}`}>
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/30 ${isAnimating ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
              <Bot className={`w-12 h-12 ${getRobotColor()}`} />
            </div>
            
            {/* Decorative elements */}
            {robotMood === 'excited' && (
              <>
                <Sparkles className="w-6 h-6 text-accent absolute -top-2 -right-2 animate-spin" />
                <Zap className="w-5 h-5 text-primary absolute -bottom-1 -left-2 animate-pulse" />
              </>
            )}
            {robotMood === 'encouraging' && (
              <Heart className="w-6 h-6 text-secondary absolute -top-2 -right-2 animate-pulse" />
            )}
          </div>

          {/* Message Bubble */}
          <div className="relative w-full">
            <div className={`bg-card border border-primary/20 rounded-lg p-4 text-center transition-all duration-300 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
              <p className="text-sm font-medium text-foreground/90 leading-relaxed">
                {message}
              </p>
            </div>
            {/* Speech bubble pointer */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-primary/20"></div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${robotMood === 'excited' ? 'bg-accent animate-pulse' : robotMood === 'encouraging' ? 'bg-secondary animate-pulse' : 'bg-primary'}`}></div>
            <span className="capitalize">
              {robotMood === 'encouraging' ? 'Supporting You' : robotMood === 'excited' ? 'Celebrating!' : 'Monitoring'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
