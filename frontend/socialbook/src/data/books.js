export const genres = [
  { id: 'klassik', label: 'Klassik', description: 'Dünya və milli klassik ədəbiyyat' },
  { id: 'fantastika', label: 'Fantastika', description: 'Elmi-fantastika və fantasy' },
  { id: 'detektiv', label: 'Detektiv', description: 'Detektiv və triller' },
  { id: 'poeziya', label: 'Poeziya', description: 'Şeir və poetik əsərlər' },
  { id: 'bioqrafiya', label: 'Bioqrafiya', description: 'Həyat hekayələri və xatirələr' },
  { id: 'usaq', label: 'Uşaq', description: 'Uşaq və yeniyetmə ədəbiyyatı' },
  { id: 'elmi', label: 'Elmi', description: 'Elmi-populyar və qeyri-bədii' },
  { id: 'roman', label: 'Roman', description: 'Müasir və psixoloji romanlar' },
  { id: 'azerbaycan', label: 'Azərbaycan', description: 'Azərbaycan ədəbiyyatı' },
];

export const bookTypes = [
  { id: 'roman', label: 'Roman' },
  { id: 'povest', label: 'Povest' },
  { id: 'seir', label: 'Şeir' },
  { id: 'esse', label: 'Esse' },
  { id: 'usaq', label: 'Uşaq kitabı' },
  { id: 'epik', label: 'Epik' },
];

