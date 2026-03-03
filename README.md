# AI Movie Insight Builder

A full-stack web app that lets you enter any IMDb movie ID and instantly get rich movie details powered by AI-driven sentiment analysis.

---

## What It Does

Enter an IMDb ID (like `tt0133093`) and the app fetches:

- Movie title, poster, and backdrop
- Full cast list with profile images
- Release year and IMDb rating
- Short plot summary
- AI-generated summary of what audiences think
- Overall sentiment classification — Positive, Mixed, or Negative

---

## Tech Stack

**Frontend** — Next.js (App Router), React, Tailwind CSS  
**Backend** — Next.js API Routes  
**Movie Data** — TMDB API  
**AI** — Groq AI (for sentiment analysis)

### Why this stack?

Next.js handles both frontend and backend in a single project, which keeps things clean and avoids unnecessary complexity. Tailwind makes styling fast. TMDB is the most reliable free source for movie metadata and reviews. Groq gives fast AI inference without the latency of heavier models.

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/ai-movie-insight-builder.git
cd ai-movie-insight-builder
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project:
```
TMDB_API_KEY=your_tmdb_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

You can get a free TMDB API key at [themoviedb.org](https://www.themoviedb.org/settings/api) and a Groq key at [console.groq.com](https://console.groq.com).

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Assumptions

- Movie data (metadata, cast, reviews) is fetched via the TMDB API. Direct IMDb scraping was intentionally avoided to keep the app stable and within ToS.
- Reviews from TMDB are passed to Groq AI for summarization and sentiment classification.
- The app assumes a valid IMDb ID format (starts with `tt` followed by digits). Basic validation is in place for incorrect formats and empty inputs.

---

## Project Structure
```
/app
  /api
    /movie        → API route to fetch movie details from TMDB
    /sentiment    → API route to run AI sentiment analysis via Groq
  /components     → Reusable UI components (MovieCard, SentimentBadge, etc.)
  /page.tsx       → Main page with search input and results
/lib
  tmdb.ts         → TMDB API helper functions
  groq.ts         → Groq AI helper functions
```

---

## Deployment

Live demo: [your-app.vercel.app](https://your-app.vercel.app)

Deployed on Vercel. To deploy your own:

1. Push the repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add `TMDB_API_KEY` and `GROQ_API_KEY` in the Vercel environment variables settings
4. Deploy

---

## Notes

- Handles invalid IMDb IDs and API errors gracefully with user-friendly messages
- Fully responsive — works on mobile and desktop
- Built as part of the Brew Full-Stack Developer Internship hiring assignment
