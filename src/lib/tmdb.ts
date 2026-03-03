const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

async function safeFetch(url: string, retries = 2) {
  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("TMDB Response Error:", res.status);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("TMDB Network Error:", error);

    if (retries > 0) {
      console.log("Retrying TMDB request...");
      return safeFetch(url, retries - 1);
    }

    if (retries === 0) {
        console.error("TMDB Final Failure:", error);
    }

    return null;
  }
}

export async function findMovieByImdb(imdbId: string) {
  const data = await safeFetch(
    `${TMDB_BASE_URL}/find/${imdbId}?external_source=imdb_id&api_key=${API_KEY}`
  );

  return data?.movie_results?.[0] || null;
}

export async function getMovieDetails(movieId: number) {
  return await safeFetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
  );
}

export async function getMovieCredits(movieId: number) {
  return await safeFetch(
    `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
  );
}

export async function getMovieReviews(movieId: number) {
  return await safeFetch(
    `${TMDB_BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}`
  );
}