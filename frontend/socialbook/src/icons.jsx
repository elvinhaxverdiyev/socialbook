import UilAngleDown from '@iconscout/react-unicons/icons/uil-angle-down';
import UilAngleLeft from '@iconscout/react-unicons/icons/uil-angle-left';
import UilAngleRight from '@iconscout/react-unicons/icons/uil-angle-right';
import UilArrowLeft from '@iconscout/react-unicons/icons/uil-arrow-left';
import UilArrowRight from '@iconscout/react-unicons/icons/uil-arrow-right';
import UilBan from '@iconscout/react-unicons/icons/uil-ban';
import UilBars from '@iconscout/react-unicons/icons/uil-bars';
import UilBell from '@iconscout/react-unicons/icons/uil-bell';
import UilBookmark from '@iconscout/react-unicons/icons/uil-bookmark';
import UilBookOpen from '@iconscout/react-unicons/icons/uil-book-open';
import UilBooks from '@iconscout/react-unicons/icons/uil-books';
import UilCamera from '@iconscout/react-unicons/icons/uil-camera';
import UilChartLine from '@iconscout/react-unicons/icons/uil-chart-line';
import UilCheck from '@iconscout/react-unicons/icons/uil-check';
import UilCheckCircle from '@iconscout/react-unicons/icons/uil-check-circle';
import UilClock from '@iconscout/react-unicons/icons/uil-clock';
import UilComment from '@iconscout/react-unicons/icons/uil-comment';
import UilEllipsisV from '@iconscout/react-unicons/icons/uil-ellipsis-v';
import UilFileAlt from '@iconscout/react-unicons/icons/uil-file-alt';
import UilHeart from '@iconscout/react-unicons/icons/uil-heart';
import UilHome from '@iconscout/react-unicons/icons/uil-home';
import UilImagePlus from '@iconscout/react-unicons/icons/uil-image-plus';
import UilInfoCircle from '@iconscout/react-unicons/icons/uil-info-circle';
import UilLayerGroup from '@iconscout/react-unicons/icons/uil-layer-group';
import UilMapMarker from '@iconscout/react-unicons/icons/uil-map-marker';
import UilMessage from '@iconscout/react-unicons/icons/uil-message';
import UilMoon from '@iconscout/react-unicons/icons/uil-moon';
import UilPalette from '@iconscout/react-unicons/icons/uil-palette';
import UilPen from '@iconscout/react-unicons/icons/uil-pen';
import UilPhone from '@iconscout/react-unicons/icons/uil-phone';
import UilPlus from '@iconscout/react-unicons/icons/uil-plus';
import UilRefresh from '@iconscout/react-unicons/icons/uil-refresh';
import UilSearch from '@iconscout/react-unicons/icons/uil-search';
import UilSetting from '@iconscout/react-unicons/icons/uil-setting';
import UilShareAlt from '@iconscout/react-unicons/icons/uil-share-alt';
import UilSignin from '@iconscout/react-unicons/icons/uil-signin';
import UilSignout from '@iconscout/react-unicons/icons/uil-signout';
import UilSlidersVAlt from '@iconscout/react-unicons/icons/uil-sliders-v-alt';
import UilStar from '@iconscout/react-unicons/icons/uil-star';
import UilStore from '@iconscout/react-unicons/icons/uil-store';
import UilSun from '@iconscout/react-unicons/icons/uil-sun';
import UilTagAlt from '@iconscout/react-unicons/icons/uil-tag-alt';
import UilTimes from '@iconscout/react-unicons/icons/uil-times';
import UilTrashAlt from '@iconscout/react-unicons/icons/uil-trash-alt';
import UilUser from '@iconscout/react-unicons/icons/uil-user';
import UilUserCheck from '@iconscout/react-unicons/icons/uil-user-check';
import UilUserPlus from '@iconscout/react-unicons/icons/uil-user-plus';
import UilUsersAlt from '@iconscout/react-unicons/icons/uil-users-alt';

