# **App Name**: VocalCraft AI

## Core Features:

- User Authentication: Secure user authentication via Firebase Auth (email/password, Google) and anonymous access with limited functionality.
- Song Creation Form: Collect song preferences in a structured, step-by-step form that has dedicated areas for lyric entry, voice recording/uploading, genre selection, tempo selection and tone selection.
- Audio Upload and Storage: Handles uploading and secure storage of raw user voice input to Firebase Storage.
- AI Voice Enhancement and Singing Synthesis: Utilizes an AI tool within Firebase Cloud Functions to enhance voice quality, convert lyrics to phonemes, align lyrics to tempo, generate a singing voice, and apply style presets based on genre. Stores processed output back in Storage.
- Project Storage: The project information is saved to the Firestore database including the song's metadata, AI generation status, the generated song link, and all related project information.
- Result Page: The audio result page can be used to stream and download AI-generated songs; with regenerate button and process tracking indicator
- Security Measures: Enforce security measures and privacy standards through Firebase Security Rules.

## Style Guidelines:

- Primary color: A vibrant blue (#29ABE2) to convey innovation and a modern feel.
- Background color: Light gray (#F0F2F5), desaturated, for a clean and unobtrusive backdrop.
- Accent color: A vivid green (#90EE90), analogous, to indicate successful processes and enhance the UI with visual cues.
- Body and headline font: 'Inter', sans-serif, a grotesque-style font that is neutral and modern.
- Use simple, outlined icons for easy recognition and a modern aesthetic.
- Implement a clean, step-by-step layout to guide users through the song creation process.
- Use subtle animations for loading states to keep users engaged during processing.