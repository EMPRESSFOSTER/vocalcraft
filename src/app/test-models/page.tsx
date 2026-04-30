import ModelTester from '@/components/model-tester';
import { Card, CardContent } from '@/components/ui/card';

export default function TestModelsPage() {
  return (
    <div className="container py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Test AI Models</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Experiment with different voice models and instrumental styles to find the perfect combination for your music
        </p>
      </div>
      
      <ModelTester />
      
      <div className="mt-12 max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">How to Use</h2>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
                <span>Select a voice model that matches your desired vocal quality</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                <span>Choose an instrumental style that fits your genre</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
                <span>Click "Test Selected Models" to preview how they sound together</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</span>
                <span>Once satisfied, use these settings in the main song creation form</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
