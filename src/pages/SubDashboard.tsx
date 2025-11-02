import { Navigation } from '@/components/Navigation';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Activity, Zap, Target } from 'lucide-react';

const SubDashboard = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBackground />
      <Navigation />
      <div className="pt-24 container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">Sub Dashboard</h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Advanced analytics and detailed monitoring for your cognitive learning journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                <Brain className="w-6 h-6" />
                Cognitive Metrics
              </CardTitle>
              <CardDescription>
                Deep dive into brain activity patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">Focus Score</span>
                  <span className="text-primary font-bold">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">Memory Retention</span>
                  <span className="text-primary font-bold">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">Learning Speed</span>
                  <span className="text-primary font-bold">78%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Session History
              </CardTitle>
              <CardDescription>
                Track your learning sessions over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-card border border-primary/20">
                  <p className="font-medium">Today - 2 sessions</p>
                  <p className="text-sm text-foreground/60">Total: 45 minutes</p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-primary/20">
                  <p className="font-medium">Yesterday - 3 sessions</p>
                  <p className="text-sm text-foreground/60">Total: 67 minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                <Zap className="w-6 h-6" />
                Performance
              </CardTitle>
              <CardDescription>
                Real-time performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">Engagement</span>
                  <span className="text-secondary font-bold">High</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">Stress Level</span>
                  <span className="text-accent font-bold">Low</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">Adaptability</span>
                  <span className="text-primary font-bold">Optimal</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                <Target className="w-6 h-6" />
                Learning Goals
              </CardTitle>
              <CardDescription>
                Set and track your cognitive development objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-card border border-primary/20">
                  <h3 className="font-semibold mb-2">Concentration Improvement</h3>
                  <div className="w-full bg-card-foreground/10 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <p className="text-sm text-foreground/60 mt-2">75% Complete</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-primary/20">
                  <h3 className="font-semibold mb-2">Stress Management</h3>
                  <div className="w-full bg-card-foreground/10 rounded-full h-2.5">
                    <div className="bg-secondary h-2.5 rounded-full" style={{width: '60%'}}></div>
                  </div>
                  <p className="text-sm text-foreground/60 mt-2">60% Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">Quick Stats</CardTitle>
              <CardDescription>
                Overview of your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-primary/20">
                  <span className="text-foreground/70">Total Sessions</span>
                  <span className="text-xl font-bold text-primary">156</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-primary/20">
                  <span className="text-foreground/70">Active Days</span>
                  <span className="text-xl font-bold text-primary">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">Achievements</span>
                  <span className="text-xl font-bold text-primary">23</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubDashboard;