export const authors = [
  {
    id: 'herbert',
    name: 'Frank Herbert',
    bio: 'Amerikalı yazıçı, elmi-fantastika janrının nadir nümunələrindən biri olan Dune seriyasının müəllifidir.',
    country: 'ABŞ',
    cover: '#435A45',
    bookIds: ['dune'],
  },
  {
    id: 'orwell',
    name: 'George Orwell',
    bio: 'İngilis yazıçı və publisist. 1984 və Heyvanlar ferması distopik klassikləridir.',
    country: 'Böyük Britaniya',
    cover: '#22304F',
    bookIds: ['1984'],
  },
  {
    id: 'kurban-said',
    name: 'Kurban Səid',
    bio: 'Azərbaycan yazıçısı. Əli və Nino romanı milli və dünya oxucularının sevimlisidir.',
    country: 'Azərbaycan',
    cover: '#B08D3D',
    bookIds: ['ali-nino'],
  },
  {
    id: 'nizami',
    name: 'Nizami Gəncəvi',
    bio: 'XII əsr Azərbaycan şairi və yazıçısı. Xəmsəsi dünya ədəbiyyatının incisidir.',
    country: 'Azərbaycan',
    cover: '#7A2331',
    bookIds: ['xamse', 'yeddi-gozel'],
  },
  {
    id: 'anar',
    name: 'Anar',
    bio: 'Müasir Azərbaycan yazıçısı. Kür qırağının meşələri onun ən tanınmış romanıdır.',
    country: 'Azərbaycan',
    cover: '#7A2331',
    bookIds: ['kur'],
  },
  {
    id: 'hugo',
    name: 'Victor Hugo',
    bio: 'Fransız romantik yazıçı. Səfillər və Notre-Dame de Paris əsərləri klassikdir.',
    country: 'Fransa',
    cover: '#22304F',
    bookIds: ['sefiller'],
  },
  {
    id: 'tolstoy',
    name: 'Lev Tolstoy',
    bio: 'Rus ədəbiyyatının nəhəngi. Müharibə və sülh və Anna Karenina dünya klassikidir.',
    country: 'Rusiya',
    cover: '#7A2331',
    bookIds: ['anna'],
  },
  {
    id: 'dostoyevski',
    name: 'Fyodor Dostoyevski',
    bio: 'Psixoloji dərinliyi ilə tanınan rus yazıçı. Cinayət və Cəza onun ən məşhur romanıdır.',
    country: 'Rusiya',
    cover: '#B08D3D',
    bookIds: ['crime'],
  },
  {
    id: 'austen',
    name: 'Jane Austen',
    bio: 'İngilis yazıçısı. Qürur və Qərəz romantik klassikdir.',
    country: 'Böyük Britaniya',
    cover: '#435A45',
    bookIds: ['pride'],
  },
  {
    id: 'rowling',
    name: 'J.K. Rowling',
    bio: 'Harry Potter seriyasının yaradıcısı. Uşaq və yeniyetmə ədəbiyyatını yenidən formalaşdırıb.',
    country: 'Böyük Britaniya',
    cover: '#7A2331',
    bookIds: ['hp'],
  },
  {
    id: 'tolkien',
    name: 'J.R.R. Tolkien',
    bio: 'Fantastika janrının atası sayılan ingilis filoloq və yazıçı.',
    country: 'Böyük Britaniya',
    cover: '#435A45',
    bookIds: ['hobbit'],
  },
  {
    id: 'goethe',
    name: 'Johann Wolfgang von Goethe',
    bio: 'Alman şairi, dramaturq və yazıçı. Faust dünya dramaturgiyasının zirvəsidir.',
    country: 'Almaniya',
    cover: '#22304F',
    bookIds: ['faust'],
  },
  {
    id: 'asimov',
    name: 'Isaac Asimov',
    bio: 'Elmi-fantastika janrının ən məşhur yazıçılarından biri. Foundation seriyası ilə tanınır.',
    country: 'ABŞ',
    cover: '#435A45',
    bookIds: ['foundation'],
  },
  {
    id: 'bulgakov',
    name: 'Mixail Bulqakov',
    bio: 'Rus yazıçı. Master və Marqarita Sovet ədəbiyyatının simvolik romanıdır.',
    country: 'Rusiya',
    cover: '#B08D3D',
    bookIds: ['master-margarita'],
  },
  {
    id: 'harari',
    name: 'Yuval Noah Harari',
    bio: 'Tarixçi və publisist. Sapiens müasir elmi-populyar ədəbiyyatın hitidir.',
    country: 'İsrail',
    cover: '#2E6B5A',
    bookIds: ['sapiens'],
  },
  {
    id: 'murakami',
    name: 'Haruki Murakami',
    bio: 'Yapon yazıçı. Magical realism və melankolik tonu ilə tanınır.',
    country: 'Yaponiya',
    cover: '#6B4C8A',
    bookIds: ['norwegian-wood'],
  },
  {
    id: 'isa-muganna',
    name: 'İsa Muğanna',
    bio: 'Azərbaycan yazıçısı. Aylı gecələr romanı müasir Azərbaycanca prozanın nümunələrindən biridir.',
    country: 'Azərbaycan',
    cover: '#435A45',
    bookIds: ['ayli-geceler'],
  },
  {
    id: 'suleymanli',
    name: 'M. Süleymanlı',
    bio: 'Azərbaycan yazıçısı. Piano dərsi əsəri oxucular arasında geniş tanınır.',
    country: 'Azərbaycan',
    cover: '#B08D3D',
    bookIds: ['piano-dersi'],
  },
  {
    id: 'flaubert',
    name: 'Gustave Flaubert',
    bio: 'Fransız realist yazıçı. Madame Bovary fransız romanının klassikidir.',
    country: 'Fransa',
    cover: '#6B4C8A',
    bookIds: ['madame-bovary'],
  },
  {
    id: 'bronte-e',
    name: 'Emily Brontë',
    bio: 'İngilis yazıçı. Wuthering Heights romantik və qaranlıq klassikdir.',
    country: 'Böyük Britaniya',
    cover: '#2E6B5A',
    bookIds: ['wuthering'],
  },
  {
    id: 'bronte-c',
    name: 'Charlotte Brontë',
    bio: 'İngilis yazıçı. Jane Eyre qadın həqiqətinin klassik romanıdır.',
    country: 'Böyük Britaniya',
    cover: '#7A2331',
    bookIds: ['jane-eyre'],
  },
  {
    id: 'xalq',
    name: 'Xalq əfsanəsi',
    bio: 'Azərbaycan xalq nağılları və əfsanələrinin toplusu.',
    country: 'Azərbaycan',
    cover: '#7A2331',
    bookIds: ['esli-kerem'],
  },
];

