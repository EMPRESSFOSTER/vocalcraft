'use server';

import { enhanceVoiceAndSing, EnhanceVoiceAndSingInput } from '@/ai/flows/enhance-voice-and-sing';
import { suggestGenre, SuggestGenreInput } from '@/ai/flows/suggest-genre';
import { z } from 'zod';

const generateSongSchema = z.object({
  lyrics: z.string().min(10, "Lyrics must be at least 10 characters long."),
  voiceDataUri: z.string().min(1, "A voice recording is required."),
  genre: z.enum(['Afrobeats', 'Pop', 'R&B', 'Hip-Hop', 'Gospel']),
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
    // To simulate a real-world scenario, we'll return a mock audio file after a delay.
    // In a production app, you would uncomment the line below to call the actual AI flow.
    // const result = await enhanceVoiceAndSing(input);
    
    console.log("Simulating AI song generation with input:", input);
    await new Promise(resolve => setTimeout(resolve, 5000));

    // This is a placeholder for a real audio file data URI.
    // It's a short, silent WAV file encoded in Base64 to prevent errors.
    const mockAudioDataUri = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
    
    const result = { enhancedVoiceDataUri: mockAudioDataUri };

    return { success: true, data: result };

  } catch (error) {
    console.error("AI song generation failed:", error);
    return {
      error: "Failed to generate the song. Please try again later.",
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
        const result = await suggestGenre(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("AI genre suggestion failed:", error);
        return {
            error: "Failed to suggest a genre. Please try again.",
        };
    }
}
