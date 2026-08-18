import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  currentUser as initialCurrentUser,
  initialPosts,
  initialBlockedUsers,
  initialShelfBooks,
  initialNotifications,
  followingList,
  followersList,
  suggestionPool,
  getDisplayUsername,
  userProfiles,
} from '../data/mockData';
import {
  DEFAULT_SHELF_THEME,
  loadShelfThemesFromStorage,
  sanitizeShelfTheme,
  saveShelfThemeToStorage,
} from '../data/shelfTheme';
import { resolveAvatarPresetUrl } from '../data/avatarPresets';
import { DEFAULT_BANNER } from '../data/media';
import {
  ALLOWED_CONDITIONS,
  ALLOWED_GENDERS,
  ALLOWED_GENRES,
  ALLOWED_POST_TYPES,
  ALLOWED_SHELF_STATUSES,
  clampText,
  isAllowedPage,
  isValidEmail,
  isValidHandle,
  isValidPassword,
  LIMITS,
  parsePositivePrice,
  sanitizeHexColor,
  sanitizeImageUrl,
  sanitizeInitials,
  sanitizeSearchQuery,
  sanitizeUsername,
  usernameToHandle,
} from '../utils/security';

const AppContext = createContext(null);
const COLOR_MODE_KEY = 'kitabci-color-mode';
const LEGACY_COLOR_MODE_KEY = 'ref-color-mode';
const AUTH_KEY = 'kitabci-auth';
const PROFILE_STORAGE_KEY = 'kitabci-profile';
const SUGGESTION_SLOTS = 3;
const AUTH_PAGES = new Set(['profile', 'notifications', 'saved']);

const GUEST_USER = {
  id: 0,
  name: 'Qonaq',
  handle: '@guest',
  initials: 'Q',
  bio: '',
  avatarUrl: null,
  avatarPresetId: null,
  shelvesRead: 0,
  following: 0,
  followers: 0,
  booksForSale: 0,
};

function pickRandomSuggestion(excludedHandles, followingSet, selfHandle, blockedSet = new Set()) {
  const excluded = new Set([
    selfHandle,
    ...excludedHandles,
    ...followingSet,
    ...blockedSet,
  ]);
  const candidates = suggestionPool.filter((person) => !excluded.has(person.handle));
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function buildInitialSuggestions(followingSet, selfHandle, blockedSet = new Set()) {
  const shuffled = [...suggestionPool].sort(() => Math.random() - 0.5);
  const picked = [];

  for (const person of shuffled) {
    if (picked.length >= SUGGESTION_SLOTS) break;
    if (
      person.handle === selfHandle ||
      followingSet.has(person.handle) ||
      blockedSet.has(person.handle)
    ) {
      continue;
    }
    picked.push(person);
  }

  return picked;
}

function filterBlockedFromList(users, blockedSet) {
  return users.filter((user) => !blockedSet.has(user.handle));
}

function filterPostsFromBlocked(posts, blockedSet, selfHandle) {
  return posts.filter((post) => {
    const handle = post.user?.handle;
    if (!handle || handle === selfHandle) return true;
    return !blockedSet.has(handle);
  });
}

function isNotificationFromBlocked(notification, blockedUsers) {
  return blockedUsers.some((user) => {
    const username = getDisplayUsername(user.handle);
    const firstName = user.name.split(/\s+/)[0];
    return (
      notification.text.includes(user.name) ||
      (username && notification.text.includes(username)) ||
      (firstName.length > 2 && notification.text.includes(firstName))
    );
  });
}

function getInitialColorMode() {
  const saved =
    localStorage.getItem(COLOR_MODE_KEY) ?? localStorage.getItem(LEGACY_COLOR_MODE_KEY);
  if (saved === 'dark' || saved === 'light') {
    if (!localStorage.getItem(COLOR_MODE_KEY) && localStorage.getItem(LEGACY_COLOR_MODE_KEY)) {
      localStorage.setItem(COLOR_MODE_KEY, saved);
      localStorage.removeItem(LEGACY_COLOR_MODE_KEY);
    }
    return saved;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialLoggedIn() {
  try {
    return localStorage.getItem(AUTH_KEY) !== 'out';
  } catch {
    return false;
  }
}

const PROFILE_STORAGE_MAX_BYTES = 500_000;
const UNSAFE_STORAGE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function isSafeStorageObject(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  return !Object.keys(data).some((key) => UNSAFE_STORAGE_KEYS.has(key));
}

function loadStoredProfile(fallback) {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw || raw.length > PROFILE_STORAGE_MAX_BYTES) return fallback;

    const data = JSON.parse(raw);
    if (!isSafeStorageObject(data)) return fallback;

    const handle = isValidHandle(data.handle) ? data.handle : fallback.handle;
    const avatarPresetId = typeof data.avatarPresetId === 'string' ? data.avatarPresetId : null;
    const presetAvatarUrl = resolveAvatarPresetUrl(avatarPresetId);

    return {
      ...fallback,
      handle,
      name: getDisplayUsername(handle),
      bio: clampText(data.bio ?? fallback.bio, LIMITS.bio),
      avatarUrl: presetAvatarUrl ?? sanitizeImageUrl(data.avatarUrl) ?? fallback.avatarUrl ?? null,
      avatarPresetId,
      bannerUrl: sanitizeImageUrl(data.bannerUrl) ?? fallback.bannerUrl ?? DEFAULT_BANNER,
      initials: sanitizeInitials(data.initials ?? fallback.initials),
    };
  } catch {
    return fallback;
  }
}

function saveStoredProfile(profile) {
  try {
    const avatarUrl = profile.avatarPresetId
      ? resolveAvatarPresetUrl(profile.avatarPresetId)
      : profile.avatarUrl;

    localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify({
        handle: profile.handle,
        bio: profile.bio,
        avatarUrl,
        avatarPresetId: profile.avatarPresetId,
        bannerUrl: profile.bannerUrl,
        initials: profile.initials,
      }),
    );
  } catch {
    // localStorage dolu ola bilər
  }
}

