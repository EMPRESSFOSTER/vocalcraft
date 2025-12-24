import SongCreationForm from '@/components/song-creation-form';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl font-headline">
          VocalCraft AI
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Transform your voice into a professional-quality song with the power of AI.
        </p>
      </header>

      <Card className="shadow-2xl bg-card/50">
        <CardContent className="p-4 sm:p-8">
          <SongCreationForm />
        </CardContent>
      </Card>

      <footer className="text-center mt-12 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} VocalCraft AI. All rights reserved.</p>
        <p className="mt-1">Powered by Firebase and Genkit.</p>
      </footer>
    </div>
  );
}
