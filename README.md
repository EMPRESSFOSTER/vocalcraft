# VocalCraft AI

VocalCraft AI transforms your raw vocal recordings into studio-quality songs using advanced AI models. It acts as your personal AI music producer, providing intelligent processing and generation to bring your musical vision to life.

## Features

- **AI Vocal Enhancement**: Automatic pitch correction, noise reduction, and equalization to make your voice shine.
- **Genre-Aware Styling**: Style your track with genres like Pop, R&B, Hip-Hop, Afrobeats, Gospel, and Soul.
- **Instant Synthesis**: Go from raw vocals to a fully synthesized song in minutes.
- **Custom Tone Selection**: Fine-tune your sound by choosing from voice tones like 'soft', 'deep', 'bright', or 'raspy'.
- **Tempo Matching**: Intelligently aligns your lyrical performance to your chosen tempo (slow, mid, fast).

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS, shadcn/ui, Radix UI
- **AI Integration:** Firebase Genkit, Google Gemini, Replicate (MusicGen)
- **Backend/Hosting:** Firebase, Firebase App Hosting

## Getting Started

### Prerequisites

- Node.js 20+
- A Replicate API Token
- Firebase project setup

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables. Create a `.env.local` file in the root directory and add your tokens (e.g., Replicate API token, Firebase configuration if required):
   ```env
   REPLICATE_API_TOKEN=your_replicate_token_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:9002](http://localhost:9002) with your browser to see the application.

## How it Works

1. **Upload Your Voice**: Provide your lyrics and upload a simple recording of your voice.
2. **Choose Your Style**: Select the genre, tempo, and vocal tone that matches your artistic vision.
3. **Generate & Download**: The AI uses Replicate and Genkit flows to produce your instrumental and synthesize the final audio, available for download.

## Scripts

- `npm run dev` - Starts the Next.js development server on port 9002.
- `npm run genkit:dev` - Starts the Genkit UI and development server for AI flows.
- `npm run build` - Builds the application for production.
- `npm run lint` - Runs Next.js linting.