export const bookCatalog = [
  {
    id: 'dune',
    title: 'Dune',
    authorId: 'herbert',
    author: 'Frank Herbert',
    cover: '#435A45',
    genres: ['fantastika', 'klassik'],
    type: 'roman',
    language: 'Azərbaycan',
    year: 1965,
    pages: 688,
    description: 'Arrakis planetində gələcək, siyasət və ekologiyanın kəsişdiyi epik elmi-fantastika romanı.',
    avgRating: 4.6,
    ratingsCount: 2840,
  },
  {
    id: '1984',
    title: '1984',
    authorId: 'orwell',
    author: 'George Orwell',
    cover: '#22304F',
    genres: ['klassik', 'roman'],
    type: 'roman',
    language: 'Azərbaycan',
    year: 1949,
    pages: 328,
    description: 'Totalitar cəmiyyətin distopik təsviri. Big Brother anlayışının mənbəyidir.',
    avgRating: 4.7,
    ratingsCount: 5120,
  },
  {
    id: 'ali-nino',
    title: 'Əli və Nino',
    authorId: 'kurban-said',
    author: 'Kurban Səid',
    cover: '#B08D3D',
    genres: ['azerbaycan', 'roman', 'klassik'],
    type: 'roman',
    language: 'Azərbaycan',
    year: 1937,
    pages: 256,
    description: 'Bakıda iki gəncin sevgi hekayəsi — Şərq və Qərb arasında körpü.',
    avgRating: 4.8,
    ratingsCount: 1890,
  },
  {
    id: 'xamse',
    title: 'Xəmsə',
    authorId: 'nizami',
    author: 'Nizami Gəncəvi',
    cover: '#7A2331',
    genres: ['poeziya', 'klassik', 'azerbaycan'],
    type: 'epik',
    language: 'Azərbaycan',
    year: 1197,
    pages: 960,
    description: 'Beş epik poemadan ibarət Nizami irsinin zirvəsidir.',
    avgRating: 4.9,
    ratingsCount: 980,
  },
  {
    id: 'yeddi-gozel',
    title: 'Yeddi gözəl',
    authorId: 'nizami',
    author: 'Nizami Gəncəvi',
    cover: '#7A2331',
    genres: ['poeziya', 'klassik', 'azerbaycan'],
    type: 'epik',
    language: 'Azərbaycan',
    year: 1197,
    pages: 320,
    description: 'Xəmsənin ən sevilən poemalarından biri — Bahram şahın hekayəsi.',
    avgRating: 4.8,
    ratingsCount: 720,
  },
  {
    id: 'kur',
    title: 'Kür qırağının meşələri',
    authorId: 'anar',
    author: 'Anar',
    cover: '#7A2331',
    genres: ['azerbaycan', 'roman', 'klassik'],
    type: 'roman',
    language: 'Azərbaycan',
    year: 1978,
    pages: 384,
    description: 'Azərbaycan kənd həyatının dərin psixoloji portreti.',
    avgRating: 4.7,
    ratingsCount: 1340,
  },
  {
    id: 'sefiller',
    title: 'Səfillər',
    authorId: 'hugo',
    author: 'Victor Hugo',
    cover: '#22304F',
    genres: ['klassik', 'roman'],
    type: 'roman',
    language: 'Azərbaycan',
    year: 1862,
    pages: 1232,
    description: 'Jean Valjean-ın həyat yolunu izləyən epik humanist roman.',
    avgRating: 4.6,
    ratingsCount: 3210,
  },
  {
    id: 'anna',
    title: 'Anna Karenina',
    authorId: 'tolstoy',
    author: 'Lev Tolstoy',
    cover: '#7A2331',
    genres: ['klassik', 'roman'],
    type: 'roman',
    language: 'Azərbaycan',
    year: 1877,
    pages: 864,
    description: 'Rus aristokratiyasının sevgi, xəyanət və cəmiyyət tənqidinin klassik romanı.',
    avgRating: 4.5,
    ratingsCount: 2890,
  },
  {
    id: 'crime',
    title: 'Cinayət və Cəza',
    authorId: 'dostoyevski',
    author: 'Fyodor Dostoyevski',
    cover: '#B08D3D',
    genres: ['klassik', 'roman', 'detektiv'],
    type: 'roman',
    language: 'Azərbaycan',
    year: 1866,
    pages: 671,
    description: 'Raskolnikov-un cinayətindən sonra baş verən psixoloji dram.',
    avgRating: 4.6,
    ratingsCount: 3560,
  },
  {
    id: 'pride',
    title: 'Qürur və Qərəz',
    authorId: 'austen',
    author: 'Jane Austen',
    cover: '#435A45',
    genres: ['klassik', 'roman'],
    type: 'roman',
    language: 'Azərbaycan',
    year: 1813,
    pages: 432,
    description: 'Elizabeth Bennet və Mr. Darcy-nin romantik klassik hekayəsi.',
    avgRating: 4.5,
    ratingsCount: 4120,
  },
  {
    id: 'hp',
    title: 'Harry Potter və Fəlsəfə Daşı',
    authorId: 'rowling',
    author: 'J.K. Rowling',
    cover: '#7A2331',
    genres: ['fantastika', 'usaq'],
    type: 'usaq',
    language: 'Azərbaycan',
    year: 1997,
    pages: 223,
    description: 'Cavan sehrbazın Hogwarts macəra seriyasının birinci kitabı.',
    avgRating: 4.8,
    ratingsCount: 8900,
  },
  {
    id: 'hobbit',
    title: 'Hobbit',
    authorId: 'tolkien',
    author: 'J.R.R. Tolkien',
    cover: '#435A45',
    genres: ['fantastika', 'usaq', 'klassik'],
    type: 'usaq',
    language: 'Azərbaycan',
    year: 1937,
    pages: 310,
    description: 'Bilbo Baqins-in Erebor macərası — Orta Dövrün açılış hekayəsi.',
    avgRating: 4.7,
    ratingsCount: 5670,
  },
  {
    id: 'faust',
    title: 'Faust',
    authorId: 'goethe',
    author: 'Johann Wolfgang von Goethe',
    cover: '#22304F',
    genres: ['klassik', 'poeziya'],
    type: 'epik',
    language: 'Azərbaycan',
    year: 1808,
    pages: 464,
    description: 'Alman dramaturgiyasının zirvəsi — bilik və ruha həsr olunan dram.',
    avgRating: 4.4,
    ratingsCount: 1120,
  },
  {
    id: 'foundation',
    title: 'Foundation',
    authorId: 'asimov',
    author: 'Isaac Asimov',
    cover: '#435A45',
    genres: ['fantastika', 'klassik'],
    type: 'roman',
    language: 'Azərbaycan',
    year: 1951,
    pages: 255,
    description: 'Qalaktikanın gələcəyini proqnozlaşdıran elmi-fantastika seriyasının birinci kitabı.',
    avgRating: 4.5,
    ratingsCount: 2340,
  },
  {
    id: 'master-margarita',
    title: 'Master və Marqarita',
    authorId: 'bulgakov',
    author: 'Mixail Bulqakov',
    cover: '#B08D3D',
    genres: ['klassik', 'fantastika', 'roman'],
    type: 'roman',
    language: 'Azərbaycan',
    year: 1967,
    pages: 384,
    description: 'İblis Moskva-ya gəlir — Sovet cəmiyyətinin satirik və mistik romanı.',
    avgRating: 4.7,
    ratingsCount: 2780,
  },
  {
    id: 'sapiens',
    title: 'Sapiens',
    authorId: 'harari',
    author: 'Yuval Noah Harari',
    cover: '#2E6B5A',
    genres: ['elmi', 'bioqrafiya'],
    type: 'esse',
    language: 'Azərbaycan',
    year: 2011,
    pages: 443,
    description: 'İnsanlığın qısa tarixi — elmi-populyar bestseller.',
    avgRating: 4.4,
    ratingsCount: 6780,
  },
  {
    id: 'norwegian-wood',
    title: 'Norwegian Wood',
    authorId: 'murakami',
    author: 'Haruki Murakami',
    cover: '#6B4C8A',
    genres: ['roman', 'klassik'],
    type: 'roman',
    language: 'Azərbaycan',
    year: 1987,
    pages: 296,
    description: 'Gənclik, itki və sevgi haqqında melankolik yapon romanı.',
    avgRating: 4.3,
    ratingsCount: 3450,
  },
  {
    id: 'esli-kerem',
    title: 'Əsli və Kərəm',
    authorId: 'xalq',
    author: 'Xalq əfsanəsi',
    cover: '#7A2331',
    genres: ['azerbaycan', 'poeziya', 'klassik'],
    type: 'epik',
    language: 'Azərbaycan',
    year: 1600,
    pages: 128,
    description: 'Azərbaycan xalq nağılının ən sevilən sevgi hekayəsi.',
    avgRating: 4.6,
    ratingsCount: 890,
  },
  {
    id: 'ayli-geceler',
    title: 'Aylı gecələr',
    authorId: 'isa-muganna',
    author: 'İsa Muğanna',
    cover: '#435A45',
    genres: ['azerbaycan', 'roman'],
    type: 'roman',
    language: 'Azərbaycan',
    year: 1983,
    pages: 272,
    description: 'Müasir Azərbaycanca prozanın emosional və lirik nümunəsi.',
    avgRating: 4.5,
    ratingsCount: 560,
  },
  {
    id: 'piano-dersi',
    title: 'Piano dərsi',
    authorId: 'suleymanli',
    author: 'M. Süleymanlı',
    cover: '#B08D3D',
    genres: ['azerbaycan', 'roman'],
    type: 'povest',
    language: 'Azərbaycan',
    year: 1990,
    pages: 192,
    description: 'Musiqi, yaddaş və ailə münasibətləri haqqında povest.',
    avgRating: 4.4,
    ratingsCount: 430,
  },
  {
    id: 'madame-bovary',
    title: 'Madame Bovary',
    authorId: 'flaubert',
    author: 'Gustave Flaubert',
    cover: '#6B4C8A',
    genres: ['klassik', 'roman'],
    type: 'roman',
    language: 'Azərbaycan',
    year: 1857,
    pages: 432,
    description: 'Realist fransız romanının zirvəsi — burjua həyatının tənqidi.',
    avgRating: 4.3,
    ratingsCount: 1890,
  },
  {
    id: 'wuthering',
    title: 'Wuthering Heights',
    authorId: 'bronte-e',
    author: 'Emily Brontë',
    cover: '#2E6B5A',
    genres: ['klassik', 'roman'],
    type: 'roman',
    language: 'Azərbaycan',
    year: 1847,
    pages: 416,
    description: 'Heathcliff və Catherine-in qaranlıq romantik hekayəsi.',
    avgRating: 4.4,
    ratingsCount: 2340,
  },
  {
    id: 'jane-eyre',
    title: 'Jane Eyre',
    authorId: 'bronte-c',
    author: 'Charlotte Brontë',
    cover: '#7A2331',
    genres: ['klassik', 'roman'],
    type: 'roman',
    language: 'Azərbaycan',
    year: 1847,
    pages: 532,
    description: 'Müstəqil qadının həyat yolu — ingilis romanının klassikidir.',
    avgRating: 4.5,
    ratingsCount: 3120,
  },
  {
    id: 'sherlock',
    title: 'Sherlock Holmes',
    authorId: 'doyle',
    author: 'Arthur Conan Doyle',
    cover: '#22304F',
    genres: ['detektiv', 'klassik'],
    type: 'povest',
    language: 'Azərbaycan',
    year: 1892,
    pages: 307,
    description: 'Detektiv janrının ən məşhur qahramanının hekayələri toplusu.',
    avgRating: 4.6,
    ratingsCount: 4560,
  },
  {
    id: 'kucuk-prens',
    title: 'Kiçik Prins',
    authorId: 'saint-exupery',
    author: 'Antoine de Saint-Exupéry',
    cover: '#B08D3D',
    genres: ['usaq', 'klassik'],
    type: 'usaq',
    language: 'Azərbaycan',
    year: 1943,
    pages: 96,
    description: 'Böyüklər üçün yazılmış uşaq kitabı — sevgi və dostluq haqqında.',
    avgRating: 4.8,
    ratingsCount: 7890,
  },
  {
    id: 'oliver-twist',
    title: 'Oliver Twist',
    authorId: 'dickens',
    author: 'Charles Dickens',
    cover: '#435A45',
    genres: ['klassik', 'roman'],
    type: 'roman',
    language: 'Azərbaycan',
    year: 1838,
    pages: 608,
    description: 'London yoxsulluğunun sosial realist təsviri.',
    avgRating: 4.4,
    ratingsCount: 2100,
  },
  {
    id: 'gulustan',
    title: 'Gülüstan',
    authorId: 'saadi',
    author: 'Saadi Şirazi',
    cover: '#7A2331',
    genres: ['poeziya', 'klassik', 'azerbaycan'],
    type: 'esse',
    language: 'Azərbaycan',
    year: 1258,
    pages: 256,
    description: 'Hikmət və əxlaq dərsləri — Şərq ədəbiyyatının klassikidir.',
    avgRating: 4.7,
    ratingsCount: 670,
  },
  {
    id: 'kohnenin-oglu',
    title: 'Köhnənin oğlu',
    authorId: 'anar',
    author: 'Anar',
    cover: '#2E6B5A',
    genres: ['azerbaycan', 'roman'],
    type: 'roman',
    language: 'Azərbaycan',
    year: 1985,
    pages: 320,
    description: 'Müasir Azərbaycan cəmiyyətinin psixoloji portreti.',
    avgRating: 4.3,
    ratingsCount: 380,
  },
];

