export const currentUser = {
  id: 1,
  name: 'Aysel Məmmədova',
  handle: '@aysel_reads',
  initials: 'AM',
  bio: 'Azərbaycan ədəbiyyatı və elmi-fantastika həvəskarı.',
  bannerUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1400&q=80',
  shelvesRead: 142,
  following: 89,
  followers: 124,
  booksForSale: 3,
};

export const initialShelfBooks = [
  { id: 1, title: 'Dune', author: 'Frank Herbert', cover: '#435A45', status: 'reading' },
  { id: 6, title: 'Faust', author: 'Goethe', cover: '#6B4C8A', status: 'reading' },
  { id: 9, title: 'Foundation', author: 'Asimov', cover: '#435A45', status: 'reading' },
  { id: 10, title: 'Kür qırağının meşələri', author: 'Anar', cover: '#7A2331', status: 'reading' },
  { id: 11, title: 'Anna Karenina', author: 'Tolstoy', cover: '#22304F', status: 'reading' },
  { id: 12, title: 'Master və Marqarita', author: 'Bulgakov', cover: '#B08D3D', status: 'reading' },
  { id: 13, title: 'Sapiens', author: 'Yuval Noah Harari', cover: '#2E6B5A', status: 'reading' },
  { id: 14, title: 'Norwegian Wood', author: 'Murakami', cover: '#6B4C8A', status: 'reading' },
  { id: 2, title: '1984', author: 'George Orwell', cover: '#22304F', status: 'finished' },
  { id: 4, title: 'Xəmsə', author: 'Nizami', cover: '#7A2331', status: 'finished' },
  { id: 8, title: 'Yeddi gözəl', author: 'Nizami', cover: '#7A2331', status: 'finished' },
  { id: 3, title: 'Əli və Nino', author: 'Kurban Səid', cover: '#B08D3D', status: 'want' },
  { id: 5, title: 'Hobbit', author: 'Tolkien', cover: '#2E6B5A', status: 'want' },
  { id: 7, title: 'Səfillər', author: 'Victor Hugo', cover: '#22304F', status: 'want' },
];

