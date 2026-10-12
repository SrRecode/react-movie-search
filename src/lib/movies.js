/** Pure movie helpers. No React, no DOM — unit-testable in isolation. */

export function searchMovies(movies, query) {
  const q = String(query ?? '').trim().toLowerCase();
  if (!q) return [...movies];
  return movies
    .filter((movie) => movie.title.toLowerCase().includes(q))
    .sort((a, b) => {
      const aStarts = a.title.toLowerCase().startsWith(q) ? 1 : 0;
      const bStarts = b.title.toLowerCase().startsWith(q) ? 1 : 0;
      if (aStarts !== bStarts) return bStarts - aStarts;
      if (b.rating !== a.rating) return b.rating - a.rating;
      return a.title.localeCompare(b.title);
    });
}

export function filterByGenre(movies, genre) {
  if (!genre || genre === 'all') return [...movies];
  return movies.filter((movie) => movie.genres.includes(genre));
}

/** Apply a text query and an optional genre filter, then sort by rating desc. */
export function browseMovies(movies, { query = '', genre = 'all' } = {}) {
  const matched = filterByGenre(searchMovies(movies, query), genre);
  // searchMovies already ranks by relevance when there is a query; without a
  // query we present the highest rated titles first.
  if (!String(query).trim()) {
    matched.sort((a, b) => b.rating - a.rating);
  }
  return matched;
}

export function toggleFavorite(favorites, id) {
  return favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
}

export function isFavorite(favorites, id) {
  return favorites.includes(id);
}

export function formatRuntime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

export function topRated(movies, count = 3) {
  return [...movies].sort((a, b) => b.rating - a.rating).slice(0, count);
}

/** Deterministic hue from an id, used for placeholder poster gradients. */
export function posterHue(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) % 360;
  }
  return hash;
}
