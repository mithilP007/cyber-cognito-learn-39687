import { useState, useRef } from 'react';
import { Upload, Bluetooth, Wifi, Zap, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export const EEGControlPanel = () => {
  const [activeSource, setActiveSource] = useState<string>('none');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (file.name.endsWith('.json')) {
          JSON.parse(content);
          toast.success(`✓ ${file.name} loaded successfully!`);
        } else if (file.name.endsWith('.csv')) {
          toast.success(`✓ ${file.name} loaded successfully!`);
        }
        setUploadedFile(file.name);
        setActiveSource('file');
      } catch (error) {
        toast.error('Invalid file format. Please upload .csv or .json');
      }
    };
    reader.readAsText(file);
  };

  const handleBluetoothConnect = () => {
    toast.info('Scanning for Bluetooth EEG devices...');
    setActiveSource('bluetooth');
  };

  const handleWiFiConnect = () => {
    toast.info('Enter device IP to connect via WiFi');
    setActiveSource('wifi');
  };

  const handleSimulate = () => {
    toast.success('Simulating EEG data for demo mode');
    setActiveSource('simulate');
  };

  return (
    <Card className="cyber-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl gradient-text">EEG Control Center</CardTitle>
            <CardDescription>Connect your brain-computer interface</CardDescription>
          </div>
          {activeSource !== 'none' && (
            <Badge className="neon-border bg-primary/20 text-primary">
              {activeSource.toUpperCase()} ACTIVE
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="connect" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connect">Connect Source</TabsTrigger>
            <TabsTrigger value="datasets">Dataset Library</TabsTrigger>
          </TabsList>

          <TabsContent value="connect" className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) processFile(file);
              }}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleFileUpload}
                className="h-24 flex flex-col gap-2 neon-border bg-card hover:bg-primary/10 relative"
                variant="outline"
              >
                <Upload className="w-6 h-6 text-primary" />
                <span className="text-sm">Upload File</span>
                <span className="text-xs text-muted-foreground">
                  {uploadedFile || '.csv / .json'}
                </span>
              </Button>

              <Button
                onClick={handleBluetoothConnect}
                className="h-24 flex flex-col gap-2 border-secondary/30 bg-card hover:bg-secondary/10"
                variant="outline"
              >
                <Bluetooth className="w-6 h-6 text-secondary" />
                <span className="text-sm">Bluetooth</span>
                <span className="text-xs text-muted-foreground">Live Stream</span>
              </Button>

              <Button
                onClick={handleWiFiConnect}
                className="h-24 flex flex-col gap-2 border-accent/30 bg-card hover:bg-accent/10"
                variant="outline"
              >
                <Wifi className="w-6 h-6 text-accent" />
                <span className="text-sm">WiFi</span>
                <span className="text-xs text-muted-foreground">IP Connect</span>
              </Button>

              <Button
                onClick={handleSimulate}
                className="h-24 flex flex-col gap-2 neon-border bg-card hover:bg-primary/10"
                variant="outline"
              >
                <Zap className="w-6 h-6 text-primary animate-neon-pulse" />
                <span className="text-sm">Simulate</span>
                <span className="text-xs text-muted-foreground">Demo Mode</span>
              </Button>
            </div>

            <div className="flex items-start gap-2 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-foreground/80">
                <p className="font-semibold mb-1">EEG Data Sources</p>
                <p className="text-xs">
                  Connect EEG headsets like Muse, OpenBCI, or upload your own datasets.
                  Real-time monitoring adapts learning based on your brain activity.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="datasets" className="space-y-4">
            <div className="space-y-3">
              {[
                { name: 'Focus Training Session', channels: 8, duration: '45 min' },
                { name: 'Meditation Practice', channels: 4, duration: '30 min' },
                { name: 'Math Problem Solving', channels: 8, duration: '60 min' },
              ].map((dataset, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg bg-card border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-foreground">{dataset.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {dataset.channels} channels • {dataset.duration}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="border-primary/30">
                    Load
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
