import { useMovies } from './hooks/useMovies.js';
import { formatRuntime, posterHue } from './lib/movies.js';

function Poster({ movie, size = 'md' }) {
  const hue = posterHue(movie.id);
  return (
    <span
      className={`poster poster--${size}`}
      style={{
        background: `linear-gradient(140deg, hsl(${hue} 55% 32%), hsl(${(hue + 40) % 360} 45% 18%))`,
      }}
      aria-hidden="true"
    >
      {movie.title
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)}
    </span>
  );
}

export default function App({ storage } = {}) {
  const {
    query,
    setQuery,
    genre,
    setGenre,
    genres,
    results,
    favoriteMovies,
    isFavorite,
    toggleFav,
    selected,
    select,
    clearSelection,
  } = useMovies(storage);

  return (
    <main className="app">
      <header className="app__head">
        <h1>Movie Search</h1>
        <input
          type="search"
          className="search"
          placeholder="Search titles…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search movies"
        />
        <ul className="chips" aria-label="Filter by genre">
          <li>
            <button
              type="button"
              className={`chip${genre === 'all' ? ' chip--active' : ''}`}
              aria-pressed={genre === 'all'}
              onClick={() => setGenre('all')}
            >
              All
            </button>
          </li>
          {genres.map((item) => (
            <li key={item}>
              <button
                type="button"
                className={`chip${genre === item ? ' chip--active' : ''}`}
                aria-pressed={genre === item}
                onClick={() => setGenre(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </header>

      <p className="count">
        {results.length} {results.length === 1 ? 'result' : 'results'}
      </p>

      {results.length === 0 ? (
        <p className="empty">No movies match your search.</p>
      ) : (
        <ul className="grid">
          {results.map((movie) => (
            <li key={movie.id} className="card">
              <Poster movie={movie} />
              <div className="card__body">
                <button
                  type="button"
                  className="card__title"
                  onClick={() => select(movie.id)}
                >
                  {movie.title}
                </button>
                <span className="card__meta">
                  {movie.year} · {formatRuntime(movie.runtime)} · ★ {movie.rating.toFixed(1)}
                </span>
              </div>
              <button
                type="button"
                className={`fav${isFavorite(movie.id) ? ' fav--on' : ''}`}
                aria-pressed={isFavorite(movie.id)}
                aria-label={
                  isFavorite(movie.id)
                    ? `Remove ${movie.title} from favorites`
                    : `Add ${movie.title} to favorites`
                }
                onClick={() => toggleFav(movie.id)}
              >
                {isFavorite(movie.id) ? '★' : '☆'}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <section className="detail" aria-label="Movie details">
          <div className="detail__top">
            <Poster movie={selected} size="lg" />
            <div>
              <h2 className="detail__title">{selected.title}</h2>
              <p className="detail__meta">
                {selected.year} · {formatRuntime(selected.runtime)} · ★ {selected.rating.toFixed(1)}
              </p>
              <ul className="detail__genres">
                {selected.genres.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="detail__overview">{selected.overview}</p>
          <div className="detail__actions">
            <button
              type="button"
              className={`btn${isFavorite(selected.id) ? ' btn--active' : ''}`}
              aria-pressed={isFavorite(selected.id)}
              onClick={() => toggleFav(selected.id)}
            >
              {isFavorite(selected.id) ? '★ In favorites' : '☆ Add to favorites'}
            </button>
            <button type="button" className="btn" onClick={clearSelection}>
              Close
            </button>
          </div>
        </section>
      )}

      {favoriteMovies.length > 0 && (
        <section className="favorites">
          <h2 className="favorites__title">Favorites ({favoriteMovies.length})</h2>
          <ul className="favorites__list">
            {favoriteMovies.map((movie) => (
              <li key={movie.id} className="favorites__item">
                <button type="button" className="card__title" onClick={() => select(movie.id)}>
                  {movie.title}
                </button>
                <button
                  type="button"
                  className="fav fav--on"
                  aria-label={`Remove ${movie.title} from favorites`}
                  onClick={() => toggleFav(movie.id)}
                >
                  ★
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
