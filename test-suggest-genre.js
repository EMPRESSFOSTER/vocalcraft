require('dotenv').config({ path: '.env.local' });

async function testGenreSuggestion() {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
        console.error('❌ No API key found!');
        return;
    }
    
    console.log('✓ API Key found:', apiKey.substring(0, 10) + '...');
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const testLyrics = "In the city lights, dancing through the night, feeling so alive";
    
    try {
        console.log('\n🧪 Testing Genre Suggestion...');
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a music genre expert. Given the following lyrics, suggest the most appropriate music genre from this list: Afrobeats, Pop, R&B, Hip-Hop, Gospel, Soul.
Only return the name of the genre.

Lyrics: ${testLyrics}

Genre:`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 100,
                },
                safetySettings: [
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
                ]
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            console.error('❌ API Error:', data.error.message);
            return;
        }
        
        if (data.candidates && data.candidates[0]) {
            const genre = data.candidates[0].content.parts[0].text.trim();
            console.log('✓ Suggested Genre:', genre);
        } else {
            console.error('❌ Unexpected response:', JSON.stringify(data, null, 2));
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testGenreSuggestion();
