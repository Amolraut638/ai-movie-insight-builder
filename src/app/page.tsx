"use client";

import { useState } from "react";

export default function Home() {
  const [imdbId, setImdbId] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMovie = async () => {
    if (!imdbId) {
      setError("Please enter an IMDb ID");
      return;
    }

    // IMDb format validation
    const imdbRegex = /^tt\d{7,8}$/;

    if (!imdbRegex.test(imdbId.trim())) {
      setError("Invalid IMDb ID format. Example: tt0133093");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setData(null);

      const res = await fetch("/api/movie-insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imdbId: imdbId.trim() }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen text-white px-6 py-12 relative transition-all duration-500"
      style={
        data?.backdrop
          ? {
              backgroundImage: `url(${data.backdrop})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { backgroundColor: "black" }
      }
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      <div className="relative max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-10">
          AI Movie <span className="text-teal-500">Insight Builder</span>
        </h1>

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
          <input
            type="text"
            placeholder="Enter IMDb ID (e.g., tt0133093)"
            value={imdbId}
            onChange={(e) => setImdbId(e.target.value)}
            className="w-full sm:w-2/3 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          />
          <button
            onClick={fetchMovie}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:scale-105 transition transform font-semibold"
          >
            Analyze
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center mt-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-8 bg-red-900/40 border border-red-700 text-red-300 p-6 rounded-2xl text-center backdrop-blur-md">
            <h3 className="text-lg font-semibold mb-2">⚠️ Oops!</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Movie Data */}
        {data && (
          <div className="bg-gray-900/90 p-8 rounded-2xl shadow-2xl border border-gray-800 transition-all duration-500">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Poster */}
              <div className="w-72">
                {data.poster ? (
                  <img
                    src={data.poster}
                    alt={data.title}
                    className="w-full rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                    No Poster Available
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-3 text-yellow-600">
                  {data.title} ({data.releaseYear})
                </h2>

                <div className="flex items-center gap-2 mb-3 text-lg">
                  <img
                    width="22"
                    height="22"
                    src="https://img.icons8.com/color/96/filled-star--v1.png"
                    alt="Rating"
                  />
                  <span className="font-semibold">{data.rating}</span>
                </div>

                <p className="text-gray-300 leading-relaxed mb-6">
                  {data.overview}
                </p>

                {/* Cast */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-6">
                  {data.cast.map((member: any) => (
                    <div
                      key={member.id}
                      className="bg-gray-800/70 backdrop-blur-md rounded-2xl p-4 text-center hover:scale-105 transition duration-300 shadow-lg"
                    >
                      {member.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w342${member.profile_path}`}
                          alt={member.name}
                          className="w-full aspect-[2/3] object-cover rounded-xl mb-3"
                        />
                      ) : (
                        <div className="w-full aspect-[2/3] bg-gray-700 rounded-xl mb-3 flex items-center justify-center text-sm text-gray-400">
                          No Image
                        </div>
                      )}

                      <p className="font-semibold text-sm">{member.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {member.character}
                      </p>
                    </div>
                  ))}
                </div>

                {/* AI Section */}
                <div className="mt-6 p-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl shadow-inner">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      width="26"
                      height="26"
                      src="https://img.icons8.com/liquid-glass/48/bard.png"
                      alt="AI Icon"
                      className="opacity-80"
                    />
                    <h3 className="text-xl font-semibold">
                      AI Audience Insight
                    </h3>
                  </div>

                  <p className="mb-4 text-gray-300 leading-relaxed">
                    {data.aiSummary}
                  </p>

                  <span
                    className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${
                      data.sentiment === "Positive"
                        ? "bg-green-600"
                        : data.sentiment === "Negative"
                          ? "bg-red-600"
                          : "bg-yellow-600"
                    }`}
                  >
                    {data.sentiment}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
