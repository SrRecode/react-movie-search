import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';
import { MOVIES } from './data/movies.js';
import { FAVORITES_STORAGE_KEY } from './hooks/useMovies.js';

function memoryStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
}

let storage;

beforeEach(() => {
  storage = memoryStorage();
});

describe('App', () => {
  it('lists every movie and a result count', () => {
    render(<App storage={storage} />);
    expect(screen.getByRole('heading', { name: 'Movie Search' })).toBeInTheDocument();
    expect(screen.getByText(`${MOVIES.length} results`)).toBeInTheDocument();
    for (const movie of MOVIES) {
      expect(screen.getByRole('button', { name: movie.title })).toBeInTheDocument();
    }
  });

  it('filters by search query', async () => {
    const user = userEvent.setup();
    render(<App storage={storage} />);

    await user.type(screen.getByLabelText('Search movies'), 'dune');

    expect(screen.getByText('1 result')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dune' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Inception' })).not.toBeInTheDocument();
  });

  it('shows an empty state when nothing matches', async () => {
    const user = userEvent.setup();
    render(<App storage={storage} />);

    await user.type(screen.getByLabelText('Search movies'), 'zzzz');

    expect(screen.getByText('No movies match your search.')).toBeInTheDocument();
  });

  it('filters by genre chip', async () => {
    const user = userEvent.setup();
    render(<App storage={storage} />);

    await user.click(screen.getByRole('button', { name: 'Sci-Fi' }));

    expect(screen.getByRole('button', { name: 'Sci-Fi' })).toHaveAttribute('aria-pressed', 'true');
    // Inception is Sci-Fi, Pulp Fiction is not.
    expect(screen.getByRole('button', { name: 'Inception' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pulp Fiction' })).not.toBeInTheDocument();
  });

  it('opens details and closes them', async () => {
    const user = userEvent.setup();
    render(<App storage={storage} />);

    await user.click(screen.getByRole('button', { name: 'Inception' }));

    const detail = screen.getByRole('region', { name: 'Movie details' });
    expect(within(detail).getByRole('heading', { name: 'Inception' })).toBeInTheDocument();
    expect(within(detail).getByText(/dream-sharing technology/)).toBeInTheDocument();

    await user.click(within(detail).getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('region', { name: 'Movie details' })).not.toBeInTheDocument();
  });

  it('adds and removes favorites, showing a favorites list', async () => {
    const user = userEvent.setup();
    render(<App storage={storage} />);

    await user.click(screen.getByRole('button', { name: 'Add Dune to favorites' }));

    expect(screen.getByRole('heading', { name: 'Favorites (1)' })).toBeInTheDocument();
    const favorites = screen.getByRole('heading', { name: 'Favorites (1)' }).closest('section');
    expect(within(favorites).getByRole('button', { name: 'Dune' })).toBeInTheDocument();

    // Both the card and the favorites list expose a remove button.
    await user.click(screen.getAllByRole('button', { name: 'Remove Dune from favorites' })[0]);
    expect(screen.queryByRole('heading', { name: /Favorites/ })).not.toBeInTheDocument();
  });

  it('persists favorites to storage', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App storage={storage} />);

    await user.click(screen.getByRole('button', { name: 'Add Arrival to favorites' }));
    unmount();

    expect(JSON.parse(storage.getItem(FAVORITES_STORAGE_KEY))).toEqual(['arrival']);

    render(<App storage={storage} />);
    expect(screen.getByRole('heading', { name: 'Favorites (1)' })).toBeInTheDocument();
  });
});
