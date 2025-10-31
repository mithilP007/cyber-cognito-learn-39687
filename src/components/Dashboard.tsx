import { useState } from 'react';
import { EEGControlPanel } from './EEGControlPanel';
import { MoodTracker } from './MoodTracker';
import { VRExperience } from './VRExperience';
import { AIChat } from './AIChat';
import { BrainGames } from './BrainGames';
import { CameraEmotionAnalyzer } from './CameraEmotionAnalyzer';
import { MicrophoneEmotionAnalyzer } from './MicrophoneEmotionAnalyzer';
import { RobotAssistant } from './RobotAssistant';
import { Video, Mic, MessageSquare, Headphones } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Dashboard = () => {
  const [facialEmotion, setFacialEmotion] = useState('neutral');
  const [voiceEmotion, setVoiceEmotion] = useState<string | null>(null);
  const [engagement, setEngagement] = useState(0);
  const [attention, setAttention] = useState(0);

  const handleCameraEmotionChange = (emotion: string, eng: number, att: number) => {
    setFacialEmotion(emotion);
    setEngagement(eng);
    setAttention(att);
  };

  const handleMicEmotionChange = (emotion: string | null) => {
    setVoiceEmotion(emotion);
  };
  return (
    <section id="dashboard" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">Command Center</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Real-time multimodal monitoring and adaptive learning interventions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <EEGControlPanel />
          </div>
          <div className="space-y-6">
            <MoodTracker />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <VRExperience />
          
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">Input Modalities</CardTitle>
              <CardDescription>Connected sensors and data streams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: Video, label: 'Webcam', status: 'Active', color: 'primary' },
                { icon: Mic, label: 'Microphone', status: 'Active', color: 'secondary' },
                { icon: MessageSquare, label: 'Text Input', status: 'Ready', color: 'accent' },
                { icon: Headphones, label: 'EEG/BCI', status: 'Simulated', color: 'primary' },
              ].map((modality, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg bg-card border border-primary/20"
                >
                  <div className="flex items-center gap-3">
                    <modality.icon className={`w-5 h-5 text-${modality.color}`} />
                    <span className="font-medium">{modality.label}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`border-${modality.color}/30 text-${modality.color}`}
                  >
                    {modality.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <CameraEmotionAnalyzer onEmotionChange={handleCameraEmotionChange} />
          <MicrophoneEmotionAnalyzer onEmotionChange={handleMicEmotionChange} />
          <RobotAssistant 
            facialEmotion={facialEmotion}
            voiceEmotion={voiceEmotion}
            engagement={engagement}
            attention={attention}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AIChat />
          <BrainGames />
        </div>
      </div>
    </section>
  );
};
