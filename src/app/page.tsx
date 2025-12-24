import { ArrowRight, Bot, GitBranch, Music, Palette, ShieldCheck, UploadCloud, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import SongCreationForm from '@/components/song-creation-form';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section id="home" className="relative text-center py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background -z-10"></div>
          <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_400px_at_50%_200px,#1e90ff33,transparent)] -z-10"></div>
          <div className="container">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-foreground mb-4 font-headline">
              Craft Your Sound, Redefined
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
              VocalCraft AI transforms your raw vocal recordings into studio-quality songs. Experience the future of music creation.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                <Link href="#create">
                  Start Creating <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28 bg-card/20">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">The Future of Vocal Production is Here</h2>
              <p className="mt-4 text-muted-foreground">
                Our advanced AI models analyze your voice and apply professional processing to deliver unparalleled quality.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Bot />}
                title="AI Vocal Enhancement"
                description="Automatic pitch correction, noise reduction, and equalization to make your voice shine."
              />
              <FeatureCard
                icon={<Palette />}
                title="Genre-Aware Styling"
                description="Select from a variety of genres like Pop, R&B, or Hip-Hop, and our AI will style your track accordingly."
              />
              <FeatureCard
                icon={<Zap />}
                title="Instant Synthesis"
                description="Go from raw vocals to a fully synthesized song in minutes, not hours."
              />
              <FeatureCard
                icon={<Music />}
                title="Custom Tone Selection"
                description="Fine-tune your sound by choosing from voice tones like 'soft', 'deep', 'bright', or 'raspy'."
              />
              <FeatureCard
                icon={<GitBranch />}
                title="Tempo Matching"
                description="The AI intelligently aligns your lyrical performance to your chosen tempo, from slow ballads to fast tracks."
              />
              <FeatureCard
                icon={<ShieldCheck />}
                title="Your Voice is Secure"
                description="We respect your artistry. Your data is used solely for creation and is never shared."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-28">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Three Simple Steps to Your Hit Song</h2>
            </div>
            <div className="relative grid md:grid-cols-3 gap-12">
               <div className="absolute top-1/2 left-0 w-full h-px bg-primary/20 hidden md:block"></div>
               <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-primary/0 via-primary to-primary/0 hidden md:block animate-pulse"></div>

              <HowItWorksStep
                step="1"
                icon={<UploadCloud />}
                title="Upload Your Voice"
                description="Provide your lyrics and upload a simple recording of your voice. No fancy equipment needed."
              />
              <HowItWorksStep
                step="2"
                icon={<Palette />}
                title="Choose Your Style"
                description="Select the genre, tempo, and vocal tone that matches your artistic vision."
              />
              <HowItWorksStep
                step="3"
                icon={<Music />}
                title="Generate & Download"
                description="Our AI works its magic. Listen to your masterpiece and download the high-quality audio file."
              />
            </div>
          </div>
        </section>

        {/* Create Section */}
        <section id="create" className="py-20 md:py-28 bg-card/20">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Create?</h2>
              <p className="mt-4 text-muted-foreground">
                You're just moments away from hearing your voice like never before. Start the process now.
              </p>
            </div>
            <Card className="max-w-4xl mx-auto shadow-2xl">
              <CardContent className="p-6 md:p-10">
                <SongCreationForm />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-card/50 border-t border-border/40">
        <div className="container py-12">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">VocalCraft AI</span>
            </div>
            <nav className="flex justify-center gap-4 md:gap-6 text-muted-foreground">
              <Link href="#home" className="hover:text-primary transition-colors">Home</Link>
              <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
              <Link href="#how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
              <Link href="#create" className="hover:text-primary transition-colors">Create</Link>
            </nav>
            <div className="flex justify-center md:justify-end">
              <Button asChild variant="outline" className="bg-transparent">
                <Link href="#create">
                  Create Your Music
                </Link>
              </Button>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground pt-8 border-t border-border/20">
            <p>&copy; {new Date().getFullYear()} VocalCraft AI. The Future of Sound.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; }) {
  return (
    <Card className="bg-card/30 border-border/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 transform hover:-translate-y-1 shadow-md">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function HowItWorksStep({ step, icon, title, description }: { step: string; icon: React.ReactNode; title: string; description: string; }) {
  return (
    <div className="relative text-center p-4">
       <div className="relative z-10 w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold shadow-lg shadow-primary/30">
        {step}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
