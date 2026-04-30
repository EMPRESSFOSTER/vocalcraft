'use server';

import { enhanceVoiceAndSing, EnhanceVoiceAndSingInput } from '@/ai/flows/enhance-voice-and-sing';
import { generateInstrumental, GenerateInstrumentalInput } from '@/ai/flows/generate-instrumental';
import { suggestGenre, SuggestGenreInput } from '@/ai/flows/suggest-genre';
import { z } from 'zod';

const generateSongSchema = z.object({
  lyrics: z.string().min(10, "Lyrics must be at least 10 characters long."),
  voiceDataUri: z.string().min(1, "A voice recording is required."),
  genre: z.enum(['Afrobeats', 'Pop', 'R&B', 'Hip-Hop', 'Gospel', 'Soul']),
  tempo: z.enum(['slow', 'mid', 'fast']),
  tone: z.enum(['soft', 'deep', 'bright', 'raspy']),
});

export async function generateSongAction(values: z.infer<typeof generateSongSchema>) {
  const validatedFields = generateSongSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid input.",
    };
  }

  const input: EnhanceVoiceAndSingInput = validatedFields.data;

  try {
    console.log("Generating song metadata with Gemini...", input.lyrics.substring(0, 30));
    
    // Step 1: Vocal processing
    const vocalResult = await enhanceVoiceAndSing(input);
    console.log("Vocal processing complete. Data received length:", vocalResult.enhancedVoiceDataUri.length);

    // Step 2: Instrumental generation
    const instrumentalResult = await generateInstrumental({
      genre: input.genre,
      tempo: input.tempo,
      tone: input.tone,
      lyrics: input.lyrics
    });
    console.log("Instrumental generation complete. Data received length:", instrumentalResult.instrumentalDataUri.length);
    
    // We combine the results
    const result = { 
        enhancedVoiceDataUri: vocalResult.enhancedVoiceDataUri,
        instrumentalDataUri: instrumentalResult.instrumentalDataUri
    };

    console.log("Returning successful result to UI");
    return { success: true, data: result };

  } catch (error: any) {
    console.error("AI song generation failed:", error);
    return {
      error: error?.message || "Failed to generate the song. Please try again later.",
    };
  }
}

const suggestGenreSchema = z.object({
    lyrics: z.string().min(10, "Lyrics must be at least 10 characters long."),
});

export async function suggestGenreAction(values: z.infer<typeof suggestGenreSchema>) {
    const validatedFields = suggestGenreSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Please provide enough lyrics to suggest a genre.",
        };
    }
    
    const input: SuggestGenreInput = validatedFields.data;

    try {
        console.log("Suggesting genre for lyrics:", input.lyrics.substring(0, 30));
        const result = await suggestGenre(input);
        console.log("AI suggested genre:", result.genre);
        return { success: true, data: result };
    } catch (error) {
        console.error("AI genre suggestion failed:", error);
        return {
            error: "Failed to suggest a genre. Please try again.",
        };
    }
}
