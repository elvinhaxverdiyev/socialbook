import {
  ALLOWED_GENRES,
  ALLOWED_SHELF_STATUSES,
  isValidHandle,
} from './security';

function normalizePath(pathname) {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed || '/';
}

function handleFromSlug(slug) {
  if (!slug) return null;
  const clean = decodeURIComponent(slug).trim();
  const handle = clean.startsWith('@') ? clean : `@${clean}`;
  return isValidHandle(handle) ? handle : null;
}

export function parsePathname(pathname, search = '') {
  const path = normalizePath(pathname);
  const params = new URLSearchParams(search.replace(/^\?/, ''));

  const staticRoutes = {
    '/': { page: 'home' },
    '/books': { page: 'books' },
    '/genres': { page: 'genres' },
    '/stores': { page: 'stores' },
    '/notifications': { page: 'notifications' },
    '/saved': { page: 'saved' },
    '/settings': { page: 'settings' },
    '/profile': { page: 'profile' },
    '/shelf': { page: 'shelf' },
  };

  if (staticRoutes[path]) {
    const route = { valid: true, ...staticRoutes[path] };
    if (route.page === 'books') {
      const genre = params.get('genre');
      if (genre && ALLOWED_GENRES.has(genre)) {
        route.genre = genre;
      }
    }
    if (route.page === 'shelf') {
      const filter = params.get('filter');
      if (filter === 'all' || ALLOWED_SHELF_STATUSES.has(filter)) {
        route.shelfFilter = filter;
      }
    }
    return route;
  }

  const bookMatch = path.match(/^\/book\/([^/]+)$/);
  if (bookMatch?.[1]) {
    return { valid: true, page: 'book', bookId: decodeURIComponent(bookMatch[1]) };
  }

  const authorMatch = path.match(/^\/author\/([^/]+)$/);
  if (authorMatch?.[1]) {
    return { valid: true, page: 'author', authorId: decodeURIComponent(authorMatch[1]) };
  }

  const storeMatch = path.match(/^\/store\/(\d+)$/);
  if (storeMatch?.[1]) {
    return { valid: true, page: 'store', storeId: Number(storeMatch[1]) };
  }

  const userMatch = path.match(/^\/u\/([^/]+)$/);
  if (userMatch?.[1]) {
    const handle = handleFromSlug(userMatch[1]);
    if (handle) {
      return { valid: true, page: 'user-profile', handle };
    }
  }

  const shelfMatch = path.match(/^\/shelf\/([^/]+)$/);
  if (shelfMatch?.[1]) {
    const handle = handleFromSlug(shelfMatch[1]);
    if (handle) {
      const route = { valid: true, page: 'shelf', handle };
      const filter = params.get('filter');
      if (filter === 'all' || ALLOWED_SHELF_STATUSES.has(filter)) {
        route.shelfFilter = filter;
      }
      return route;
    }
  }

  return { valid: false, page: 'not-found' };
}

function handleToSlug(handle) {
  return encodeURIComponent(handle.replace(/^@+/, ''));
}

export function buildPathname({
  activePage,
  viewedUserHandle = null,
  viewedBookId = null,
  viewedAuthorId = null,
  viewedStoreId = null,
  shelfView = { handle: null, filter: 'all' },
  booksGenreFilter = null,
}) {
  switch (activePage) {
    case 'home':
      return '/';
    case 'books': {
      if (booksGenreFilter && ALLOWED_GENRES.has(booksGenreFilter)) {
        return `/books?genre=${encodeURIComponent(booksGenreFilter)}`;
      }
      return '/books';
    }
    case 'genres':
      return '/genres';
    case 'stores':
      return '/stores';
    case 'notifications':
      return '/notifications';
    case 'saved':
      return '/saved';
    case 'settings':
      return '/settings';
    case 'profile':
      return '/profile';
    case 'book':
      return viewedBookId ? `/book/${encodeURIComponent(String(viewedBookId))}` : '/books';
    case 'author':
      return viewedAuthorId ? `/author/${encodeURIComponent(String(viewedAuthorId))}` : '/books';
    case 'store':
      return viewedStoreId != null ? `/store/${viewedStoreId}` : '/stores';
    case 'user-profile':
      return viewedUserHandle ? `/u/${handleToSlug(viewedUserHandle)}` : '/';
    case 'shelf': {
      const filter = shelfView?.filter;
      const query =
        filter && filter !== 'all' && ALLOWED_SHELF_STATUSES.has(filter)
          ? `?filter=${encodeURIComponent(filter)}`
          : '';
      if (shelfView?.handle) {
        return `/shelf/${handleToSlug(shelfView.handle)}${query}`;
      }
      return query ? `/shelf${query}` : '/shelf';
    }
    default:
      return '/';
  }
}
