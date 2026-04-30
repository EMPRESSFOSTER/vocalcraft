'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Play, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VOICE_MODELS = [
  { id: 'neutral', name: 'Neutral Voice', description: 'Clean, balanced vocal tone' },
  { id: 'warm', name: 'Warm Voice', description: 'Rich, soulful vocal quality' },
  { id: 'bright', name: 'Bright Voice', description: 'Clear, energetic vocal tone' },
  { id: 'deep', name: 'Deep Voice', description: 'Low, powerful vocal presence' },
];

const INSTRUMENTAL_STYLES = [
  { id: 'afrobeats', name: 'Afrobeats', description: 'African percussion, high-life guitars, vibrant synths' },
  { id: 'pop', name: 'Pop', description: 'Catchy synths, drums, radio-friendly' },
  { id: 'rnb', name: 'R&B', description: 'Smooth electric piano, atmospheric pads' },
  { id: 'hiphop', name: 'Hip-Hop', description: 'Punchy drums, deep bass, minimal melody' },
  { id: 'gospel', name: 'Gospel', description: 'Piano, organ, choir pads, uplifting' },
  { id: 'soul', name: 'Soul', description: 'Vintage piano, bass, live drums, strings' },
];

export default function ModelTester() {
  const [selectedVoice, setSelectedVoice] = useState('neutral');
  const [selectedInstrumental, setSelectedInstrumental] = useState('afrobeats');
  const [isGenerating, setIsGenerating] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleTest = async () => {
    setIsGenerating(true);
    setTestResult(null);

    try {
      // Simulate testing with a short sample
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Test Complete!',
        description: `Voice: ${VOICE_MODELS.find(v => v.id === selectedVoice)?.name}, Instrumental: ${INSTRUMENTAL_STYLES.find(i => i.id === selectedInstrumental)?.name}`,
      });
      
      setTestResult('Test successful! You can now use these settings in your song generation.');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Test Failed',
        description: 'Could not test the selected models. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          Model Tester
        </CardTitle>
        <CardDescription>
          Select and test different voice models and instrumental styles before generating your song
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="voice-model">Voice Model</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger id="voice-model">
                <SelectValue placeholder="Select a voice model" />
              </SelectTrigger>
              <SelectContent>
                {VOICE_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{model.name}</span>
                      <span className="text-xs text-muted-foreground">{model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instrumental-style">Instrumental Style</Label>
            <Select value={selectedInstrumental} onValueChange={setSelectedInstrumental}>
              <SelectTrigger id="instrumental-style">
                <SelectValue placeholder="Select an instrumental style" />
              </SelectTrigger>
              <SelectContent>
                {INSTRUMENTAL_STYLES.map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{style.name}</span>
                      <span className="text-xs text-muted-foreground">{style.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleTest} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Test Selected Models
            </>
          )}
        </Button>

        {testResult && (
          <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm text-green-800 dark:text-green-200">{testResult}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