export const initialPosts = [
  {
    id: 1,
    type: 'finished',
    user: { name: 'Rəşad Quliyev', handle: '@rashad_g', initials: 'RQ' },
    time: '2 saat əvvəl',
    book: { title: 'Kür qırağının meşələri', author: 'Anar', cover: '#7A2331' },
    rating: 5,
    text: 'Bu kitabı bitirəndən sonra bir müddət heç nə oxumaq istəmədim. Təsvirlər o qədər canlıdır ki, elə bil özün oradasan.',
    likes: 128,
    comments: [
      { id: 1, user: 'Nərmin', initials: 'NƏ', text: 'Mən də bu yaxınlarda bitirdim, sonluq məni sarsıtdı.', likes: 12 },
      { id: 2, user: 'Tural', initials: 'T', text: 'Siyahıma əlavə etdim, təşəkkürlər!', likes: 4 },
    ],
  },
  {
    id: 2,
    type: 'reading',
    user: { name: currentUser.name, handle: currentUser.handle, initials: currentUser.initials },
    time: '5 saat əvvəl',
    book: { title: 'Dune', author: 'Frank Herbert', cover: '#435A45' },
    text: 'Səhifə 340-a çatdım, Paul artıq tamam başqa insana çevrilib. Kimsə spoyler vermə xahiş edirəm.',
    likes: 56,
    comments: [{ id: 1, user: 'Kamran', initials: 'KV', text: 'İkinci kitab birincidən də yaxşıdır, davam et!', likes: 8 }],
  },
  {
    id: 3,
    type: 'store',
    store: { id: 1, name: 'Kitab Klubu', location: 'Nizami küç., Bakı', verified: true },
    book: { title: 'Əli və Nino', author: 'Kurban Səid', cover: '#B08D3D' },
    price: 12.9,
    condition: 'yeni',
    text: 'Bu həftə üçün endirimli nüsxələr rəfdədir — məhdud sayda.',
    likes: 34,
    comments: [],
  },
  {
    id: 4,
    type: 'sale',
    user: { name: 'Nərmin Əliyeva', handle: '@narmin.reads', initials: 'NƏ' },
    time: '1 gün əvvəl',
    book: { title: 'Səfillər', author: 'Victor Hugo', cover: '#22304F', bookId: 'sefiller' },
    price: 5.5,
    condition: 'yaxşı',
    category: 'klassik',
    text: 'Bir dəfə oxunub, səhifələri təmizdir. Bakı daxilində çatdırılma mümkündür.',
    likes: 19,
    comments: [{ id: 1, user: 'Tural', initials: 'T', text: 'Qiymət razılaşma yolu ilə ola bilər?', likes: 2 }],
  },
  {
    id: 5,
    type: 'store',
    store: { id: 2, name: 'Söz Dünyası', location: 'Gənclik, Bakı', verified: true },
    book: { title: '1984', author: 'George Orwell', cover: '#435A45' },
    price: 9.9,
    condition: 'yeni',
    text: 'Klassik ədəbiyyat rəfinə yeni çap əlavə olundu.',
    likes: 41,
    comments: [],
  },
  {
    id: 6,
    type: 'sale',
    user: { name: 'Kamran Vəliyev', handle: '@kamranv', initials: 'KV' },
    time: '2 gün əvvəl',
    book: { title: 'Harry Potter və Fəlsəfə Daşı', author: 'J.K. Rowling', cover: '#7A2331', bookId: 'hp' },
    price: 8.0,
    condition: 'orta',
    category: 'usaq',
    text: 'Uşaq kitabxanamı təmizləyirəm. 3-cü nəşr, cildində kiçik iz var.',
    likes: 27,
    comments: [],
  },
  {
    id: 9,
    type: 'sale',
    user: { name: 'Tural Hüseynov', handle: '@tural_h', initials: 'TH' },
    time: '3 gün əvvəl',
    book: { title: 'Dune', author: 'Frank Herbert', cover: '#435A45', bookId: 'dune' },
    price: 11.0,
    condition: 'yaxşı',
    category: 'fantastika',
    text: 'İngiliscə nüsxə, az işlənib. Metroya yaxın görüş mümkün.',
    likes: 12,
    comments: [],
  },
  {
    id: 10,
    type: 'sale',
    user: { name: 'Ləman Həsənova', handle: '@leman_h', initials: 'LH' },
    time: '5 gün əvvəl',
    book: { title: 'Yerli şeir antologiyası', author: 'Müxtəlif', cover: '#7A2331' },
    price: 4.0,
    condition: 'yeni',
    category: 'poeziya',
    text: 'Kataloqda olmayan nadir toplusu. Üz qabığı sıfır vəziyyətdə.',
    likes: 8,
    comments: [],
  },
  {
    id: 8,
    type: 'general',
    user: { name: 'Nərmin Əliyeva', handle: '@narmin.reads', initials: 'NƏ' },
    time: '4 saat əvvəl',
    text: 'Bu həftə sonu oxumaq üçün sakit bir kafe axtarıram — tövsiyəniz var?',
    likes: 15,
    comments: [{ id: 1, user: 'Aysel', initials: 'AM', text: 'Nizami küçəsindəki Kitab Klubunun yuxarısı yaxşıdır!', likes: 6 }],
  },
];

export const stores = [
  {
    id: 1,
    name: 'Kitab Klubu',
    location: 'Nizami küç., Bakı',
    description: 'Azərbaycan və dünya ədəbiyyatının geniş seçimi. 15 ildir xidmətinizdəyik.',
    booksCount: 1240,
    rating: 4.8,
    verified: true,
    hours: '09:00 – 21:00',
    phone: '+994 12 555 12 34',
    cover: '#7A2331',
    about:
      'Kitab Klubu Bakının mərkəzində yerləşən müstəqil kitab mağazasıdır. Yeni nəşrlər, klassik ədəbiyyat və oxu klubları təşkil edirik.',
  },
  {
    id: 2,
    name: 'Söz Dünyası',
    location: 'Gənclik, Bakı',
    description: 'Gənclər üçün müasir kitab mağazası. Endirimlər hər həftə.',
    booksCount: 890,
    rating: 4.6,
    verified: true,
    hours: '10:00 – 22:00',
    phone: '+994 12 555 45 67',
    cover: '#435A45',
    about:
      'Söz Dünyası gənc oxucular üçün müasir nəşrlər, fantastika və bestsellerlər təqdim edir. Həftəlik endirim kampaniyaları keçirilir.',
  },
  {
    id: 3,
    name: 'Vərəq Mağazası',
    location: '28 May, Bakı',
    description: 'Nadir və kolleksion kitablar. Antikvar bölmə mövcuddur.',
    booksCount: 560,
    rating: 4.9,
    verified: false,
    hours: '11:00 – 19:00',
    phone: '+994 12 555 89 01',
    cover: '#B08D3D',
    about:
      'Vərəq Mağazası nadir nəşrlər və antikvar kitablar üzrə ixtisaslaşır. Kolleksiyaçılar üçün xüsusi sifarişlər qəbul olunur.',
  },
];