function wrap(FilledIcon, LineIcon = FilledIcon) {
  function Icon({
    size = 24,
    color = 'currentColor',
    fill,
    className,
    strokeWidth: _strokeWidth,
    ...rest
  }) {
    const filled = Boolean(fill && fill !== 'none');
    const Cmp = filled ? FilledIcon : LineIcon;
    const paint = filled ? fill : color;
    return <Cmp size={size} color={paint} className={className} {...rest} />;
  }

  return Icon;
}

function pathIcon(d) {
  function Icon({
    size = 24,
    color = 'currentColor',
    fill,
    className,
    strokeWidth: _strokeWidth,
    ...rest
  }) {
    const paint = fill && fill !== 'none' ? fill : color;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={paint}
        className={className}
        {...rest}
      >
        <path d={d} />
      </svg>
    );
  }

  return Icon;
}

const FilledHome = pathIcon(
  'M21.7,10.3l-9-8c-.4-.3-.9-.3-1.3,0l-9,8c-.4.4-.5,1-.1,1.4s1,.5,1.4.1L4,11.4V21c0,.6.4,1,1,1h5v-7h4v7h5c.6,0,1-.4,1-1v-9.6l.3.3c.4.4,1,.3,1.4-.1.4-.4.4-1.1,0-1.4Z',
);
const FilledHeart = pathIcon(
  'M20.16,5A6.29,6.29,0,0,0,12,4.36,6.27,6.27,0,0,0,3.84,14.48l6.21,6.22a2.78,2.78,0,0,0,3.9,0l6.21-6.22A6.27,6.27,0,0,0,20.16,5Z',
);
const FilledStar = pathIcon(
  'M22,10.1c.1-.5-.3-1.1-.8-1.1l-5.7-.8L12.9,3c-.2-.4-.8-.6-1.2-.3-.2.1-.3.2-.4.4L8.6,8.2,2.9,9c-.3,0-.5.1-.6.3-.4.4-.4,1,0,1.4l4.1,4-1,5.7c0,.2,0,.4.1.6.3.5.9.7,1.4.4L12,18.7l5.1,2.7c.1.1.3.1.5.1h.2c.5-.1.9-.6.8-1.2l-1-5.7,4.1-4c.2-.2.3-.4.3-.6Z',
);
const FilledBookmark = pathIcon(
  'M16,2H8C6.3,2,5,3.3,5,5v16c0,.2,0,.3.1.5.3.5.9.6,1.4.4L12,18.7l5.5,3.2c.2.1.3.1.5.1.6,0,1-.4,1-1V5C19,3.3,17.7,2,16,2Z',
);
const FilledUser = pathIcon(
  'M12,12a5,5,0,1,0-5-5A5,5,0,0,0,12,12Zm0,2c-4.42,0-8,2.24-8,5v2H20V19C20,16.24,16.42,14,12,14Z',
);
const FilledBook = pathIcon(
  'M18,2H8A3,3,0,0,0,5,5V19a3,3,0,0,0,3,3H18a1,1,0,0,0,1-1V3A1,1,0,0,0,18,2ZM8,4H17V16H8.5A1.5,1.5,0,0,0,7,17.5V5A1,1,0,0,1,8,4ZM8,20a1,1,0,0,1,0-2H17v2Z',
);
const FilledStore = pathIcon(
  'M20,7.2,18.4,3.5A2,2,0,0,0,16.5,2.3H7.5A2,2,0,0,0,5.6,3.5L4,7.2A3.5,3.5,0,0,0,6,13.6V20a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V13.6A3.5,3.5,0,0,0,20,7.2ZM10,20V15h4v5Z',
);
const FilledBell = pathIcon(
  'M18,13V10a6,6,0,0,0-5-5.91V3a1,1,0,0,0-2,0V4.09A6,6,0,0,0,6,10v3A3,3,0,0,0,4,16v2H8.14a4,4,0,0,0,7.72,0H20V16A3,3,0,0,0,18,13ZM12,22a2,2,0,0,1-2-2h4A2,2,0,0,1,12,22Z',
);
const FilledSearch = pathIcon(
  'M10,2a8,8,0,1,0,4.9,14.3L20,21.4,21.4,20l-5.1-5.1A8,8,0,0,0,10,2Z',
);
const FilledSettings = pathIcon(
  'M19.9,12.66a1,1,0,0,1,0-1.32l1.28-1.44a1,1,0,0,0,.12-1.17l-2-3.46a1,1,0,0,0-1.07-.48l-1.88.38a1,1,0,0,1-1.15-.66l-.61-1.83a1,1,0,0,0-.95-.68h-4a1,1,0,0,0-1,.68l-.56,1.83a1,1,0,0,1-1.15.66L5,4.79a1,1,0,0,0-1,.48L2,8.73a1,1,0,0,0,.1,1.17l1.27,1.44a1,1,0,0,1,0,1.32L2.1,14.1a1,1,0,0,0-.1,1.17l2,3.46a1,1,0,0,0,1.07.48l1.88-.38a1,1,0,0,1,1.15.66l.61,1.83a1,1,0,0,0,1,.68h4a1,1,0,0,0,.95-.68l.61-1.83a1,1,0,0,1,1.15-.66l1.88.38a1,1,0,0,0,1.07-.48l2-3.46a1,1,0,0,0-.12-1.17ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z',
);
const FilledUsers = pathIcon(
  'M12.3,12.22A4.92,4.92,0,0,0,14,8.5a5,5,0,0,0-10,0,4.92,4.92,0,0,0,1.7,3.72A8,8,0,0,0,1,19.5a1,1,0,0,0,1,.94H17a1,1,0,0,0,1-.94A8,8,0,0,0,12.3,12.22ZM23,19.5a1,1,0,0,1-1,1H19a1,1,0,0,1,0-2h1.6A6,6,0,0,0,16.4,13a1,1,0,0,1,.3-2,5,5,0,0,1,4.9,6.1A1,1,0,0,1,23,19.5ZM16,8.5A3,3,0,1,1,13,5.5,3,3,0,0,1,16,8.5Z',
);
const FilledMapPin = pathIcon(
  'M12,2A7,7,0,0,0,5,9c0,5.25,7,13,7,13s7-7.75,7-13A7,7,0,0,0,12,2Zm0,9.5A2.5,2.5,0,1,1,14.5,9,2.5,2.5,0,0,1,12,11.5Z',
);
const FilledShare = pathIcon(
  'M18,14a4,4,0,0,0-3.08,1.48l-6.09-3.05a3.9,3.9,0,0,0,0-1.86l6.09-3.05A4,4,0,1,0,14,5a4,4,0,0,0,.08.76L8,8.81a4,4,0,1,0,0,6.38l6.09,3.05A4,4,0,1,0,18,14Z',
);
const FilledSend = pathIcon(
  'M21.15,2.57a1.25,1.25,0,0,0-1.27-.22L2.51,9.46a1.24,1.24,0,0,0,.13,2.33l7.52,2.52,2.52,7.52a1.23,1.23,0,0,0,1.16.8h.06a1.24,1.24,0,0,0,1.11-1L21.65,3.84A1.25,1.25,0,0,0,21.15,2.57Z',
);
const FilledCamera = pathIcon(
  'M19,6H17.4l-.7-1.1A2,2,0,0,0,15,4H9A2,2,0,0,0,7.3,4.9L6.6,6H5A3,3,0,0,0,2,9V18a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V9A3,3,0,0,0,19,6ZM12,17a4,4,0,1,1,4-4A4,4,0,0,1,12,17Z',
);
const FilledPhone = pathIcon(
  'M19.44,13c-3.31-1.2-4.24-1.53-4.71-.31l-.7,1.32a1,1,0,0,1-1.2.47,12.3,12.3,0,0,1-6.31-6.31,1,1,0,0,1,.47-1.2l1.32-.7c1.23-.47.9-1.4-.31-4.71A1,1,0,0,0,6.87,1H4.56A2.5,2.5,0,0,0,2.08,3.72,18.27,18.27,0,0,0,20.28,21.92,2.5,2.5,0,0,0,23,19.44V17.13A1,1,0,0,0,19.44,13Z',
);
const FilledImage = pathIcon(
  'M19,3H5A3,3,0,0,0,2,6V18a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V6A3,3,0,0,0,19,3ZM5,19l4.5-6,3.1,4.1L15.5,13,19,19Z',
);
const FilledPen = pathIcon(
  'M21,6.41,17.59,3a1,1,0,0,0-1.42,0L3.29,16a1,1,0,0,0-.29.71V20a1,1,0,0,0,1,1H7.29a1,1,0,0,0,.71-.29L21,7.83A1,1,0,0,0,21,6.41Z',
);
const FilledMoon = pathIcon(
  'M21.1,13.32A8.5,8.5,0,0,1,10.68,2.9,1,1,0,0,0,9.22,2.1,10.5,10.5,0,1,0,21.9,14.78,1,1,0,0,0,21.1,13.32Z',
);
const FilledSun = pathIcon(
  'M12,6a6,6,0,1,0,6,6A6,6,0,0,0,12,6ZM12,2a1,1,0,0,0-1,1V5a1,1,0,0,0,2,0V3A1,1,0,0,0,12,2Zm0,16a1,1,0,0,0-1,1v2a1,1,0,0,0,2,0V19A1,1,0,0,0,12,18ZM4.22,4.22A1,1,0,0,0,2.81,5.64L4.22,7.05A1,1,0,1,0,5.64,5.63ZM19.78,19.78a1,1,0,0,0-1.41,0l-1.42,1.41a1,1,0,0,0,1.41,1.42l1.42-1.42A1,1,0,0,0,19.78,19.78ZM2,12a1,1,0,0,0,1,1H5a1,1,0,0,0,0-2H3A1,1,0,0,0,2,12Zm16,0a1,1,0,0,0,1,1h2a1,1,0,0,0,0-2H19A1,1,0,0,0,18,12ZM4.22,19.78a1,1,0,0,0,1.42,0l1.41-1.42A1,1,0,0,0,5.64,16.95L4.22,18.36A1,1,0,0,0,4.22,19.78ZM18.36,5.64,19.78,4.22A1,1,0,0,0,18.36,2.81L16.95,4.22A1,1,0,0,0,18.36,5.64Z',
);
const FilledInfo = pathIcon(
  'M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,4.5A1.5,1.5,0,1,1,10.5,8,1.5,1.5,0,0,1,12,6.5ZM13,17H11a1,1,0,0,1,0-2h.5V12H11a1,1,0,0,1,0-2h2a1,1,0,0,1,1,1v4H14a1,1,0,0,1,0,2Z',
);
const FilledFile = pathIcon(
  'M19,3H8A3,3,0,0,0,5,6V18a3,3,0,0,0,3,3H19a1,1,0,0,0,1-1V4A1,1,0,0,0,19,3ZM9,8h7a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm6,8H9a1,1,0,0,1,0-2h6a1,1,0,0,1,0,2Zm2-4H9a1,1,0,0,1,0-2h8a1,1,0,0,1,0,2Z',
);
const FilledBan = pathIcon(
  'M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm7,10a7,7,0,0,1-11.6,5.3L17.3,7.4A6.9,6.9,0,0,1,19,12ZM7.4,6.7,16.6,15.9A7,7,0,0,1,7.4,6.7Z',
);
const FilledTag = pathIcon(
  'M21.12,10.71,13.29,2.88A3,3,0,0,0,11.17,2H5A3,3,0,0,0,2,5v6.17a3,3,0,0,0,.88,2.12l7.83,7.83a3,3,0,0,0,4.24,0l6.17-6.17A3,3,0,0,0,21.12,10.71ZM7.5,8A1.5,1.5,0,1,1,9,6.5,1.5,1.5,0,0,1,7.5,8Z',
);
const FilledPalette = pathIcon(
  'M12,2A10,10,0,0,0,8.56,21.7,1,1,0,0,0,10,20.9V20a3,3,0,0,1,3-3h3.1a2.9,2.9,0,0,0,2.87-2.37A10,10,0,0,0,12,2ZM7.5,11A1.5,1.5,0,1,1,9,9.5,1.5,1.5,0,0,1,7.5,11ZM9.5,7A1.5,1.5,0,1,1,11,5.5,1.5,1.5,0,0,1,9.5,7ZM14.5,7A1.5,1.5,0,1,1,16,5.5,1.5,1.5,0,0,1,14.5,7ZM16.5,11A1.5,1.5,0,1,1,18,9.5,1.5,1.5,0,0,1,16.5,11Z',
);
const FilledTrash = pathIcon(
  'M20,6H16V5a3,3,0,0,0-3-3H11A3,3,0,0,0,8,5V6H4A1,1,0,0,0,4,8H5V19a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V8h1a1,1,0,0,0,0-2ZM10,5a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1V6H10Z',
);
const FilledPlusUser = pathIcon(
  'M11,12A5,5,0,1,0,6,7,5,5,0,0,0,11,12Zm0,2c-3.54,0-6.63,1.79-8,4.5A1,1,0,0,0,4,20h9.17A6,6,0,0,1,20,14.17V14C20,12.24,16.42,14,11,14ZM20,16H18V14a1,1,0,0,0-2,0v2H14a1,1,0,0,0,0,2h2v2a1,1,0,0,0,2,0V18h2a1,1,0,0,0,0-2Z',
);
const FilledUserCheck = pathIcon(
  'M11,12A5,5,0,1,0,6,7,5,5,0,0,0,11,12Zm0,2c-3.54,0-6.63,1.79-8,4.5A1,1,0,0,0,4,20h8.5a6,6,0,0,1-.4-6.1C11.73,14,11.37,14,11,14Zm10.71-2.71-3,3a1,1,0,0,1-1.42,0l-1.5-1.5a1,1,0,0,1,1.42-1.42L18,12.17l2.29-2.3a1,1,0,0,1,1.42,1.42Z',
);
const FilledBooks = pathIcon(
  'M9,3H5A2,2,0,0,0,3,5V19a2,2,0,0,0,2,2H9a2,2,0,0,0,2-2V5A2,2,0,0,0,9,3Zm10,0H15a2,2,0,0,0-2,2V19a2,2,0,0,0,2,2h4a2,2,0,0,0,2-2V5A2,2,0,0,0,19,3Z',
);
const FilledChart = pathIcon(
  'M21,20H4V5A1,1,0,0,0,2,5V20a2,2,0,0,0,2,2H21a1,1,0,0,0,0-2Zm-3-8a1,1,0,0,0-1,1v5a1,1,0,0,0,2,0V13A1,1,0,0,0,18,12Zm-5-4a1,1,0,0,0-1,1v9a1,1,0,0,0,2,0V9A1,1,0,0,0,13,8ZM8,14a1,1,0,0,0-1,1v3a1,1,0,0,0,2,0V15A1,1,0,0,0,8,14Z',
);
const FilledLogin = pathIcon(
  'M20,12a1,1,0,0,0-1-1H11.41l2.3-2.29A1,1,0,0,0,12.29,7.29l-4,4a1,1,0,0,0,0,1.42l4,4a1,1,0,0,0,1.42-1.42L11.41,13H19A1,1,0,0,0,20,12ZM17,2H7A3,3,0,0,0,4,5V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V16a1,1,0,0,0-2,0v3a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V5A1,1,0,0,1,7,4H17a1,1,0,0,1,1,1V8a1,1,0,0,0,2,0V5A3,3,0,0,0,17,2Z',
);
const FilledSliders = pathIcon(
  'M7,6A3,3,0,0,0,4.17,8H3A1,1,0,0,0,3,10H4.17a3,3,0,0,0,5.66,0H21a1,1,0,0,0,0-2H9.83A3,3,0,0,0,7,6ZM17,14a3,3,0,0,0-2.83,2H3a1,1,0,0,0,0,2H14.17a3,3,0,0,0,5.66,0H21a1,1,0,0,0,0-2H19.83A3,3,0,0,0,17,14Z',
);
const FilledFlag = pathIcon(
  'M5,3A1,1,0,0,0,4,4V21a1,1,0,0,0,2,0V17H18.3a1,1,0,0,0,.86-1.5L16.4,11.5l2.76-4A1,1,0,0,0,18.3,6H6V4A1,1,0,0,0,5,3Z',
);
const FilledCheckDouble = pathIcon(
  'M8.7,16.29a1,1,0,0,1-1.41,0L3.58,12.58A1,1,0,0,1,5,11.16l2.29,2.3,5.3-5.3A1,1,0,0,1,14,9.58Zm11.71-6.71a1,1,0,0,0-1.41,0l-6.3,6.29a1,1,0,0,0,1.41,1.42l6.3-6.3A1,1,0,0,0,20.41,9.58Z',
);