export function AppProvider({ children }) {
  const [posts, setPosts] = useState(initialPosts);
  const [activePage, setActivePage] = useState('home');
  const [viewedUserHandle, setViewedUserHandle] = useState(null);
  const [shelfView, setShelfView] = useState({ handle: null, filter: 'all' });
  const [viewedBookId, setViewedBookId] = useState(null);
  const [viewedAuthorId, setViewedAuthorId] = useState(null);
  const [viewedStoreId, setViewedStoreId] = useState(null);
  const [booksGenreFilter, setBooksGenreFilter] = useState(null);
  const [viewedPostId, setViewedPostId] = useState(null);
  const [query, setQuery] = useState('');
  const [followingUsers, setFollowingUsers] = useState(followingList);
  const [followerUsers] = useState(followersList);
  const [following, setFollowing] = useState(
    () => new Set(followingList.map((user) => user.handle)),
  );
  const [visibleSuggestions, setVisibleSuggestions] = useState(() =>
    buildInitialSuggestions(
      new Set(followingList.map((user) => user.handle)),
      initialCurrentUser.handle,
      new Set(initialBlockedUsers.map((user) => user.handle)),
    ),
  );
  const [accountUser, setAccountUser] = useState(() => loadStoredProfile(initialCurrentUser));
  const [savedIds, setSavedIds] = useState(new Set([3]));
  const [likedCommentKeys, setLikedCommentKeys] = useState(new Set());
  const [blockedUsers, setBlockedUsers] = useState(initialBlockedUsers);
  const [shelfBooks, setShelfBooks] = useState(initialShelfBooks);
  const [shelfThemes, setShelfThemes] = useState(() => loadShelfThemesFromStorage());
  const [notifications, setNotifications] = useState(initialNotifications);
  const [colorMode, setColorMode] = useState(getInitialColorMode);
  const [isLoggedIn, setIsLoggedIn] = useState(getInitialLoggedIn);
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login', reason: '' });
  const [navStack, setNavStack] = useState([]);
  const skipNavPush = useRef(false);
  const navSnapshotRef = useRef(null);

  const currentUser = isLoggedIn ? accountUser : GUEST_USER;

  const blockedHandles = useMemo(
    () => new Set(blockedUsers.map((user) => user.handle)),
    [blockedUsers],
  );

  const isBlockedHandle = useCallback(
    (handle) => blockedHandles.has(handle),
    [blockedHandles],
  );

  navSnapshotRef.current = {
    activePage,
    viewedUserHandle,
    shelfView,
    viewedBookId,
    viewedAuthorId,
    viewedStoreId,
    booksGenreFilter,
  };

  const pushNav = () => {
    if (skipNavPush.current) return;
    const snap = navSnapshotRef.current;
    if (!snap) return;
    setNavStack((prev) => [
      ...prev.slice(-39),
      {
        ...snap,
        shelfView: { ...(snap.shelfView || { handle: null, filter: 'all' }) },
      },
    ]);
  };

  const applyNavSnapshot = (snap) => {
    if (!snap) return;

    let page = isAllowedPage(snap.activePage) ? snap.activePage : 'home';
    let viewedHandle = snap.viewedUserHandle ?? null;

    if (AUTH_PAGES.has(page) && !isLoggedIn) {
      page = 'home';
      viewedHandle = null;
      setAuthModal({
        open: true,
        mode: 'login',
        reason: 'Bu bölmə üçün daxil ol və ya qeydiyyatdan keç.',
      });
    }

    if (page === 'user-profile' && viewedHandle && blockedHandles.has(viewedHandle)) {
      page = 'home';
      viewedHandle = null;
    }

    skipNavPush.current = true;
    setActivePage(page);
    setViewedUserHandle(viewedHandle);
    setShelfView(snap.shelfView || { handle: null, filter: 'all' });
    setViewedBookId(snap.viewedBookId ?? null);
    setViewedAuthorId(snap.viewedAuthorId ?? null);
    setViewedStoreId(snap.viewedStoreId ?? null);
    setBooksGenreFilter(snap.booksGenreFilter ?? null);
    requestAnimationFrame(() => {
      skipNavPush.current = false;
    });
  };

  const resetToHome = () => {
    skipNavPush.current = true;
    setNavStack([]);
    setActivePage('home');
    setViewedUserHandle(null);
    setShelfView({ handle: null, filter: 'all' });
    setViewedBookId(null);
    setViewedAuthorId(null);
    setViewedStoreId(null);
    setBooksGenreFilter(null);
    setViewedPostId(null);
    requestAnimationFrame(() => {
      skipNavPush.current = false;
    });
  };

  const goBack = () => {
    setNavStack((prev) => {
      if (prev.length === 0) {
        queueMicrotask(() => {
          if (navSnapshotRef.current?.activePage !== 'home') {
            resetToHome();
          }
        });
        return prev;
      }

      const next = [...prev];
      const snap = next.pop();
      queueMicrotask(() => applyNavSnapshot(snap));
      return next;
    });
  };

  const goHome = () => {
    resetToHome();
  };

  const canGoBack = navStack.length > 0 && activePage !== 'home';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorMode);
    localStorage.setItem(COLOR_MODE_KEY, colorMode);

    const themeMeta = document.querySelectorAll('meta[name="theme-color"]');
    const color = colorMode === 'dark' ? '#1a1817' : '#7A1F2B';
    themeMeta.forEach((meta) => meta.setAttribute('content', color));
  }, [colorMode]);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_KEY, isLoggedIn ? 'in' : 'out');
    } catch {
      // storage bloklanıbsa sessiya yalnız bu tab üçün qalır
    }
  }, [isLoggedIn]);

  const openAuthModal = (mode = 'login', reason = '') => {
    setAuthModal({
      open: true,
      mode: mode === 'register' ? 'register' : 'login',
      reason: typeof reason === 'string' ? reason : '',
    });
  };

  const closeAuthModal = () => {
    setAuthModal((prev) => ({ ...prev, open: false, reason: '' }));
  };

  const requireAuth = (reason = '') => {
    if (isLoggedIn) return true;
    openAuthModal('login', reason);
    return false;
  };

  const login = ({ email, password } = {}) => {
    if (!isValidEmail(email) || !isValidPassword(password)) return false;
    setIsLoggedIn(true);
    closeAuthModal();
    return true;
  };

  const register = ({ username, gender, email, password }) => {
    const cleanUsername = sanitizeUsername(username);
    const handle = usernameToHandle(cleanUsername);
    if (!handle || !ALLOWED_GENDERS.has(gender)) return false;
    if (email && !isValidEmail(email)) return false;
    if (!isValidPassword(password)) return false;

    setAccountUser((prev) => ({
      ...prev,
      handle,
      name: getDisplayUsername(handle),
      gender,
      initials: sanitizeInitials(cleanUsername.slice(0, 2).toUpperCase() || prev.initials),
    }));
    setIsLoggedIn(true);
    closeAuthModal();
    return true;
  };

  const unblockUser = (id) => {
    if (!requireAuth()) return;
    if (id == null) return;
    setBlockedUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const blockUser = (user) => {
    if (!user?.handle) return;

    setBlockedUsers((prev) => {
      if (prev.some((entry) => entry.handle === user.handle)) return prev;
      return [
        ...prev,
        {
          id: user.id ?? Date.now(),
          name: user.name || getDisplayUsername(user.handle),
          handle: user.handle,
          initials: user.initials || '?',
        },
      ];
    });

    setFollowing((prev) => {
      if (!prev.has(user.handle)) return prev;
      const next = new Set(prev);
      next.delete(user.handle);
      return next;
    });

    setFollowingUsers((prev) => prev.filter((entry) => entry.handle !== user.handle));

    setVisibleSuggestions((prev) => prev.filter((entry) => entry.handle !== user.handle));

    goHome();
  };

  const reportUser = (_user, _reason) => {
    // Mock — backend qoşulanda API-yə göndəriləcək
  };

  const addShelfBook = (book) => {
    if (!requireAuth('Kitab əlavə etmək üçün daxil ol və ya qeydiyyatdan keç.')) return false;

    const title = clampText(book.title, LIMITS.shelfTitle);
    if (!title) return false;

    const existing = book.bookId
      ? shelfBooks.find((b) => b.bookId === book.bookId)
      : shelfBooks.find((b) => b.title.toLowerCase() === title.toLowerCase());

    if (existing) {
      setShelfBooks((prev) =>
        prev.map((b) =>
          b.id === existing.id
            ? {
                ...b,
                status: ALLOWED_SHELF_STATUSES.has(book.status) ? book.status : b.status,
              }
            : b,
        ),
      );
      return existing.id;
    }

    const id = Date.now();
    setShelfBooks((prev) => [
      ...prev,
      {
        id,
        bookId: book.bookId || null,
        title,
        author: clampText(book.author, LIMITS.shelfAuthor),
        cover: sanitizeHexColor(book.cover),
        status: ALLOWED_SHELF_STATUSES.has(book.status) ? book.status : 'want',
      },
    ]);
    return id;
  };

  const removeShelfBook = (id) => {
    if (!requireAuth()) return;
    setShelfBooks((prev) => prev.filter((book) => book.id !== id));
  };

  const updateShelfBookStatus = (id, status) => {
    if (!requireAuth()) return;
    if (!ALLOWED_SHELF_STATUSES.has(status)) return;
    setShelfBooks((prev) =>
      prev.map((book) => (book.id === id ? { ...book, status } : book)),
    );
  };

  const getShelfTheme = useCallback(
    (handle) => {
      if (!handle || !isValidHandle(handle)) return DEFAULT_SHELF_THEME;
      if (shelfThemes[handle]) return shelfThemes[handle];
      const mockTheme = userProfiles[handle]?.shelfTheme;
      if (mockTheme) return sanitizeShelfTheme(mockTheme);
      return DEFAULT_SHELF_THEME;
    },
    [shelfThemes],
  );

  const updateShelfTheme = (theme) => {
    if (!requireAuth('Rəfi bəzəmək üçün daxil ol.')) return false;
    const handle = accountUser.handle;
    if (!isValidHandle(handle)) return false;

    const next = sanitizeShelfTheme(theme);
    setShelfThemes((prev) => ({ ...prev, [handle]: next }));
    return saveShelfThemeToStorage(handle, next);
  };

  const logout = () => {
    setIsLoggedIn(false);
    resetToHome();
  };

  const toggleFollow = (handle, user) => {
    if (!requireAuth('İzləmək üçün daxil ol və ya qeydiyyatdan keç.')) return;
    if (blockedHandles.has(handle)) return;

    const wasFollowing = following.has(handle);

    setFollowing((prev) => {
      const next = new Set(prev);
      if (wasFollowing) next.delete(handle);
      else next.add(handle);
      return next;
    });

    setFollowingUsers((users) => {
      if (wasFollowing) {
        return users.filter((u) => u.handle !== handle);
      }
      if (users.some((u) => u.handle === handle) || !user) return users;
      return [
        ...users,
        {
          id: user.id ?? user.handle,
          name: user.name,
          handle: user.handle,
          initials: user.initials,
          avatarUrl: user.avatarUrl,
        },
      ];
    });
  };

  const followSuggestion = (handle, user, slotIndex) => {
    if (!requireAuth('İzləmək üçün daxil ol və ya qeydiyyatdan keç.')) return;
    if (following.has(handle)) return;

    setFollowing((prev) => {
      const next = new Set(prev);
      next.add(handle);
      return next;
    });

    setFollowingUsers((users) => {
      if (users.some((u) => u.handle === handle)) return users;
      return [
        ...users,
        {
          id: user.id ?? user.handle,
          name: user.name,
          handle: user.handle,
          initials: user.initials,
          avatarUrl: user.avatarUrl,
        },
      ];
    });

    setVisibleSuggestions((suggestions) => {
      const updated = [...suggestions];
      const otherHandles = updated
        .filter((_, index) => index !== slotIndex)
        .map((person) => person.handle);
      const nextFollowing = new Set(following);
      nextFollowing.add(handle);
      const replacement = pickRandomSuggestion(
        [handle, ...otherHandles],
        nextFollowing,
        accountUser.handle,
        blockedHandles,
      );

      if (replacement) {
        updated[slotIndex] = replacement;
        return updated;
      }

      updated.splice(slotIndex, 1);
      return updated;
    });
  };

  useEffect(() => {
    setVisibleSuggestions((suggestions) => {
      let updated = suggestions;
      let changed = false;

      suggestions.forEach((person, index) => {
        if (!following.has(person.handle)) return;

        const base = changed ? updated : [...suggestions];
        if (!changed) updated = base;

        const otherHandles = base
          .filter((_, i) => i !== index)
          .map((p) => p.handle);
        const replacement = pickRandomSuggestion(
          [person.handle, ...otherHandles],
          following,
          accountUser.handle,
          blockedHandles,
        );

        if (replacement) {
          base[index] = replacement;
        } else {
          base.splice(index, 1);
        }

        changed = true;
      });

      return changed ? updated : suggestions;
    });
  }, [following, accountUser.handle, blockedHandles]);

  useEffect(() => {
    setVisibleSuggestions((prev) => {
      const filtered = prev.filter((person) => !blockedHandles.has(person.handle));
      return filtered.length === prev.length ? prev : filtered;
    });
  }, [blockedHandles]);

  const toggleSave = (postId) => {
    if (!requireAuth('Saxlamaq üçün daxil ol və ya qeydiyyatdan keç.')) return;

    const post = posts.find((p) => p.id === postId);
    if (isLoggedIn && post?.user?.handle === accountUser.handle) return;

    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const addComment = (postId, text) => {
    if (!requireAuth('Şərh yazmaq üçün daxil ol və ya qeydiyyatdan keç.')) return;

    const safeText = clampText(text, LIMITS.commentText);
    if (!safeText) return;

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Date.now(),
                  user: accountUser.name,
                  initials: accountUser.initials,
                  avatarUrl: accountUser.avatarUrl,
                  text: safeText,
                  likes: 0,
                },
              ],
            }
          : post,
      ),
    );
  };

  const toggleCommentLike = (postId, commentId) => {
    if (!requireAuth('Şərhi bəyənmək üçün daxil ol və ya qeydiyyatdan keç.')) return;

    const key = `${postId}:${commentId}`;
    const wasLiked = likedCommentKeys.has(key);

    setLikedCommentKeys((prev) => {
      const next = new Set(prev);
      if (wasLiked) next.delete(key);
      else next.add(key);
      return next;
    });

    setPosts((posts) =>
      posts.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map((comment) => {
            if (comment.id !== commentId) return comment;
            const current = Number(comment.likes) || 0;
            return {
              ...comment,
              likes: Math.max(0, current + (wasLiked ? -1 : 1)),
            };
          }),
        };
      }),
    );
  };

  const isCommentLiked = (postId, commentId) => likedCommentKeys.has(`${postId}:${commentId}`);

  const addPost = (draft) => {
    if (!requireAuth('Post paylaşmaq üçün daxil ol və ya qeydiyyatdan keç.')) return;

    const type = ALLOWED_POST_TYPES.has(draft.type) ? draft.type : 'general';
    const text = clampText(draft.text, LIMITS.postText);
    if (!text) return;

    const user = {
      name: accountUser.name,
      handle: accountUser.handle,
      initials: accountUser.initials,
      avatarUrl: accountUser.avatarUrl,
    };

    const base = {
      id: Date.now(),
      time: 'indicə',
      text,
      likes: 0,
      comments: [],
      user,
    };

    if (type === 'general') {
      setPosts((prev) => [{ ...base, type: 'general' }, ...prev]);
      return;
    }

    if (type === 'sale') {
      const price = parsePositivePrice(draft.price);
      if (price === null) return;

      const book = draft.book
        ? {
            title: clampText(draft.book.title, LIMITS.bookTitle) || 'Kitab',
            author: clampText(draft.book.author, LIMITS.bookAuthor) || 'Naməlum müəllif',
            cover: sanitizeHexColor(draft.book.cover),
            ...(draft.book.bookId ? { bookId: draft.book.bookId } : {}),
          }
        : {
            title: 'Kitab',
            author: 'Naməlum müəllif',
            cover: sanitizeHexColor(),
          };

      const category = ALLOWED_GENRES.has(draft.category) ? draft.category : null;
      if (!category) return;

      setPosts((prev) => [
        {
          ...base,
          type: 'sale',
          book,
          price,
          condition: ALLOWED_CONDITIONS.has(draft.condition) ? draft.condition : 'yaxşı',
          category,
        },
        ...prev,
      ]);
      return;
    }

    const book = draft.book
      ? {
          title: clampText(draft.book.title, LIMITS.bookTitle) || 'Kitab',
          author: clampText(draft.book.author, LIMITS.bookAuthor) || 'Naməlum müəllif',
          cover: sanitizeHexColor(draft.book.cover),
        }
      : {
          title: 'Kitab',
          author: 'Naməlum müəllif',
          cover: sanitizeHexColor(),
        };

    setPosts((prev) => [
      {
        ...base,
        type,
        book,
        ...(type === 'finished' && draft.rating
          ? { rating: Math.min(5, Math.max(1, Number(draft.rating) || 0)) }
          : {}),
      },
      ...prev,
    ]);
  };

  const setActivePageSafe = (page) => {
    if (!isAllowedPage(page)) return;
    if (AUTH_PAGES.has(page) && !isLoggedIn) {
      openAuthModal('login', 'Bu bölmə üçün daxil ol və ya qeydiyyatdan keç.');
      return;
    }

    const samePage =
      page === activePage &&
      (page === 'user-profile' ? false : true) &&
      page !== 'book' &&
      page !== 'author' &&
      page !== 'shelf';

    if (!skipNavPush.current && !samePage) {
      pushNav();
    }

    if (page !== 'user-profile') setViewedUserHandle(null);
    if (page !== 'shelf') setShelfView({ handle: null, filter: 'all' });
    if (page !== 'book') setViewedBookId(null);
    if (page !== 'author') setViewedAuthorId(null);
    if (page !== 'store') setViewedStoreId(null);
    if (page !== 'books' && page !== 'genres') setBooksGenreFilter(null);
    setViewedPostId(null);
    setActivePage(page);
  };

  const openUserProfile = (handle) => {
    if (!isValidHandle(handle)) return;
    if (blockedHandles.has(handle)) return;

    setViewedPostId(null);

    if (isLoggedIn && handle === accountUser.handle) {
      pushNav();
      setViewedUserHandle(null);
      setActivePage('profile');
      return;
    }

    pushNav();
    setViewedUserHandle(handle);
    setActivePage('user-profile');
  };

  const closeUserProfile = () => {
    goBack();
  };

  const openShelfPage = ({ handle = null, filter = 'all' } = {}) => {
    const nextFilter = ALLOWED_SHELF_STATUSES.has(filter) || filter === 'all' ? filter : 'all';
    const owner = handle && isValidHandle(handle) ? handle : null;
    if (owner && blockedHandles.has(owner)) return;

    pushNav();
    setShelfView({ handle: owner, filter: nextFilter });
    setActivePage('shelf');
  };

  const closeShelfPage = () => {
    goBack();
  };

  const openBook = (bookId) => {
    if (!bookId) return;
    pushNav();
    setViewedPostId(null);
    setViewedBookId(bookId);
    setViewedAuthorId(null);
    setViewedStoreId(null);
    setActivePage('book');
  };

  const closeBook = () => {
    goBack();
  };

  const openAuthor = (authorId) => {
    if (!authorId) return;
    pushNav();
    setViewedPostId(null);
    setViewedAuthorId(authorId);
    setViewedStoreId(null);
    setActivePage('author');
  };

  const closeAuthor = () => {
    goBack();
  };

  const openStore = (storeId) => {
    if (storeId == null) return;
    pushNav();
    setViewedPostId(null);
    setViewedStoreId(Number(storeId));
    setViewedBookId(null);
    setViewedAuthorId(null);
    setActivePage('store');
  };

  const closeStore = () => {
    goBack();
  };

  const openBooks = ({ genre = null } = {}) => {
    pushNav();
    setBooksGenreFilter(genre || null);
    setViewedBookId(null);
    setViewedAuthorId(null);
    setViewedStoreId(null);
    setActivePage('books');
  };

  const openGenres = () => {
    pushNav();
    setViewedBookId(null);
    setViewedAuthorId(null);
    setViewedStoreId(null);
    setActivePage('genres');
  };

  const openPost = (postId) => {
    if (postId == null) return;
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const authorHandle = post.user?.handle;
    if (
      authorHandle &&
      blockedHandles.has(authorHandle) &&
      authorHandle !== accountUser.handle
    ) {
      return;
    }

    setViewedPostId(postId);
  };

  const closePost = () => {
    setViewedPostId(null);
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredNotifications = useMemo(
    () => notifications.filter((item) => !isNotificationFromBlocked(item, blockedUsers)),
    [notifications, blockedUsers],
  );

  const unreadNotificationsCount = useMemo(
    () => filteredNotifications.filter((item) => !item.read).length,
    [filteredNotifications],
  );

  const filteredFollowingUsers = useMemo(
    () => filterBlockedFromList(followingUsers, blockedHandles),
    [followingUsers, blockedHandles],
  );

  const filteredFollowerUsers = useMemo(
    () => filterBlockedFromList(followerUsers, blockedHandles),
    [followerUsers, blockedHandles],
  );

  const filteredVisibleSuggestions = useMemo(
    () => filterBlockedFromList(visibleSuggestions, blockedHandles),
    [visibleSuggestions, blockedHandles],
  );

  const setSearchQuery = (value) => {
    setQuery(sanitizeSearchQuery(value));
  };

  const homeFeed = useMemo(() => {
    const visiblePosts = filterPostsFromBlocked(posts, blockedHandles, accountUser.handle);
    if (!query.trim()) return visiblePosts;

    const q = query.toLowerCase();
    return visiblePosts.filter((post) => {
      const parts = [
        post.book?.title,
        post.book?.author,
        post.text,
        post.user?.name,
        post.store?.name,
      ];
      return parts.filter(Boolean).join(' ').toLowerCase().includes(q);
    });
  }, [posts, query, blockedHandles, accountUser.handle]);

  const profilePosts = useMemo(
    () => posts.filter((p) => p.user?.handle === accountUser.handle),
    [posts, accountUser.handle],
  );

  const savedPosts = useMemo(() => {
    const visiblePosts = filterPostsFromBlocked(posts, blockedHandles, accountUser.handle);
    return visiblePosts.filter(
      (p) => savedIds.has(p.id) && p.user?.handle !== accountUser.handle,
    );
  }, [posts, savedIds, accountUser.handle, blockedHandles]);

  const updateCurrentProfile = (updates) => {
    if (!isLoggedIn || !updates) return;

    const oldHandle = accountUser.handle;
    const handle = isValidHandle(updates.handle) ? updates.handle : oldHandle;
    const displayName = getDisplayUsername(handle);
    const bio = clampText(updates.bio ?? accountUser.bio, LIMITS.bio);
    const avatarPresetId = updates.avatarPresetId ?? null;
    let avatarUrl = null;

    if (avatarPresetId) {
      avatarUrl = resolveAvatarPresetUrl(avatarPresetId);
    } else if (updates.avatarUrl) {
      avatarUrl = sanitizeImageUrl(updates.avatarUrl);
      if (!avatarUrl) return;
    }

    const bannerUrl =
      updates.bannerUrl != null
        ? sanitizeImageUrl(updates.bannerUrl) ?? DEFAULT_BANNER
        : accountUser.bannerUrl;
    const initials = sanitizeInitials(updates.initials ?? accountUser.initials);

    const nextProfile = {
      handle,
      bio,
      avatarUrl,
      avatarPresetId,
      bannerUrl,
      initials,
      name: displayName,
    };

    setAccountUser((prev) => ({
      ...prev,
      ...nextProfile,
    }));

    saveStoredProfile(nextProfile);

    setPosts((prev) =>
      prev.map((post) =>
        post.user?.handle === oldHandle
          ? {
              ...post,
              user: {
                ...post.user,
                handle,
                name: displayName,
                initials,
                avatarUrl,
              },
            }
          : post,
      ),
    );
  };

  const value = {
    posts,
    activePage,
    setActivePage: setActivePageSafe,
    goBack,
    goHome,
    canGoBack,
    viewedUserHandle,
    openUserProfile,
    closeUserProfile,
    shelfView,
    openShelfPage,
    closeShelfPage,
    viewedBookId,
    viewedAuthorId,
    viewedStoreId,
    booksGenreFilter,
    openBook,
    closeBook,
    openAuthor,
    closeAuthor,
    openStore,
    closeStore,
    openBooks,
    openGenres,
    viewedPostId,
    openPost,
    closePost,
    query,
    setQuery: setSearchQuery,
    following,
    followingUsers: filteredFollowingUsers,
    followerUsers: filteredFollowerUsers,
    visibleSuggestions: filteredVisibleSuggestions,
    toggleFollow,
    followSuggestion,
    savedIds,
    toggleSave,
    addComment,
    toggleCommentLike,
    isCommentLiked,
    addPost,
    homeFeed,
    profilePosts,
    savedPosts,
    currentUser,
    updateCurrentProfile,
    blockedUsers,
    isBlockedHandle,
    unblockUser,
    blockUser,
    reportUser,
    shelfBooks,
    addShelfBook,
    removeShelfBook,
    updateShelfBookStatus,
    getShelfTheme,
    updateShelfTheme,
    notifications: filteredNotifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    colorMode,
    setColorMode,
    isLoggedIn,
    login,
    register,
    logout,
    authModal,
    openAuthModal,
    closeAuthModal,
    requireAuth,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
