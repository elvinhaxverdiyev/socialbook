import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  currentUser as initialCurrentUser,
  initialPosts,
  initialBlockedUsers,
  initialShelfBooks,
  followingList,
  followersList,
  suggestionPool,
  getDisplayUsername,
} from '../data/mockData';
import {
  ALLOWED_CONDITIONS,
  ALLOWED_GENDERS,
  ALLOWED_POST_TYPES,
  clampText,
  isAllowedPage,
  isValidHandle,
  LIMITS,
  parsePositivePrice,
  sanitizeHexColor,
  sanitizeInitials,
  sanitizeSearchQuery,
  sanitizeUsername,
  usernameToHandle,
} from '../utils/security';

const AppContext = createContext(null);
const COLOR_MODE_KEY = 'ref-color-mode';
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

function pickRandomSuggestion(excludedHandles, followingSet, selfHandle) {
  const excluded = new Set([selfHandle, ...excludedHandles, ...followingSet]);
  const candidates = suggestionPool.filter((person) => !excluded.has(person.handle));
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function buildInitialSuggestions(followingSet, selfHandle) {
  const shuffled = [...suggestionPool].sort(() => Math.random() - 0.5);
  const picked = [];

  for (const person of shuffled) {
    if (picked.length >= SUGGESTION_SLOTS) break;
    if (person.handle === selfHandle || followingSet.has(person.handle)) continue;
    picked.push(person);
  }

  return picked;
}

function getInitialColorMode() {
  const saved = localStorage.getItem(COLOR_MODE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function AppProvider({ children }) {
  const [posts, setPosts] = useState(initialPosts);
  const [activePage, setActivePage] = useState('home');
  const [viewedUserHandle, setViewedUserHandle] = useState(null);
  const [returnPage, setReturnPage] = useState('home');
  const [query, setQuery] = useState('');
  const [followingUsers, setFollowingUsers] = useState(followingList);
  const [followerUsers, setFollowerUsers] = useState(followersList);
  const [following, setFollowing] = useState(
    () => new Set(followingList.map((user) => user.handle)),
  );
  const [visibleSuggestions, setVisibleSuggestions] = useState(() =>
    buildInitialSuggestions(
      new Set(followingList.map((user) => user.handle)),
      initialCurrentUser.handle,
    ),
  );
  const [accountUser, setAccountUser] = useState(initialCurrentUser);
  const [savedIds, setSavedIds] = useState(new Set([3]));
  const [blockedUsers, setBlockedUsers] = useState(initialBlockedUsers);
  const [shelfBooks, setShelfBooks] = useState(initialShelfBooks);
  const [colorMode, setColorMode] = useState(getInitialColorMode);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login', reason: '' });

  const currentUser = isLoggedIn ? accountUser : GUEST_USER;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorMode);
    localStorage.setItem(COLOR_MODE_KEY, colorMode);
  }, [colorMode]);

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

  const login = () => {
    setIsLoggedIn(true);
    closeAuthModal();
    return true;
  };

  const register = ({ username, gender }) => {
    const cleanUsername = sanitizeUsername(username);
    const handle = usernameToHandle(cleanUsername);
    if (!handle || !ALLOWED_GENDERS.has(gender)) return false;

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
    setBlockedUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const addShelfBook = (book) => {
    if (!requireAuth('Kitab əlavə etmək üçün daxil ol və ya qeydiyyatdan keç.')) return;

    const title = clampText(book.title, LIMITS.shelfTitle);
    if (!title) return;

    setShelfBooks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        author: clampText(book.author, LIMITS.shelfAuthor) || 'Naməlum müəllif',
        cover: sanitizeHexColor(book.cover),
      },
    ]);
  };

  const removeShelfBook = (id) => {
    if (!requireAuth()) return;
    setShelfBooks((prev) => prev.filter((book) => book.id !== id));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setActivePage('home');
    setViewedUserHandle(null);
  };

  const toggleFollow = (handle, user) => {
    if (!requireAuth('İzləmək üçün daxil ol və ya qeydiyyatdan keç.')) return;

    setFollowing((prev) => {
      const wasFollowing = prev.has(handle);

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

      const next = new Set(prev);
      if (wasFollowing) next.delete(handle);
      else next.add(handle);
      return next;
    });
  };

  const followSuggestion = (handle, user, slotIndex) => {
    if (!requireAuth('İzləmək üçün daxil ol və ya qeydiyyatdan keç.')) return;

    setFollowing((prev) => {
      if (prev.has(handle)) return prev;

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

      const next = new Set(prev);
      next.add(handle);

      setVisibleSuggestions((suggestions) => {
        const updated = [...suggestions];
        const otherHandles = updated
          .filter((_, index) => index !== slotIndex)
          .map((person) => person.handle);
        const replacement = pickRandomSuggestion(
          [handle, ...otherHandles],
          next,
          accountUser.handle,
        );

        if (replacement) {
          updated[slotIndex] = replacement;
          return updated;
        }

        updated.splice(slotIndex, 1);
        return updated;
      });

      return next;
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
  }, [following, accountUser.handle]);

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
                { id: post.comments.length + 1, user: accountUser.name, text: safeText },
              ],
            }
          : post,
      ),
    );
  };

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
          }
        : {
            title: 'Kitab',
            author: 'Naməlum müəllif',
            cover: sanitizeHexColor(),
          };

      setPosts((prev) => [
        {
          ...base,
          type: 'sale',
          book,
          price,
          condition: ALLOWED_CONDITIONS.has(draft.condition) ? draft.condition : 'yaxşı',
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
    if (page !== 'user-profile') setViewedUserHandle(null);
    setActivePage(page);
  };

  const openUserProfile = (handle) => {
    if (!isValidHandle(handle)) return;

    if (isLoggedIn && handle === accountUser.handle) {
      setViewedUserHandle(null);
      setActivePage('profile');
      return;
    }

    setReturnPage(activePage === 'user-profile' ? returnPage : activePage);
    setViewedUserHandle(handle);
    setActivePage('user-profile');
  };

  const closeUserProfile = () => {
    setViewedUserHandle(null);
    setActivePage(isAllowedPage(returnPage) && returnPage !== 'user-profile' ? returnPage : 'home');
  };

  const setSearchQuery = (value) => {
    setQuery(sanitizeSearchQuery(value));
  };

  const homeFeed = useMemo(() => {
    if (!query.trim()) return posts;

    const q = query.toLowerCase();
    return posts.filter((post) => {
      const parts = [
        post.book?.title,
        post.book?.author,
        post.text,
        post.user?.name,
        post.store?.name,
      ];
      return parts.filter(Boolean).join(' ').toLowerCase().includes(q);
    });
  }, [posts, query]);

  const profilePosts = useMemo(
    () => posts.filter((p) => p.user?.handle === accountUser.handle),
    [posts, accountUser.handle],
  );

  const savedPosts = useMemo(
    () => posts.filter((p) => savedIds.has(p.id) && p.user?.handle !== accountUser.handle),
    [posts, savedIds, accountUser.handle],
  );

  const updateCurrentProfile = (updates) => {
    if (!isLoggedIn) return;

    const oldHandle = accountUser.handle;
    const displayName = getDisplayUsername(updates.handle);

    setAccountUser((prev) => ({
      ...prev,
      handle: updates.handle,
      bio: updates.bio,
      avatarUrl: updates.avatarUrl,
      avatarPresetId: updates.avatarPresetId ?? null,
      initials: updates.initials,
      name: displayName,
    }));

    setPosts((prev) =>
      prev.map((post) =>
        post.user?.handle === oldHandle
          ? {
              ...post,
              user: {
                ...post.user,
                handle: updates.handle,
                name: displayName,
                initials: updates.initials,
                avatarUrl: updates.avatarUrl,
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
    viewedUserHandle,
    openUserProfile,
    closeUserProfile,
    query,
    setQuery: setSearchQuery,
    following,
    followingUsers,
    followerUsers,
    visibleSuggestions,
    toggleFollow,
    followSuggestion,
    savedIds,
    toggleSave,
    addComment,
    addPost,
    homeFeed,
    profilePosts,
    savedPosts,
    currentUser,
    updateCurrentProfile,
    blockedUsers,
    unblockUser,
    shelfBooks,
    addShelfBook,
    removeShelfBook,
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
