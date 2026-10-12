import { describe, it, expect } from 'vitest';
import { MOVIES, ALL_GENRES, getMovie } from './movies.js';
import {
  browseMovies,
  filterByGenre,
  formatRuntime,
  isFavorite,
  posterHue,
  searchMovies,
  toggleFavorite,
  topRated,
} from '../lib/movies.js';

describe('movie data', () => {
  it('has unique ids and complete records', () => {
    const ids = MOVIES.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const movie of MOVIES) {
      expect(movie.title).toBeTruthy();
      expect(movie.genres.length).toBeGreaterThan(0);
    }
  });

  it('exposes sorted genres and getMovie', () => {
    expect(ALL_GENRES).toEqual([...ALL_GENRES].sort());
    expect(getMovie('inception').title).toBe('Inception');
    expect(getMovie('nope')).toBeNull();
  });
});

describe('searchMovies', () => {
  it('returns everything for an empty query', () => {
    expect(searchMovies(MOVIES, '')).toHaveLength(MOVIES.length);
    expect(searchMovies(MOVIES, '   ')).toHaveLength(MOVIES.length);
  });

  it('matches titles case-insensitively', () => {
    expect(searchMovies(MOVIES, 'inter').map((m) => m.id)).toEqual(['interstellar']);
  });

  it('ranks title-prefix matches above mid-title matches', () => {
    const sample = [
      { title: 'Kite Runner', rating: 9.5 },
      { title: 'The Kite', rating: 6.0 },
    ];
    expect(searchMovies(sample, 'kite').map((m) => m.title)).toEqual(['Kite Runner', 'The Kite']);
  });

  it('sorts equally-ranked matches by rating', () => {
    const sample = [
      { title: 'Dune Two', rating: 6.0 },
      { title: 'Dune One', rating: 9.0 },
    ];
    expect(searchMovies(sample, 'dune').map((m) => m.title)).toEqual(['Dune One', 'Dune Two']);
  });

  it('does not mutate the source list', () => {
    const before = [...MOVIES];
    searchMovies(MOVIES, 'the');
    expect(MOVIES).toEqual(before);
  });
});

describe('filterByGenre / browseMovies', () => {
  it('filters by genre and treats all as a pass-through', () => {
    expect(filterByGenre(MOVIES, 'Sci-Fi').every((m) => m.genres.includes('Sci-Fi'))).toBe(true);
    expect(filterByGenre(MOVIES, 'all')).toHaveLength(MOVIES.length);
  });

  it('sorts by rating descending when there is no query', () => {
    const results = browseMovies(MOVIES, {});
    expect(results[0].rating).toBeGreaterThanOrEqual(results[1].rating);
  });

  it('combines query and genre', () => {
    const results = browseMovies(MOVIES, { query: 'the', genre: 'Sci-Fi' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((m) => m.genres.includes('Sci-Fi') && m.title.toLowerCase().includes('the'))).toBe(true);
  });
});

describe('favorites', () => {
  it('toggles ids on and off without mutating the input', () => {
    const start = [];
    const added = toggleFavorite(start, 'dune');
    expect(added).toEqual(['dune']);
    expect(start).toEqual([]);
    expect(toggleFavorite(added, 'dune')).toEqual([]);
  });

  it('reports membership', () => {
    expect(isFavorite(['dune'], 'dune')).toBe(true);
    expect(isFavorite(['dune'], 'arrival')).toBe(false);
  });
});

describe('formatting helpers', () => {
  it('formats runtime with and without hours', () => {
    expect(formatRuntime(106)).toBe('1h 46m');
    expect(formatRuntime(45)).toBe('45m');
  });

  it('returns the top rated titles', () => {
    const top = topRated(MOVIES, 2);
    expect(top).toHaveLength(2);
    expect(top[0].rating).toBeGreaterThanOrEqual(top[1].rating);
  });

  it('returns a stable hue in range', () => {
    for (const movie of MOVIES) {
      const hue = posterHue(movie.id);
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThan(360);
      expect(posterHue(movie.id)).toBe(hue);
    }
  });
});
