// src/ai/flows/suggest-genre.ts
'use server';
/**
 * @fileOverview A flow that suggests a music genre based on lyrics.
 *
 * - suggestGenre - A function that suggests a music genre based on lyrics.
 * - SuggestGenreInput - The input type for the suggestGenre function.
 * - SuggestGenreOutput - The return type for the suggestGenre function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestGenreInputSchema = z.object({
  lyrics: z.string().describe('The lyrics of the song.'),
});
export type SuggestGenreInput = z.infer<typeof SuggestGenreInputSchema>;

const SuggestGenreOutputSchema = z.object({
  genre: z.string().describe('The suggested music genre for the lyrics.'),
});
export type SuggestGenreOutput = z.infer<typeof SuggestGenreOutputSchema>;

export async function suggestGenre(input: SuggestGenreInput): Promise<SuggestGenreOutput> {
  return suggestGenreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestGenrePrompt',
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
  input: {schema: SuggestGenreInputSchema},
  output: {schema: SuggestGenreOutputSchema},
  prompt: `You are a music genre expert. Given the following lyrics, suggest the most appropriate music genre from this list: Afrobeats, Pop, R&B, Hip-Hop, Gospel, Soul.
Only return the name of the genre.

Lyrics: {{{lyrics}}}

Genre:`,
});

const suggestGenreFlow = ai.defineFlow(
  {
    name: 'suggestGenreFlow',
    inputSchema: SuggestGenreInputSchema,
    outputSchema: SuggestGenreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
