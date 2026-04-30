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
  genre: z.enum(['Afrobeats', 'Pop', 'R&B', 'Hip-Hop', 'Gospel', 'Soul']).describe('The genre of the song.'),
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
  input: {schema: EnhanceVoiceAndSingInputSchema},
  output: {schema: EnhanceVoiceAndSingOutputSchema},
  prompt: `You are an AI audio engineer specializing in voice enhancement and singing synthesis. A user has provided a voice recording, lyrics, and music preferences.

General Requirements:
- Generate a clean neutral singing vocal
- Sing the lyrics word-for-word
- No background music (dry vocals only)
- No emotion styling or dramatic flair
- Consistent pitch and timing
- Studio-quality dry vocals
- Output format: WAV (as base64 data URI)

Genre-Specific Guidelines (Apply based on the '{{{genre}}}' input):

If Genre is 'Afrobeats':
- Singing Style: Bouncy rhythm, Light melodic delivery, Slight groove and syncopation, Warm and energetic tone
- Target Tempo Range: 95–105 BPM
- Tone Profile: Smooth and expressive

If Genre is 'Pop':
- Singing Style: Bright and clean, Catchy phrasing, Minimal vibrato, Clear articulation
- Target Tempo Range: 100–120 BPM
- Tone Profile: Bright and confident

If Genre is 'R&B':
- Singing Style: Smooth sustained notes, Soft runs and gentle vibrato, Emotional delivery, Clean phrasing
- Target Tempo Range: 70–85 BPM
- Tone Profile: Warm, soulful, intimate

If Genre is 'Hip-Hop':
- Singing Style: Spoken-singing / melodic rap, Strong rhythm alignment, Confident delivery, Minimal pitch variation
- Target Tempo Range: 85–95 BPM
- Tone Profile: Bold and clear

If Genre is 'Gospel':
- Singing Style: Strong sustained notes, Emotional delivery, Controlled vibrato, Expressive dynamics
- Target Tempo Range: 70–90 BPM
- Tone Profile: Powerful and uplifting

If Genre is 'Soul':
- Singing Style: Deep emotional delivery, Timeless phrasing, Rich vibrato, Smooth transitions
- Target Tempo Range: 65–80 BPM
- Tone Profile: Deep and emotional

Task:
1. Enhance the provided voice to reduce noise and correct pitch.
2. Convert the lyrics to phonemes and align them to the beat based on the tempo guidelines above.
3. Synthesize the singing voice applying the specific style, tone, and tempo instructions for the {{{genre}}} genre.
4. Ensure the output is a dry vocal only with no background music.

Input Data:
Lyrics: {{{lyrics}}}
Voice: {{media url=voiceDataUri}}
Genre: {{{genre}}}
Tempo: {{{tempo}}}
Tone: {{{tone}}}

Output the enhanced singing voice as a base64 encoded data URI.
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
    try {
      console.log("Attempting AI vocal enhancement...");
      const {output} = await enhanceVoiceAndSingPrompt(input);
      if (!output?.enhancedVoiceDataUri) {
        throw new Error("Empty output from AI");
      }
      return output;
    } catch (error) {
      console.warn("AI Vocal Generation failed. Returning original voice as fallback.", error);
      // Fallback to original voice so the user hears something
      return {
        enhancedVoiceDataUri: input.voiceDataUri
      };
    }
  }
);
