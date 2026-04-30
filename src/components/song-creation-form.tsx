'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Download, Loader2, Mic, Music4, Palette, Play, Square, Sparkles, Upload, Wind } from 'lucide-react';
import { useState, useTransition, useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { generateSongAction, suggestGenreAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  lyrics: z.string().min(20, {
    message: 'Please enter at least 20 characters for the lyrics.',
  }),
  voiceFile: z.any().refine((files) => files?.length == 1, 'Voice recording is required.'),
  genre: z.enum(['Afrobeats', 'Pop', 'R&B', 'Hip-Hop', 'Gospel', 'Soul'], {
    required_error: 'You need to select a music genre.',
  }),
  tempo: z.enum(['slow', 'mid', 'fast'], {
    required_error: 'You need to select a tempo.',
  }),
  tone: z.enum(['soft', 'deep', 'bright', 'raspy'], {
    required_error: 'You need to select a voice tone.',
  }),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must consent to AI audio generation.',
  }),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  { id: 1, name: 'Lyrics', fields: ['lyrics'] as const },
  { id: 2, name: 'Voice', fields: ['voiceFile'] as const },
  { id: 3, name: 'Style', fields: ['genre', 'tempo', 'tone', 'consent'] as const },
  { id: 4, name: 'Generate' },
];