export function getStoreById(id) {
  const numId = Number(id);
  return stores.find((store) => store.id === numId) || null;
}

export function getStorePosts(posts, storeId) {
  const id = Number(storeId);
  return (posts || []).filter(
    (post) => post.type === 'store' && Number(post.store?.id) === id,
  );
}

export {
  bookCatalog,
  trendingBooks,
  genres,
  bookTypes,
  authors,
  getBookById,
  getAuthorById,
  getBooksByGenre,
  getBooksByAuthor,
  getBooksByType,
  findBookByTitle,
  searchBooks,
  searchAuthors,
  getRelatedPosts,
  getStorePostsForBook,
  getSecondHandPostsForBook,
  getDiscussionPostsForBook,
  sortBooks,
  getGenreById,
  getGenreBookCount,
  getAuthorBookCount,
} from './books';

export const suggestedPeople = [
  { name: 'Nərmin Əliyeva', handle: '@narmin.reads', initials: 'NƏ', booksSold: 12 },
  { name: 'Tural Hüseynov', handle: '@tural_h', initials: 'TH', booksSold: 5 },
  { name: 'Kamran Vəliyev', handle: '@kamranv', initials: 'KV', booksSold: 8 },
];

export const suggestionPool = [
  { name: 'Nərmin Əliyeva', handle: '@narmin.reads', initials: 'NƏ', booksSold: 12 },
  { name: 'Tural Hüseynov', handle: '@tural_h', initials: 'TH', booksSold: 5 },
  { name: 'Kamran Vəliyev', handle: '@kamranv', initials: 'KV', booksSold: 8 },
  { name: 'Rəşad Quliyev', handle: '@rashad_g', initials: 'RQ', booksSold: 15 },
  { name: 'Ləman Həsənova', handle: '@leman_h', initials: 'LH', booksSold: 3 },
  { name: 'Səbinə Quliyeva', handle: '@sabina_q', initials: 'SQ', booksSold: 7 },
  { name: 'Orxan Məmmədov', handle: '@orxan_m', initials: 'OM', booksSold: 4 },
];

export const followingList = [
  { id: 1, name: 'Rəşad Quliyev', handle: '@rashad_g', initials: 'RQ' },
  { id: 2, name: 'Nərmin Əliyeva', handle: '@narmin.reads', initials: 'NƏ' },
  { id: 3, name: 'Tural Hüseynov', handle: '@tural_h', initials: 'TH' },
  { id: 4, name: 'Kamran Vəliyev', handle: '@kamranv', initials: 'KV' },
  { id: 5, name: 'Ləman Həsənova', handle: '@leman_h', initials: 'LH' },
];

export const followersList = [
  { id: 1, name: 'Rəşad Quliyev', handle: '@rashad_g', initials: 'RQ' },
  { id: 2, name: 'Nərmin Əliyeva', handle: '@narmin.reads', initials: 'NƏ' },
  { id: 3, name: 'Tural Hüseynov', handle: '@tural_h', initials: 'TH' },
  { id: 4, name: 'Kamran Vəliyev', handle: '@kamranv', initials: 'KV' },
  { id: 5, name: 'Səbinə Quliyeva', handle: '@sabina_q', initials: 'SQ' },
  { id: 6, name: 'Orxan Məmmədov', handle: '@orxan_m', initials: 'OM' },
];

