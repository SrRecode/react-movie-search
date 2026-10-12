/**
 * A small offline catalogue. In a real app this would come from an API; keeping
 * it local makes the search logic fully deterministic and testable.
 */
export const MOVIES = [
  {
    id: 'inception',
    title: 'Inception',
    year: 2010,
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    runtime: 148,
    rating: 8.8,
    overview:
      'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into a target mind.',
  },
  {
    id: 'interstellar',
    title: 'Interstellar',
    year: 2014,
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    runtime: 169,
    rating: 8.7,
    overview:
      'Explorers travel through a wormhole in an attempt to ensure humanity\u2019s survival as Earth becomes uninhabitable.',
  },
  {
    id: 'the-dark-knight',
    title: 'The Dark Knight',
    year: 2008,
    genres: ['Action', 'Crime', 'Drama'],
    runtime: 152,
    rating: 9.0,
    overview:
      'Batman faces the Joker, a criminal mastermind who plunges Gotham into chaos and forces hard moral choices.',
  },
  {
    id: 'pulp-fiction',
    title: 'Pulp Fiction',
    year: 1994,
    genres: ['Crime', 'Drama'],
    runtime: 154,
    rating: 8.9,
    overview:
      'The lives of two mob hitmen, a boxer and a pair of diner bandits intertwine in four tales of violence and redemption.',
  },
  {
    id: 'forrest-gump',
    title: 'Forrest Gump',
    year: 1994,
    genres: ['Drama', 'Romance'],
    runtime: 142,
    rating: 8.8,
    overview:
      'The presidencies of Kennedy and Johnson unfold from the perspective of an Alabama man with an extraordinary life.',
  },
  {
    id: 'the-matrix',
    title: 'The Matrix',
    year: 1999,
    genres: ['Action', 'Sci-Fi'],
    runtime: 136,
    rating: 8.7,
    overview:
      'A hacker learns the shocking truth about his reality and his role in the war against its controllers.',
  },
  {
    id: 'goodfellas',
    title: 'Goodfellas',
    year: 1990,
    genres: ['Biography', 'Crime', 'Drama'],
    runtime: 145,
    rating: 8.7,
    overview:
      'The story of Henry Hill and his life in the mob, covering his rise and fall across three decades.',
  },
  {
    id: 'fight-club',
    title: 'Fight Club',
    year: 1999,
    genres: ['Drama', 'Thriller'],
    runtime: 139,
    rating: 8.8,
    overview:
      'An insomniac office worker and a soap salesman form an underground fight club that spirals into something far bigger.',
  },
  {
    id: 'parasite',
    title: 'Parasite',
    year: 2019,
    genres: ['Comedy', 'Drama', 'Thriller'],
    runtime: 132,
    rating: 8.5,
    overview:
      'A poor family scheme to become employed by a wealthy household, with unexpected and destabilising consequences.',
  },
  {
    id: 'whiplash',
    title: 'Whiplash',
    year: 2014,
    genres: ['Drama', 'Music'],
    runtime: 106,
    rating: 8.5,
    overview:
      'A promising young drummer is pushed to the brink by an abusive instructor at an elite music conservatory.',
  },
  {
    id: 'arrival',
    title: 'Arrival',
    year: 2016,
    genres: ['Drama', 'Sci-Fi'],
    runtime: 116,
    rating: 7.9,
    overview:
      'A linguist is recruited to communicate with alien visitors and discovers language can reshape her perception of time.',
  },
  {
    id: 'dune',
    title: 'Dune',
    year: 2021,
    genres: ['Adventure', 'Sci-Fi'],
    runtime: 155,
    rating: 8.0,
    overview:
      'A noble family becomes embroiled in a war for the desert planet Arrakis and its invaluable spice.',
  },
];

export const ALL_GENRES = [...new Set(MOVIES.flatMap((movie) => movie.genres))].sort();

export function getMovie(id) {
  return MOVIES.find((movie) => movie.id === id) ?? null;
}
