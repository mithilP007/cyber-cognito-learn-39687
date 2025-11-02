import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Brain, Zap, Lightbulb, MessageSquare } from 'lucide-react';

interface WorkflowStage {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  details: string[];
}

const WorkflowDiagram = () => {
  const [activeStage, setActiveStage] = useState<string | null>(null);

  const stages: WorkflowStage[] = [
    {
      id: 'input',
      title: 'EEG Stream/Input',
      description: 'Real-time brainwave data acquisition',
      icon: <Brain className="w-8 h-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-300',
      details: [
        'Simulated EEG sensor data',
        'Multiple frequency bands (Delta, Theta, Alpha, Beta, Gamma)',
        'Continuous real-time streaming',
        'Signal preprocessing and filtering'
      ]
    },
    {
      id: 'classification',
      title: 'Real-Time Classification',
      description: 'AI-powered cognitive state detection',
      icon: <Zap className="w-8 h-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100 border-purple-300',
      details: [
        'Machine learning classification algorithms',
        'Attention level assessment',
        'Cognitive load measurement',
        'Emotional state recognition',
        'Pattern recognition and analysis'
      ]
    },
    {
      id: 'interventions',
      title: 'Adaptive Interventions',
      description: 'Personalized engagement strategies',
      icon: <Lightbulb className="w-8 h-8" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100 border-orange-300',
      details: [
        'AR (Augmented Reality) experiences',
        'Interactive quiz generation',
        'Dynamic content overlays',
        'Gamification elements',
        'Adaptive difficulty adjustment'
      ]
    },
    {
      id: 'feedback',
      title: 'Personalized Feedback & UI',
      description: 'Intelligent user experience adaptation',
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100 border-green-300',
      details: [
        'Real-time performance metrics',
        'Personalized recommendations',
        'Adaptive UI modifications',
        'Progress tracking and insights',
        'Learning path optimization'
      ]
    }
  ];

  return (
    <div className="w-full space-y-8">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            EEG-Driven Learning Workflow
          </CardTitle>
          <CardDescription className="text-center text-lg">
            From brainwave capture to personalized learning experiences
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Workflow Diagram */}
      <div className="relative">
        {/* Desktop View - Horizontal Flow */}
        <div className="hidden lg:grid lg:grid-cols-7 gap-4 items-center">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              {/* Stage Card */}
              <div className="col-span-1">
                <Card
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 ${
                    activeStage === stage.id ? 'ring-4 ring-primary scale-105 shadow-xl' : ''
                  } ${stage.bgColor}`}
                  onClick={() => setActiveStage(activeStage === stage.id ? null : stage.id)}
                  onMouseEnter={() => setActiveStage(stage.id)}
                  onMouseLeave={() => setActiveStage(null)}
                >
                  <CardContent className="p-6 text-center space-y-3">
                    <div className={`flex justify-center ${stage.color}`}>
                      {stage.icon}
                    </div>
                    <h3 className={`font-bold text-lg ${stage.color}`}>
                      {stage.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {stage.description}
                    </p>
                    <Badge variant="outline" className="mt-2">
                      Stage {index + 1}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Arrow between stages */}
              {index < stages.length - 1 && (
                <div className="col-span-1 flex justify-center">
                  <ArrowRight className="w-8 h-8 text-primary animate-pulse" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile/Tablet View - Vertical Flow */}
        <div className="lg:hidden space-y-4">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              {/* Stage Card */}
              <Card
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 ${
                  activeStage === stage.id ? 'ring-4 ring-primary scale-105 shadow-xl' : ''
                } ${stage.bgColor}`}
                onClick={() => setActiveStage(activeStage === stage.id ? null : stage.id)}
              >
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className={`${stage.color}`}>
                      {stage.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg ${stage.color}`}>
                        {stage.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {stage.description}
                      </p>
                    </div>
                    <Badge variant="outline">
                      Stage {index + 1}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Arrow between stages */}
              {index < stages.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowRight className="w-8 h-8 text-primary rotate-90 animate-pulse" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Detailed Information Panel */}
      {activeStage && (
        <Card className="border-2 border-primary shadow-xl animate-in slide-in-from-bottom-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className={stages.find(s => s.id === activeStage)?.color}>
                {stages.find(s => s.id === activeStage)?.icon}
              </span>
              {stages.find(s => s.id === activeStage)?.title}
            </CardTitle>
            <CardDescription>
              {stages.find(s => s.id === activeStage)?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h4 className="font-semibold mb-3 text-lg">Key Features:</h4>
            <ul className="space-y-2">
              {stages.find(s => s.id === activeStage)?.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">{detail}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <p className="text-sm text-center text-muted-foreground">
            <span className="font-semibold">💡 Interactive Demo:</span> Click or hover over any stage to view detailed information about each component of the workflow.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowDiagram;