export const Home = wrap(FilledHome, UilHome);
export const BookOpen = wrap(FilledBook, UilBookOpen);
export const User = wrap(FilledUser, UilUser);
export const UserRound = wrap(FilledUser, UilUser);
export const Store = wrap(FilledStore, UilStore);
export const Bell = wrap(FilledBell, UilBell);
export const Bookmark = wrap(FilledBookmark, UilBookmark);
export const BookMarked = wrap(FilledBookmark, UilBookmark);
export const Settings = wrap(FilledSettings, UilSetting);
export const LogIn = wrap(FilledLogin, UilSignin);
export const LogOut = wrap(UilSignout);
export const Menu = wrap(UilBars);
export const Search = wrap(FilledSearch, UilSearch);
export const Star = wrap(FilledStar, UilStar);
export const Heart = wrap(FilledHeart, UilHeart);
export const MessageCircle = wrap(UilComment);
export const Send = wrap(FilledSend, UilMessage);
export const X = wrap(UilTimes);
export const Ban = wrap(FilledBan, UilBan);
export const FileText = wrap(FilledFile, UilFileAlt);
export const Users = wrap(FilledUsers, UilUsersAlt);
export const Info = wrap(FilledInfo, UilInfoCircle);
export const Moon = wrap(FilledMoon, UilMoon);
export const Sun = wrap(FilledSun, UilSun);
export const ChevronRight = wrap(UilAngleRight);
export const ChevronLeft = wrap(UilAngleLeft);
export const ChevronDown = wrap(UilAngleDown);
export const ArrowLeft = wrap(UilArrowLeft);
export const ArrowRight = wrap(UilArrowRight);
export const MapPin = wrap(FilledMapPin, UilMapMarker);
export const BadgeCheck = wrap(UilCheckCircle);
export const CheckCircle2 = wrap(UilCheckCircle);
export const Clock = wrap(UilClock);
export const Phone = wrap(FilledPhone, UilPhone);
export const Share2 = wrap(FilledShare, UilShareAlt);
export const Tag = wrap(FilledTag, UilTagAlt);
export const Camera = wrap(FilledCamera, UilCamera);
export const ImagePlus = wrap(FilledImage, UilImagePlus);
export const Palette = wrap(FilledPalette, UilPalette);
export const RotateCcw = wrap(UilRefresh);
export const Check = wrap(UilCheck);
export const Plus = wrap(UilPlus);
export const Trash2 = wrap(FilledTrash, UilTrashAlt);
export const Pencil = wrap(FilledPen, UilPen);
export const UserPlus = wrap(FilledPlusUser, UilUserPlus);
export const UserCheck = wrap(FilledUserCheck, UilUserCheck);
export const Library = wrap(FilledBooks, UilBooks);
export const MoreVertical = wrap(UilEllipsisV);
export const TrendingUp = wrap(FilledChart, UilChartLine);
export const Layers = wrap(UilLayerGroup);
export const SlidersHorizontal = wrap(FilledSliders, UilSlidersVAlt);
export const Flag = wrap(FilledFlag);
export const CheckCheck = wrap(FilledCheckDouble, UilCheck);