export const userProfiles = {
  '@rashad_g': {
    name: 'Rəşad Quliyev',
    handle: '@rashad_g',
    initials: 'RQ',
    bio: 'Klassik ədəbiyyat və müasir Azərbaycanca proza. Həftəlik kitab rəyləri yazıram.',
    bannerUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80',
    shelfTheme: {
      wallColor: '#22304F',
      plankColor: '#9A7348',
      stickers: [
        { emoji: '📚', x: 8, y: 10 },
        { emoji: '✨', x: 78, y: 8 },
      ],
    },
    shelfBooks: [
      { id: 101, title: 'Kür qırağının meşələri', author: 'Anar', cover: '#7A2331', status: 'finished' },
      { id: 102, title: 'Xəmsə', author: 'Nizami', cover: '#435A45', status: 'reading' },
      { id: 103, title: 'Faust', author: 'Goethe', cover: '#22304F', status: 'want' },
    ],
    followingList: [
      { id: 1, name: 'Nərmin Əliyeva', handle: '@narmin.reads', initials: 'NƏ' },
      { id: 2, name: 'Aysel Məmmədova', handle: '@aysel_reads', initials: 'AM' },
      { id: 3, name: 'Tural Hüseynov', handle: '@tural_h', initials: 'TH' },
    ],
    followersList: [
      { id: 1, name: 'Nərmin Əliyeva', handle: '@narmin.reads', initials: 'NƏ' },
      { id: 2, name: 'Aysel Məmmədova', handle: '@aysel_reads', initials: 'AM' },
      { id: 3, name: 'Kamran Vəliyev', handle: '@kamranv', initials: 'KV' },
      { id: 4, name: 'Ləman Həsənova', handle: '@leman_h', initials: 'LH' },
    ],
  },
  '@narmin.reads': {
    name: 'Nərmin Əliyeva',
    handle: '@narmin.reads',
    initials: 'NƏ',
    bio: 'Satış elanları və oxuma qeydləri. Dünya klassikası kolleksiyaçısı.',
    bannerUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1400&q=80',
    shelfTheme: {
      wallColor: '#7A1F2B',
      plankColor: '#B08D3D',
      stickers: [
        { emoji: '🌸', x: 6, y: 10 },
        { emoji: '📖', x: 48, y: 5 },
        { emoji: '⭐', x: 92, y: 14 },
      ],
    },
    shelfBooks: [
      { id: 201, title: 'Səfillər', author: 'Victor Hugo', cover: '#22304F', status: 'finished' },
      { id: 202, title: 'Anna Karenina', author: 'Tolstoy', cover: '#7A2331', status: 'reading' },
      { id: 203, title: 'Crime and Punishment', author: 'Dostoyevski', cover: '#B08D3D', status: 'want' },
      { id: 204, title: 'Pride and Prejudice', author: 'Jane Austen', cover: '#435A45', status: 'finished' },
      { id: 205, title: 'Madame Bovary', author: 'Flaubert', cover: '#6B4C8A', status: 'want' },
      { id: 206, title: 'Wuthering Heights', author: 'Brontë', cover: '#2E6B5A', status: 'reading' },
      { id: 207, title: 'Jane Eyre', author: 'Charlotte Brontë', cover: '#7A2331', status: 'finished' },
    ],
    followingList: [
      { id: 1, name: 'Rəşad Quliyev', handle: '@rashad_g', initials: 'RQ' },
      { id: 2, name: 'Aysel Məmmədova', handle: '@aysel_reads', initials: 'AM' },
    ],
    followersList: [
      { id: 1, name: 'Rəşad Quliyev', handle: '@rashad_g', initials: 'RQ' },
      { id: 2, name: 'Aysel Məmmədova', handle: '@aysel_reads', initials: 'AM' },
      { id: 3, name: 'Tural Hüseynov', handle: '@tural_h', initials: 'TH' },
      { id: 4, name: 'Səbinə Quliyeva', handle: '@sabina_q', initials: 'SQ' },
    ],
  },
  '@kamranv': {
    name: 'Kamran Vəliyev',
    handle: '@kamranv',
    initials: 'KV',
    bio: 'Fantastika və uşaq ədəbiyyatı. Ucuz ikinci əl kitablar satıram.',
    bannerUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1400&q=80',
    shelfTheme: {
      wallColor: '#435A45',
      plankColor: '#6A4D2E',
      stickers: [{ emoji: '🔥', x: 22, y: 6 }],
    },
    shelfBooks: [
      { id: 301, title: 'Harry Potter və Fəlsəfə Daşı', author: 'J.K. Rowling', cover: '#7A2331', status: 'want' },
      { id: 302, title: 'Hobbit', author: 'Tolkien', cover: '#435A45', status: 'finished' },
    ],
    followingList: [
      { id: 1, name: 'Rəşad Quliyev', handle: '@rashad_g', initials: 'RQ' },
      { id: 2, name: 'Nərmin Əliyeva', handle: '@narmin.reads', initials: 'NƏ' },
    ],
    followersList: [
      { id: 1, name: 'Aysel Məmmədova', handle: '@aysel_reads', initials: 'AM' },
      { id: 2, name: 'Orxan Məmmədov', handle: '@orxan_m', initials: 'OM' },
    ],
  },
  '@tural_h': {
    name: 'Tural Hüseynov',
    handle: '@tural_h',
    initials: 'TH',
    bio: 'Elmi-fantastika oxuyuram, qısa rəylər yazıram.',
    shelfBooks: [
      { id: 401, title: 'Dune', author: 'Frank Herbert', cover: '#435A45', status: 'reading' },
      { id: 402, title: 'Foundation', author: 'Asimov', cover: '#22304F', status: 'want' },
    ],
    followingList: [
      { id: 1, name: 'Aysel Məmmədova', handle: '@aysel_reads', initials: 'AM' },
    ],
    followersList: [
      { id: 1, name: 'Rəşad Quliyev', handle: '@rashad_g', initials: 'RQ' },
      { id: 2, name: 'Nərmin Əliyeva', handle: '@narmin.reads', initials: 'NƏ' },
    ],
  },
  '@leman_h': {
    name: 'Ləman Həsənova',
    handle: '@leman_h',
    initials: 'LH',
    bio: 'Yeni nəşrlər və şeir kitabları.',
    shelfBooks: [
      { id: 501, title: 'Qarabağ — silsilə', author: 'Müxtəlif', cover: '#7A2331', status: 'reading' },
    ],
    followingList: [
      { id: 1, name: 'Aysel Məmmədova', handle: '@aysel_reads', initials: 'AM' },
      { id: 2, name: 'Rəşad Quliyev', handle: '@rashad_g', initials: 'RQ' },
    ],
    followersList: [
      { id: 1, name: 'Səbinə Quliyeva', handle: '@sabina_q', initials: 'SQ' },
    ],
  },
};

