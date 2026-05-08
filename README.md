# 🎤 VocalCraft AI

![VocalCraft AI Banner](https://via.placeholder.com/1200x300?text=VocalCraft+AI+-+Your+Personal+AI+Music+Producer)

VocalCraft AI transforms your raw vocal recordings into studio-quality songs using advanced AI models. It acts as your personal AI music producer, providing intelligent processing and generation to bring your musical vision to life.

## ✨ Features

- **🎙️ AI Vocal Enhancement**: Automatic pitch correction, noise reduction, and equalization to make your voice shine.
- **🎸 Genre-Aware Styling**: Style your track with genres like Pop, R&B, Hip-Hop, Afrobeats, Gospel, and Soul.
- **⚡ Instant Synthesis**: Go from raw vocals to a fully synthesized song in minutes.
- **🎛️ Custom Tone Selection**: Fine-tune your sound by choosing from voice tones like 'soft', 'deep', 'bright', or 'raspy'.
- **⏱️ Tempo Matching**: Intelligently aligns your lyrical performance to your chosen tempo (slow, mid, fast).

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **AI Integration:** [Firebase Genkit](https://firebase.google.com/docs/genkit), Google Gemini, Replicate (MusicGen)
- **Backend/Hosting:** [Firebase](https://firebase.google.com/)

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed and configured before starting:

- **Node.js** 20+
- A **Replicate API Token** (for MusicGen synthesis)
- A **Google Gemini API Key** (for Genkit flows)
- A **Firebase Project** set up

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/vocalcraft-ai.git
   cd vocalcraft-ai
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your API tokens:

   ```env
   REPLICATE_API_TOKEN=your_replicate_token_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:9002](http://localhost:9002) with your browser to see the application.

## 🧠 How it Works

1. **Upload Your Voice**: Provide your lyrics and upload a simple recording of your raw voice.
2. **Choose Your Style**: Select the musical genre, tempo, and vocal tone that matches your artistic vision.
3. **Generate & Download**: The AI uses Replicate and Firebase Genkit flows to produce your instrumental, synthesize the final audio, and make it available for download.

## 📜 Available Scripts

- `npm run dev` - Starts the Next.js development server on port 9002 using Turbopack.
- `npm run genkit:dev` - Starts the Genkit UI and development server for AI flows.
- `npm run genkit:watch` - Starts the Genkit development server with hot-reloading.
- `npm run build` - Builds the application for production.
- `npm run lint` - Runs Next.js linting to ensure code quality.
- `npm run typecheck` - Runs TypeScript compilation without emitting files to check for type errors.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