// Add missing authors referenced in catalog
authors.push(
  {
    id: 'doyle',
    name: 'Arthur Conan Doyle',
    bio: 'Şotlandiyalı yazıçı və həkim. Sherlock Holmes detektiv janrının simvoludur.',
    country: 'Böyük Britaniya',
    cover: '#22304F',
    bookIds: ['sherlock'],
  },
  {
    id: 'saint-exupery',
    name: 'Antoine de Saint-Exupéry',
    bio: 'Fransız pilot və yazıçı. Kiçik Prins bütün dünyada sevilir.',
    country: 'Fransa',
    cover: '#B08D3D',
    bookIds: ['kucuk-prens'],
  },
  {
    id: 'dickens',
    name: 'Charles Dickens',
    bio: 'Viktoriya dövrünün ən məşhur ingilis yazıçısı.',
    country: 'Böyük Britaniya',
    cover: '#435A45',
    bookIds: ['oliver-twist'],
  },
  {
    id: 'saadi',
    name: 'Saadi Şirazi',
    bio: 'Fars şairi və yazıçı. Gülüstan və Büstan əsərləri Şərq hikmətinin klassikidir.',
    country: 'İran',
    cover: '#7A2331',
    bookIds: ['gulustan'],
  },
);

export const trendingBooks = bookCatalog
  .filter((b) => ['esli-kerem', 'ayli-geceler', 'piano-dersi', '1984'].includes(b.id))
  .map(({ id, title, author, cover }) => ({ id, title, author, cover }));

