import { useCallback, useEffect, useMemo, useState } from 'react';
import { ALL_GENRES, MOVIES } from '../data/movies.js';
import { browseMovies, isFavorite, toggleFavorite } from '../lib/movies.js';

export const FAVORITES_STORAGE_KEY = 'react-movie-search.favorites';

function load(storage) {
  try {
    const raw = storage.getItem(FAVORITES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useMovies(storage = globalThis.localStorage) {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('all');
  const [favorites, setFavorites] = useState(() => load(storage));
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    try {
      storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      /* ignore */
    }
  }, [favorites, storage]);

  const results = useMemo(() => browseMovies(MOVIES, { query, genre }), [query, genre]);

  const selected = useMemo(
    () => results.find((movie) => movie.id === selectedId) ?? null,
    [results, selectedId],
  );

  const favoriteMovies = useMemo(
    () => MOVIES.filter((movie) => favorites.includes(movie.id)),
    [favorites],
  );

  const toggleFav = useCallback((id) => {
    setFavorites((prev) => toggleFavorite(prev, id));
  }, []);

  return {
    query,
    setQuery,
    genre,
    setGenre,
    genres: ALL_GENRES,
    results,
    favorites,
    favoriteMovies,
    isFavorite: (id) => isFavorite(favorites, id),
    toggleFav,
    selected,
    selectedId,
    select: setSelectedId,
    clearSelection: () => setSelectedId(null),
  };
}
