import { Smile, Frown, Meh, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const MoodTracker = () => {
  const currentMood = 'focused';
  const engagement = 85;
  const attention = 92;

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="text-2xl gradient-text">Mood & Engagement</CardTitle>
        <CardDescription>Real-time emotional state tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center animate-neon-pulse">
              <Smile className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current State</p>
              <p className="text-xl font-bold text-foreground">{currentMood}</p>
            </div>
          </div>
          <Badge className="neon-border bg-primary/20 text-primary">LIVE</Badge>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground/80 flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                Engagement
              </span>
              <span className="text-sm font-bold text-accent">{engagement}%</span>
            </div>
            <div className="w-full h-2 bg-card rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
                style={{ width: `${engagement}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground/80 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-secondary" />
                Attention
              </span>
              <span className="text-sm font-bold text-secondary">{attention}%</span>
            </div>
            <div className="w-full h-2 bg-card rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500"
                style={{ width: `${attention}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-primary/20">
          {[
            { icon: Smile, label: 'Happy', count: 12 },
            { icon: Meh, label: 'Neutral', count: 5 },
            { icon: Frown, label: 'Stressed', count: 2 },
          ].map((mood, i) => (
            <div key={i} className="text-center p-3 rounded-lg bg-card hover:bg-primary/5 transition-colors">
              <mood.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">{mood.label}</p>
              <p className="text-sm font-bold text-foreground">{mood.count}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
