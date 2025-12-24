'use server';
/**
 * @fileOverview An AI agent for enhancing voice, converting lyrics to phonemes, aligning lyrics to tempo, generating a singing voice, and applying style presets based on the genre.
 *
 * - enhanceVoiceAndSing - A function that handles the voice enhancement and singing synthesis process.
 * - EnhanceVoiceAndSingInput - The input type for the enhanceVoiceAndSing function.
 * - EnhanceVoiceAndSingOutput - The return type for the enhanceVoiceAndSing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceVoiceAndSingInputSchema = z.object({
  lyrics: z.string().describe('The lyrics of the song.'),
  voiceDataUri: z
    .string()
    .describe(
      'The user uploaded voice file as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' /* TODO: what are the supported MIME types? */
    ),
  genre: z.enum(['Afrobeats', 'Pop', 'R&B', 'Hip-Hop', 'Gospel']).describe('The genre of the song.'),
  tempo: z.enum(['slow', 'mid', 'fast']).describe('The tempo of the song.'),
  tone: z.enum(['soft', 'deep', 'bright', 'raspy']).describe('The tone of the singing voice.'),
});
export type EnhanceVoiceAndSingInput = z.infer<typeof EnhanceVoiceAndSingInputSchema>;

const EnhanceVoiceAndSingOutputSchema = z.object({
  enhancedVoiceDataUri: z
    .string()
    .describe(
      'The AI enhanced singing voice file as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type EnhanceVoiceAndSingOutput = z.infer<typeof EnhanceVoiceAndSingOutputSchema>;

export async function enhanceVoiceAndSing(input: EnhanceVoiceAndSingInput): Promise<EnhanceVoiceAndSingOutput> {
  return enhanceVoiceAndSingFlow(input);
}

const enhanceVoiceAndSingPrompt = ai.definePrompt({
  name: 'enhanceVoiceAndSingPrompt',
  input: {schema: EnhanceVoiceAndSingInputSchema},
  output: {schema: EnhanceVoiceAndSingOutputSchema},
  prompt: `You are an AI audio engineer specializing in voice enhancement and singing synthesis.  A user has provided a voice recording, lyrics, and music preferences.  You will:

1. Enhance the voice to reduce noise and correct pitch.
2. Convert the lyrics to phonemes.
3. Align the phonemes to the specified tempo.
4. Generate a singing voice using AI singing synthesis.
5. Apply style presets based on the specified genre.

Lyrics: {{{lyrics}}}
Voice: {{media url=voiceDataUri}}
Genre: {{{genre}}}
Tempo: {{{tempo}}}
Tone: {{{tone}}}

Return the enhanced singing voice as a base64 encoded data URI.

Make sure the output adheres to the following schema:
${JSON.stringify(EnhanceVoiceAndSingOutputSchema.shape, null, 2)}`,
});

const enhanceVoiceAndSingFlow = ai.defineFlow(
  {
    name: 'enhanceVoiceAndSingFlow',
    inputSchema: EnhanceVoiceAndSingInputSchema,
    outputSchema: EnhanceVoiceAndSingOutputSchema,
  },
  async input => {
    const {output} = await enhanceVoiceAndSingPrompt(input);
    return output!;
  }
);
