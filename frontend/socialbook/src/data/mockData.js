export const currentUser = {
  id: 1,
  name: 'Aysel Məmmədova',
  handle: '@aysel_reads',
  initials: 'AM',
  bio: 'Azərbaycan ədəbiyyatı və elmi-fantastika həvəskarı.',
  shelvesRead: 142,
  following: 89,
  followers: 124,
  booksForSale: 3,
};

export const initialShelfBooks = [
  { id: 1, title: 'Dune', author: 'Frank Herbert', cover: '#435A45' },
  { id: 2, title: '1984', author: 'George Orwell', cover: '#22304F' },
  { id: 3, title: 'Əli və Nino', author: 'Kurban Səid', cover: '#B08D3D' },
  { id: 4, title: 'Xəmsə', author: 'Nizami', cover: '#7A2331' },
];

export const initialPosts = [
  {
    id: 1,
    type: 'review',
    user: { name: 'Rəşad Quliyev', handle: '@rashad_g', initials: 'RQ' },
    time: '2 saat əvvəl',
    book: { title: 'Kür qırağının meşələri', author: 'Anar', cover: '#7A2331' },
    rating: 5,
    text: 'Bu kitabı bitirəndən sonra bir müddət heç nə oxumaq istəmədim. Təsvirlər o qədər canlıdır ki, elə bil özün oradasan.',
    likes: 128,
    comments: [
      { id: 1, user: 'Nərmin', text: 'Mən də bu yaxınlarda bitirdim, sonluq məni sarsıtdı.' },
      { id: 2, user: 'Tural', text: 'Siyahıma əlavə etdim, təşəkkürlər!' },
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
    comments: [{ id: 1, user: 'Kamran', text: 'İkinci kitab birincidən də yaxşıdır, davam et!' }],
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
    book: { title: 'Səfillər', author: 'Tolstoy', cover: '#22304F' },
    price: 5.5,
    condition: 'yaxşı',
    text: 'Bir dəfə oxunub, səhifələri təmizdir. Bakı daxilində çatdırılma mümkündür.',
    likes: 19,
    comments: [{ id: 1, user: 'Tural', text: 'Qiymət razılaşma yolu ilə ola bilər?' }],
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
    book: { title: 'Harry Potter və Fəlsəfə Daşı', author: 'J.K. Rowling', cover: '#7A2331' },
    price: 8.0,
    condition: 'orta',
    text: 'Uşaq kitabxanamı təmizləyirəm. 3-cü nəşr, cildində kiçik iz var.',
    likes: 27,
    comments: [],
  },
  {
    id: 8,
    type: 'general',
    user: { name: 'Nərmin Əliyeva', handle: '@narmin.reads', initials: 'NƏ' },
    time: '4 saat əvvəl',
    text: 'Bu həftə sonu oxumaq üçün sakit bir kafe axtarıram — tövsiyəniz var?',
    likes: 15,
    comments: [{ id: 1, user: 'Aysel', text: 'Nizami küçəsindəki Kitab Klubunun yuxarısı yaxşıdır!' }],
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
  },
];

export const trendingBooks = [
  { title: 'Əsli və Kərəm', author: 'Xalq əfsanəsi', cover: '#7A2331' },
  { title: 'Aylı gecələr', author: 'İsa Muğanna', cover: '#435A45' },
  { title: 'Piano dərsi', author: 'M. Süleymanlı', cover: '#B08D3D' },
  { title: '1984', author: 'George Orwell', cover: '#22304F' },
];

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
    shelfBooks: [
      { id: 101, title: 'Kür qırağının meşələri', author: 'Anar', cover: '#7A2331' },
      { id: 102, title: 'Xəmsə', author: 'Nizami', cover: '#435A45' },
      { id: 103, title: 'Faust', author: 'Goethe', cover: '#22304F' },
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
    shelfBooks: [
      { id: 201, title: 'Səfillər', author: 'Tolstoy', cover: '#22304F' },
      { id: 202, title: 'Anna Karenina', author: 'Tolstoy', cover: '#7A2331' },
      { id: 203, title: 'Crime and Punishment', author: 'Dostoyevski', cover: '#B08D3D' },
      { id: 204, title: 'Pride and Prejudice', author: 'Jane Austen', cover: '#435A45' },
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
    shelfBooks: [
      { id: 301, title: 'Harry Potter və Fəlsəfə Daşı', author: 'J.K. Rowling', cover: '#7A2331' },
      { id: 302, title: 'Hobbit', author: 'Tolkien', cover: '#435A45' },
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
      { id: 401, title: 'Dune', author: 'Frank Herbert', cover: '#435A45' },
      { id: 402, title: 'Foundation', author: 'Asimov', cover: '#22304F' },
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
      { id: 501, title: 'Qarabağ — silsilə', author: 'Müxtəlif', cover: '#7A2331' },
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

export const notifications = [
  { id: 1, text: 'Rəşad Quliyev rəyini bəyəndi', time: '10 dəq əvvəl', read: false },
  { id: 2, text: 'Kitab Klubu yeni elan paylaşdı', time: '1 saat əvvəl', read: false },
  { id: 3, text: 'Nərmin satış elanına şərh yazdı', time: '3 saat əvvəl', read: true },
  { id: 4, text: 'Tural səni izləməyə başladı', time: 'dünən', read: true },
];

export const formatPrice = (amount) => `${Number(amount).toFixed(2)} ₼`;

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
    'Rəf — kitabsevərlər, oxucular və mağazalar üçün sosial platformadır. Burada kitab haqqında fikir paylaşa, oxuma irəliləyişini qeyd edə, eləcə də kitab ala və sata bilərsən.',
    'Missiyamız oxumağı bir icma təcrübəsinə çevirməkdir. Gələcəkdə mağazalar və istifadəçilər birbaşa platforma üzərindən əlaqə saxlayacaq.',
    'Hazırda layihə inkişaf mərhələsindədir. Təklif və iradlərinizi gözləyirik.',
  ],
};

export const termsContent = {
  title: 'İstifadə şərtləri',
  sections: [
    {
      heading: '1. Ümumi qaydalar',
      text: 'Rəf platformasından istifadə edərkən Azərbaycan Respublikasının qanunvericiliyinə və ictimai davranış normalarına riayət etməlisiniz.',
    },
    {
      heading: '2. Məzmun',
      text: 'Paylaşdığınız postlar, şərhlər və satış elanları sizin məsuliyyətinizdir. Təhqiredici, saxta və qanunsuz məzmun qadağandır.',
    },
    {
      heading: '3. Satış elanları',
      text: 'İstifadəçi və mağaza elanlarında göstərilən məlumatların düzgünlüyünə görə paylaşan tərəf məsuliyyət daşıyır.',
    },
    {
      heading: '4. Məxfilik',
      text: 'Şəxsi məlumatlarınız yalnız xidmətin göstərilməsi məqsədilə emal olunur. Ətraflı məlumat backend inteqrasiyasından sonra yenilənəcək.',
    },
  ],
};