export function getGenreById(id) {
  return genres.find((g) => g.id === id) || null;
}

export function getBookById(id) {
  return bookCatalog.find((b) => b.id === id) || null;
}

export function getAuthorById(id) {
  return authors.find((a) => a.id === id) || null;
}

export function getBooksByGenre(genreId) {
  return bookCatalog.filter((b) => b.genres.includes(genreId));
}

export function getBooksByAuthor(authorId) {
  return bookCatalog.filter((b) => b.authorId === authorId);
}

export function findBookByTitle(title) {
  if (!title) return null;
  const normalized = title.trim().toLowerCase();
  return (
    bookCatalog.find((b) => b.title.toLowerCase() === normalized) ||
    bookCatalog.find((b) => normalized.includes(b.title.toLowerCase()) || b.title.toLowerCase().includes(normalized)) ||
    null
  );
}

export function searchBooks(query) {
  const q = query.trim().toLowerCase();
  if (!q) return bookCatalog;
  return bookCatalog.filter((book) => {
    const haystack = [
      book.title,
      book.author,
      book.description,
      ...(book.genres || []).map((g) => getGenreById(g)?.label || g),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function searchAuthors(query) {
  const q = query.trim().toLowerCase();
  if (!q) return authors;
  return authors.filter((author) => {
    const haystack = [author.name, author.bio, author.country].filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(q);
  });
}

export function getRelatedPosts(posts, book) {
  if (!book) return [];
  const title = (book.title || '').toLowerCase();
  const bookId = book.id;
  return posts.filter((post) => {
    if (!post.book) return false;
    if (bookId && post.book.bookId === bookId) return true;
    const postTitle = (post.book.title || '').toLowerCase();
    return postTitle === title || postTitle.includes(title) || title.includes(postTitle);
  });
}

export function getStorePostsForBook(posts, book) {
  return getRelatedPosts(posts, book).filter((p) => p.type === 'store');
}

export function getSecondHandPostsForBook(posts, book) {
  return getRelatedPosts(posts, book).filter((p) => p.type === 'sale');
}

export function getDiscussionPostsForBook(posts, book) {
  return getRelatedPosts(posts, book).filter(
    (p) => p.type !== 'sale' && p.type !== 'store',
  );
}

export function sortBooks(books, sortBy) {
  const list = [...books];
  switch (sortBy) {
    case 'rating':
      return list.sort((a, b) => b.avgRating - a.avgRating);
    case 'year':
      return list.sort((a, b) => b.year - a.year);
    case 'title':
      return list.sort((a, b) => a.title.localeCompare(b.title, 'az'));
    default:
      return list;
  }
}

export function getGenreBookCount(genreId) {
  return getBooksByGenre(genreId).length;
}

export function getAuthorBookCount(authorId) {
  return getBooksByAuthor(authorId).length;
}
