'use server';
/**
 * @fileOverview An AI agent for generating instrumental backing tracks based on genre, tempo, and mood.
 *
 * - generateInstrumental - A function that handles the instrumental generation process.
 * - GenerateInstrumentalInput - The input type for the generateInstrumental function.
 * - GenerateInstrumentalOutput - The return type for the generateInstrumental function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { callReplicate } from '@/lib/replicate-rest';
import { analyzeLyrics } from '@/lib/audio-utils';
import { config } from 'dotenv';
config({ path: '.env.local' });

const GenerateInstrumentalInputSchema = z.object({
  genre: z.enum(['Afrobeats', 'Pop', 'R&B', 'Hip-Hop', 'Gospel', 'Soul']).describe('The genre of the instrumental.'),
  tempo: z.enum(['slow', 'mid', 'fast']).describe('The tempo of the track.'),
  tone: z.enum(['soft', 'deep', 'bright', 'raspy']).describe('The desired tone or mood of the track.'),
  lyrics: z.string().optional().describe('The lyrics to estimate duration.'),
});
export type GenerateInstrumentalInput = z.infer<typeof GenerateInstrumentalInputSchema>;

const GenerateInstrumentalOutputSchema = z.object({
  instrumentalDataUri: z
    .string()
    .describe(
      'The AI generated instrumental file as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type GenerateInstrumentalOutput = z.infer<typeof GenerateInstrumentalOutputSchema>;

export async function generateInstrumental(input: GenerateInstrumentalInput): Promise<GenerateInstrumentalOutput> {
  return generateInstrumentalFlow(input);
}

const generateInstrumentalPrompt = ai.definePrompt({
  name: 'generateInstrumentalPrompt',
  model: 'googleai/gemini-2.0-flash',
  config: {
    maxOutputTokens: 2048,
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  },
  input: {schema: GenerateInstrumentalInputSchema},
  prompt: `You are an AI music producer specializing in creating high-quality instrumental backing tracks. A user has provided music preferences.

General Requirements:
- Professional studio quality
- Clear instrument separation
- Rhythmically consistent
- No vocals
- Length: Approximately 2 minutes

Genre-Specific Guidelines (Apply based on the '{{{genre}}}' input):

If Genre is 'Afrobeats':
- Tempo: 100 BPM
- Mood: Energetic, bouncy
- Instruments: African percussion, high-life guitars, deep bass, vibrant synths
- Style: Clean modern Afrobeats track suitable for vocals

If Genre is 'Soul':
- Tempo: 65–80 BPM
- Mood: Deep, emotional, timeless
- Instruments: Piano, bass, live drums, subtle strings
- Style: Vintage classic soul music

If Genre is 'R&B':
- Tempo: 70–85 BPM
- Mood: Emotional, soulful, romantic
- Instruments: Electric piano, soft drums, bass, atmospheric pads
- Style: Modern R&B ballad

If Genre is 'Pop':
- Tempo: 100–120 BPM
- Mood: Bright, catchy, uplifting
- Instruments: Synths, drums, bass, light guitar
- Style: Radio-friendly modern pop

If Genre is 'Hip-Hop':
- Tempo: 85–95 BPM
- Mood: Confident, bold, rhythmic
- Instruments: Punchy drums, deep bass, minimal melody
- Style: Modern hip-hop beat

If Genre is 'Gospel':
- Tempo: 70–90 BPM
- Mood: Powerful, emotional, uplifting
- Instruments: Piano, organ, choir-style pads, live drums
- Style: Contemporary gospel worship

Task:
Generate a complete instrumental track description applying the specific instrumentation, mood, and tempo instructions for the {{{genre}}} genre.

Input Data:
Genre: {{{genre}}}
Tempo: {{{tempo}}}
Tone: {{{tone}}} (Map 'soft' to warmer/gentler dynamics, 'deep' to more bass-heavy/emotional, 'bright' to clearer/punchier mix, etc.)

Output the instrumental track description as a plain text string.
Make sure the output is JUST the description, not a JSON object.
Description:`,
});

async function urlToDataUri(url: string): Promise<string> {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'audio/wav';
    return `data:${contentType};base64,${base64}`;
}

const generateInstrumentalFlow = ai.defineFlow(
  {
    name: 'generateInstrumentalFlow',
    inputSchema: GenerateInstrumentalInputSchema,
    outputSchema: GenerateInstrumentalOutputSchema,
  },
  async input => {
    try {
      console.log(`Generating instrumental prompt for ${input.genre}...`);
      const { text } = await generateInstrumentalPrompt(input);
      
      console.log(`Calling Replicate MusicGen with prompt: "${text.substring(0, 50)}..."`);
      
      if (!process.env.REPLICATE_API_TOKEN) {
        throw new Error("REPLICATE_API_TOKEN is not set in .env.local");
      }

      // Estimate duration
      let duration = 15;
      if (input.lyrics) {
          const bpmMap = { slow: 80, mid: 100, fast: 120 };
          const bpm = bpmMap[input.tempo];
          const analysis = analyzeLyrics(input.lyrics, bpm);
          duration = Math.min(Math.max(Math.ceil(analysis.totalDuration), 5), 45); // Max 45s for trial/speed
          console.log(`Estimated vocal duration: ${analysis.totalDuration}s. Setting instrumental to: ${duration}s`);
      }

      // We use MusicGen model
      const output = await callReplicate(
        "meta/musicgen:671ac645ce5e52d3729471c5eb5ad5748afc73595a47731998789e504385c72d",
        {
          prompt: text,
          duration: duration,
          model_version: "stereo-large",
          output_format: "wav"
        }
      ) as string;

      console.log("Replicate output URL:", output);
      const dataUri = await urlToDataUri(output);
      
      return {
        instrumentalDataUri: dataUri
      };
    } catch (error: any) {
      console.warn("Real Instrumental Generation failed. Falling back to mock data.", error.message);
      // Fallback to a silent/dummy WAV base64
      return {
        instrumentalDataUri: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="
      };
    }
  }
);
