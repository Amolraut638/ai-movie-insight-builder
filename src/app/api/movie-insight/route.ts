import { NextResponse } from "next/server";
import {
  findMovieByImdb,
  getMovieDetails,
  getMovieCredits,
  getMovieReviews,
} from "../../../lib/tmdb";
import { analyzeReviews } from "../../../lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imdbId } = body;

    if (!imdbId) {
      return NextResponse.json(
        { error: "IMDb ID is required" },
        { status: 400 }
      );
    }

    // Convert IMDb to TMDB ID
    const movie = await findMovieByImdb(imdbId);

    if (!movie || !movie.id) {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404 }
      );
    }

    const movieId = movie.id;

    // Fetch movie data
    const [details, credits, reviews] = await Promise.all([
      getMovieDetails(movieId),
      getMovieCredits(movieId),
      getMovieReviews(movieId),
    ]);

    if (!details) {
      return NextResponse.json(
        { error: "Failed to fetch movie details" },
        { status: 500 }
      );
    }

    // Extract review text safely
    const reviewTexts =
      reviews?.results?.slice(0, 5)?.map((r: any) => r.content) || [];

    // Only call AI if reviews exist
    let aiResult = {
      summary: "No audience reviews available for analysis.",
      sentiment: "Mixed",
    };

    if (reviewTexts.length > 0) {
      aiResult = await analyzeReviews(reviewTexts);
    }

    return NextResponse.json({
      title: details.title ?? null,
      poster: details.poster_path
        ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
        : null,
      backdrop: details?.backdrop_path
        ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
        : null,
      releaseYear: details.release_date
        ? details.release_date.split("-")[0]
        : null,
      rating: details.vote_average ?? null,
      overview: details.overview ?? null,
      cast: credits?.cast?.slice(0, 5) ?? [],
      reviews: reviews?.results?.slice(0, 5) ?? [],
      aiSummary: aiResult.summary,
      sentiment: aiResult.sentiment,
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}