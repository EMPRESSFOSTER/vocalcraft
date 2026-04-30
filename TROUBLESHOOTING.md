# VocalCraft AI - Troubleshooting & New Features

## Issues Fixed

### 1. Suggest Genre Button

**Problem**: The button wasn't providing feedback when clicked
**Solution**:

- Added comprehensive error handling with try-catch blocks
- Added console logging for debugging
- Added toast notifications for all scenarios (success, error, validation)
- Improved error messages to be more descriptive

### 2. Configuration Issues

**Diagnosis Tools Created**:

- `test-suggest-genre.js` - Tests the Gemini API directly
- Better logging throughout the application

**To test if your API is working**:

```bash
node test-suggest-genre.js
```

## New Feature: Model Selection & Testing

### What's New

Users can now select and test different AI models before generating their full song!

### How to Access

1. Navigate to: `http://localhost:9002/test-models`
2. Or add a link in your navigation

### Available Options

#### Voice Models:

- **Neutral Voice**: Clean, balanced vocal tone
- **Warm Voice**: Rich, soulful vocal quality
- **Bright Voice**: Clear, energetic vocal tone
- **Deep Voice**: Low, powerful vocal presence

#### Instrumental Styles:

- **Afrobeats**: African percussion, high-life guitars, vibrant synths
- **Pop**: Catchy synths, drums, radio-friendly
- **R&B**: Smooth electric piano, atmospheric pads
- **Hip-Hop**: Punchy drums, deep bass, minimal melody
- **Gospel**: Piano, organ, choir pads, uplifting
- **Soul**: Vintage piano, bass, live drums, strings

### How to Use

1. Select a voice model from the dropdown
2. Choose an instrumental style
3. Click "Test Selected Models"
4. Review the results
5. Use these settings in your main song generation

## Debugging Steps

If generation still isn't working:

### Step 1: Check API Keys

```bash
# In PowerShell
Get-Content .env.local | Select-String "API"
```

You should see:

- `GOOGLE_GENAI_API_KEY=...`
- `REPLICATE_API_TOKEN=...`

### Step 2: Test Gemini API

```bash
node test-suggest-genre.js
```

Expected output:

```
✓ API Key found: AIzaSy...
🧪 Testing Genre Suggestion...
✓ Suggested Genre: Pop
```

### Step 3: Check Server Logs

When you click "Suggest Genre", check your terminal for:

```
Suggesting genre for lyrics: In the city lights...
AI suggested genre: Pop
```

### Step 4: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Click "Suggest Genre"
4. Look for any red error messages

## Common Issues & Solutions

### Issue: "Failed to suggest a genre"

**Cause**: Gemini API key issue or quota exceeded
**Solution**:

1. Verify API key in `.env.local`
2. Check quota at https://aistudio.google.com/
3. Try creating a new API key

### Issue: "Generation Failed" with Replicate

**Cause**: Replicate API token issue
**Solution**:

1. Verify token in `.env.local`: `REPLICATE_API_TOKEN=r8_...`
2. Check quota at https://replicate.com/account

### Issue: Button doesn't respond

**Cause**: JavaScript error or validation failure
**Solution**:

1. Check browser console for errors
2. Ensure you have at least 20 characters of lyrics
3. Clear browser cache and reload

## Next Steps

1. **Test the API**: Run `node test-suggest-genre.js`
2. **Try Model Tester**: Visit `/test-models` page
3. **Check Logs**: Look at terminal output when clicking buttons
4. **Report Back**: Share any error messages you see

## File Locations

- Model Tester Component: `src/components/model-tester.tsx`
- Model Tester Page: `src/app/test-models/page.tsx`
- Song Creation Form: `src/components/song-creation-form.tsx`
- API Test Script: `test-suggest-genre.js`
