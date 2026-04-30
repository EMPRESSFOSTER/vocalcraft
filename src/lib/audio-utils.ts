/**
 * Utility to estimate song metrics (duration, timeline) based on lyrics and BPM.
 * Inspired by the user's provided analysis logic.
 */

export interface WordMap {
    word: string;
    start: number;
    end: number;
    pitch?: string;
}

export function analyzeLyrics(lyrics: string, bpm: number) {
    const lines = lyrics.split('\n').filter(l => l.trim().length > 0);
    let timeline = 0;
    const songMap: WordMap[] = [];

    const countSyllables = (word: string): number => {
        const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
        if (cleaned.length <= 3) return 1;
        const matches = cleaned.match(/[aeiouy]{1,2}/g);
        return matches ? matches.length : 1;
    };

    for (const line of lines) {
        const words = line.split(/\s+/).filter(w => w.trim().length > 0);
        for (const word of words) {
            const syllables = countSyllables(word);
            // duration = (60 / bpm) * syllables
            const duration = (60 / bpm) * syllables;
            
            songMap.push({
                word,
                start: timeline,
                end: timeline + duration,
            });

            timeline += duration;
        }
        // pause after line
        timeline += 0.5; 
    }

    return {
        songMap,
        totalDuration: timeline,
    };
}
