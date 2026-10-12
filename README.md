# React Movie Search

A movie browsing app built with React hooks. Search titles, filter by genre, open
a details panel and keep a favorites list that persists across reloads.

To keep the app fully deterministic (and offline), the catalogue lives in
`src/data/movies.js` instead of hitting a network API — the search and filter
logic is plain functions and is unit tested in isolation.

## Features

- Title search, case-insensitive, with prefix matches ranked first
- Genre filter chips (combinable with the search query)
- Result count and a friendly empty state
- Movie cards with a generated poster, year, runtime and rating
- Details panel with overview and genre tags
- Favorites with a dedicated list, toggled from a card, the details panel or the list
- Persistence via `localStorage` (injectable storage for tests)

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm test         # run the test suite once
npm run build    # production build into dist/
```

## Project layout

```
src/data/movies.js       Offline catalogue + ALL_GENRES + getMovie
src/lib/movies.js        Pure helpers: searchMovies, filterByGenre, browseMovies,
                         toggleFavorite, isFavorite, formatRuntime, topRated, posterHue
src/hooks/useMovies.js   Query, genre, favorites and selection state
src/App.jsx              Search, chips, grid, details panel, favorites
src/styles.css           Styling
vite.config.js           Vite + Vitest configuration
```

### Design notes

- `searchMovies(movies, query)` returns a new array; prefix matches sort above
  mid-title matches, ties broken by rating, then title.
- `browseMovies(movies, { query, genre })` composes search + genre filter. With no
  query it presents the highest-rated titles first.
- Poster artwork is a deterministic gradient derived from the movie id
  (`posterHue`), so the same title always looks the same.
- `useMovies` accepts a `storage` argument (defaults to `localStorage`).

## Tests

```bash
npm test
```

Covers the catalogue (unique ids, genre list, lookups), search ranking and
non-mutation, genre filtering and composition, favorite toggling, runtime
formatting, top-rated selection and stable poster hues, plus the full component
flow (search, empty state, genre chip, details open/close, favorites and
persistence).

## License

MIT