export default function SongCreationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [isSuggestingGenre, startGenreSuggestion] = useTransition();
  const { toast } = useToast();
  const [audioResult, setAudioResult] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lyrics: '',
      consent: false,
    },
  });

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], "recording.webm", { type: 'audio/webm' });
        
        setFileName("Record Voice");
        form.setValue('voiceFile', [file], { shouldValidate: true });
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        variant: 'destructive',
        title: 'Microphone Error',
        description: "Could not access microphone. Please check permissions.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const fileRef = form.register('voiceFile');

  const processForm = (values: FormData) => {
    setCurrentStep(3); // Go to final step to show loading indicator
    setAudioResult(null);
    startTransition(async () => {
      const file = values.voiceFile[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const result = await generateSongAction({
          ...values,
          voiceDataUri: base64data,
        });
        if (result.error) {
          toast({
            variant: 'destructive',
            title: 'Generation Failed',
            description: result.error,
          });
          setCurrentStep(2); // Go back to style step on failure
        } else if (result.success && result.data?.enhancedVoiceDataUri) {
          setAudioResult(result.data.enhancedVoiceDataUri);
          toast({
            title: 'Generation Complete!',
            description: 'Your AI-generated song is ready.',
            className: 'bg-accent text-accent-foreground border-green-500',
          });
        }
      };
      reader.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'File Error',
            description: "Could not read the uploaded file.",
        });
        setCurrentStep(1); // Go back to voice step
      }
    });
  };

  const handleSuggestGenre = () => {
    const lyrics = form.getValues('lyrics');
    if (!lyrics || lyrics.length < 20) {
      form.setError('lyrics', { message: 'Please enter at least 20 characters to suggest a genre.'});
      toast({
        variant: 'destructive',
        title: 'Not Enough Lyrics',
        description: 'Please write at least 20 characters before suggesting a genre.',
      });
      return;
    }
    
    startGenreSuggestion(async () => {
        try {
          console.log('Calling suggestGenreAction with lyrics:', lyrics.substring(0, 30));
          const result = await suggestGenreAction({ lyrics });
          console.log('suggestGenreAction result:', result);
          
          if (result.error) {
            toast({
              variant: 'destructive',
              title: 'Suggestion Failed',
              description: result.error,
            });
          } else if (result.success && result.data?.genre) {
            const genreOptions: Array<FormData['genre']> = ['Afrobeats', 'Pop', 'R&B', 'Hip-Hop', 'Gospel', 'Soul'];
            const suggested = genreOptions.find(g => 
              result.data.genre.toLowerCase().includes(g.toLowerCase())
            );
            
            if (suggested) {
              form.setValue('genre', suggested, { shouldValidate: true });
              toast({
                title: 'Genre Suggested!',
                description: `We've set the genre to ${suggested} based on your lyrics.`,
              });
            } else {
              toast({
                  title: 'Genre Suggested!',
                  description: `The AI suggested "${result.data.genre}", which is not a direct option. Please select the closest match.`,
              });
            }
          } else {
            toast({
              variant: 'destructive',
              title: 'Unexpected Response',
              description: 'The AI returned an unexpected response. Please try again.',
            });
          }
        } catch (error) {
          console.error('Error in handleSuggestGenre:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: error instanceof Error ? error.message : 'An unknown error occurred',
          });
        }
    });
  }

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields, { shouldFocus: true });
    if (!output) return;
    
    if (currentStep === 2) {
      await form.handleSubmit(processForm)();
    } else if (currentStep < 3) {
      setCurrentStep(step => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0 && !isPending) {
      setCurrentStep(step => step - 1);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setValue('voiceFile', event.target.files, { shouldValidate: true });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Music4 className="text-primary"/>Enter Your Lyrics</CardTitle>
              <CardDescription>Write or paste the lyrics for your song. The AI will use these to generate the vocals.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField control={form.control} name="lyrics" render={({ field }) => (
                <FormItem>
                  <Textarea {...field} rows={10} placeholder="In the city of dreams, where the neon lights gleam..." className="text-base"/>
                  <FormMessage />
                </FormItem>
              )}/>
              <Button onClick={handleSuggestGenre} variant="outline" size="sm" className="mt-4" disabled={isSuggestingGenre}>
                {isSuggestingGenre ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Suggest Genre
              </Button>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Mic className="text-primary"/>Provide Your Voice</CardTitle>
              <CardDescription>Record your voice or upload an audio file. This will be used as the base for the AI singing voice.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  type="button" 
                  variant={isRecording ? "destructive" : "outline"} 
                  className={`h-32 flex-col gap-2 ${isRecording ? 'animate-pulse' : ''}`}
                  onClick={toggleRecording}
                >
                  {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8"/>}
                  {isRecording ? "Stop Recording" : "Record Voice"} 
                  {isRecording && <span className="text-xs">Recording...</span>}
                </Button>
                <FormField control={form.control} name="voiceFile" render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input {...fileRef} type="file" className="hidden" id="file-upload" accept=".wav, .mp3" onChange={handleFileChange} />
                        <label htmlFor="file-upload" className="cursor-pointer h-32 flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border hover:border-primary hover:bg-accent/20 transition-colors">
                          <Upload className="h-8 w-8"/>
                          <span>Upload File</span>
                          {fileName && <span className="text-xs text-muted-foreground max-w-full px-2 truncate">{fileName}</span>}
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette className="text-primary"/>Customize Your Style</CardTitle>
              <CardDescription>Choose the genre, tempo, and tone to match your creative vision.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <FormField control={form.control} name="genre" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Genre</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a genre" /></SelectTrigger></FormControl>
                    <SelectContent>{['Afrobeats', 'Pop', 'R&B', 'Hip-Hop', 'Gospel', 'Soul'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="tempo" render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-semibold">Tempo</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-3 gap-4">
                      {['slow', 'mid', 'fast'].map(tempo => (
                        <FormItem key={tempo}>
                          <RadioGroupItem value={tempo} id={tempo} className="peer sr-only" />
                          <Label htmlFor={tempo} className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/20 hover:text-primary cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:border-primary">
                            <Wind className="mb-3 h-6 w-6"/>{tempo.charAt(0).toUpperCase() + tempo.slice(1)}
                          </Label>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="tone" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Tone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a tone" /></SelectTrigger></FormControl>
                    <SelectContent>{['soft', 'deep', 'bright', 'raspy'].map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="consent" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background/50">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>User Consent</FormLabel>
                    <FormDescription>I consent to the use of my voice data for AI-generated audio creation.</FormDescription>
                    <FormMessage/>
                  </div>
                </FormItem>
              )}/>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/>Your Masterpiece</CardTitle>
              <CardDescription>Listen to your AI-generated song. Download it or go back to make changes.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[250px]">
              {isPending ? (
                <>
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <p className="text-muted-foreground">Crafting your song... This can take a moment.</p>
                </>
              ) : audioResult ? (
                <div className="w-full space-y-6 text-center">
                  <audio controls src={audioResult} className="w-full rounded-md shadow-md">Your browser does not support the audio element.</audio>
                  <Button asChild>
                    <a href={audioResult} download="vocalcraft-song.wav"><Download className="mr-2"/>Download</a>
                  </Button>
                </div>
              ) : (
                <p className="text-destructive">Something went wrong. Please try again.</p>
              )}
            </CardContent>
          </Card>
        );
      default: return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        <nav aria-label="Progress">
          <ol role="list" className="grid grid-cols-4 rounded-md border border-border divide-x divide-border">
            {steps.map((step, index) => (
              <li key={step.name} className="relative overflow-hidden md:flex-1">
                <div className={`absolute inset-0 ${currentStep === index ? 'bg-primary/20' : ''} ${index < currentStep ? 'bg-primary/10' : ''}`}></div>
                <div className={`group relative flex flex-col items-center p-4 transition-colors`}>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${index < currentStep ? 'bg-primary text-primary-foreground' : currentStep === index ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {index < currentStep ? <Check className="h-6 w-6" /> : step.id}
                  </span>
                  <span className="mt-2 text-sm font-medium text-center">{step.name}</span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        <Separator />
        {renderStepContent()}

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={prev} disabled={currentStep === 0 || isPending}>
            <ChevronLeft className="mr-2 h-4 w-4" /> {currentStep === 3 ? 'Edit Style' : 'Previous'}
          </Button>
          
          {currentStep < 3 ? (
            <Button type="button" onClick={next} disabled={isPending}>
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
              ) : currentStep === 2 ? (
                <><Sparkles className="mr-2 h-4 w-4" /> Generate Song</>
              ) : (
                <>Next Step <ChevronRight className="mr-2 h-4 w-4" /></>
              )}
            </Button>
          ) : (
            <Button type="button" onClick={() => { setCurrentStep(0); setAudioResult(null); form.reset(); setFileName(''); }}>
              Start Over
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