export function getUserProfile(handle) {
  if (userProfiles[handle]) return userProfiles[handle];

  const person = suggestionPool.find((user) => user.handle === handle);
  if (!person) return null;

  return {
    name: person.name,
    handle: person.handle,
    initials: person.initials,
    bio: '',
    shelfBooks: [],
    followingList: [],
    followersList: [],
  };
}

export const initialNotifications = [
  { id: 1, text: 'Rəşad Quliyev rəyini bəyəndi', time: '10 dəq əvvəl', read: false },
  { id: 2, text: 'Kitab Klubu yeni elan paylaşdı', time: '1 saat əvvəl', read: false },
  { id: 3, text: 'Nərmin satış elanına şərh yazdı', time: '3 saat əvvəl', read: true },
  { id: 4, text: 'Tural səni izləməyə başladı', time: 'dünən', read: true },
];

/** @deprecated use initialNotifications / context state */
export const notifications = initialNotifications;

export const formatPrice = (amount) => `${Number(amount).toFixed(2)} ₼`;

export function getDisplayUsername(handle) {
  if (typeof handle !== 'string') return '';
  return handle.startsWith('@') ? handle.slice(1) : handle;
}

export const conditionLabels = {
  yeni: 'Yeni',
  yaxşı: 'Yaxşı vəziyyətdə',
  orta: 'Orta vəziyyətdə',
};

export const initialBlockedUsers = [
  { id: 1, name: 'Spam Hesab', handle: '@spam_bot', initials: 'SH' },
  { id: 2, name: 'Elvin Test', handle: '@elvin_test', initials: 'ET' },
];

export const aboutContent = {
  title: 'Haqqımızda',
  paragraphs: [
    'Kitabci.com — kitabsevərlər, oxucular və mağazalar üçün sosial platformadır. Burada kitab haqqında fikir paylaşa, oxuma irəliləyişini qeyd edə, eləcə də kitab ala və sata bilərsən.',
    'Missiyamız oxumağı bir icma təcrübəsinə çevirməkdir. Gələcəkdə mağazalar və istifadəçilər birbaşa platforma üzərindən əlaqə saxlayacaq.',
    'Hazırda layihə inkişaf mərhələsindədir. Təklif və iradlərinizi gözləyirik.',
  ],
};

export { termsContent, communityRulesContent } from './legal';

export const privacyContent = {
  title: 'Məxfilik siyasəti',
  sections: [
    {
      heading: '1. Hansı məlumatlar toplanır',
      text: 'Qeydiyyat zamanı email, istifadəçi adı və profil məlumatlarınız saxlanılır. Post, şərh və satış elanları da hesabınıza bağlanır.',
    },
    {
      heading: '2. Məlumatların istifadəsi',
      text: 'Məlumatlar yalnız xidmətin göstərilməsi, təhlükəsizlik və platformanın inkişafı məqsədilə emal olunur.',
    },
    {
      heading: '3. Üçüncü tərəflərlə paylaşım',
      text: 'Şəxsi məlumatlarınız reklam məqsədilə satılmır. Qanuni tələb olduqda və ya xidmət təminatçıları ilə məhdud şəkildə paylaşıla bilər.',
    },
    {
      heading: '4. Sizin hüquqlarınız',
      text: 'Məlumatlarınıza baxmaq, düzəltmək və silinməsini tələb etmək hüququnuz var. Sorğularınızı parametrlər bölməsindən göndərə bilərsiniz.',
    },
  ],
};
