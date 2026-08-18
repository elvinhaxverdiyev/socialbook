import hero01 from '../assets/avatars/hero-01.svg';
import hero02 from '../assets/avatars/hero-02.svg';
import hero03 from '../assets/avatars/hero-03.svg';
import hero04 from '../assets/avatars/hero-04.svg';
import hero05 from '../assets/avatars/hero-05.svg';
import hero06 from '../assets/avatars/hero-06.svg';
import hero07 from '../assets/avatars/hero-07.svg';
import hero08 from '../assets/avatars/hero-08.svg';
import hero09 from '../assets/avatars/hero-09.svg';
import hero10 from '../assets/avatars/hero-10.svg';
import hero11 from '../assets/avatars/hero-11.svg';
import hero12 from '../assets/avatars/hero-12.svg';
import hero13 from '../assets/avatars/hero-13.svg';
import hero14 from '../assets/avatars/hero-14.svg';
import hero15 from '../assets/avatars/hero-15.svg';

export const avatarPresets = [
  { id: 'hero-01', name: 'Paul', book: 'Dune', src: hero01 },
  { id: 'hero-02', name: 'Winston', book: '1984', src: hero02 },
  { id: 'hero-03', name: 'Harry', book: 'Harry Potter', src: hero03 },
  { id: 'hero-04', name: 'Sherlock', book: 'Sherlock Holmes', src: hero04 },
  { id: 'hero-05', name: 'Alice', book: 'Alice in Wonderland', src: hero05 },
  { id: 'hero-06', name: 'Gatsby', book: 'Great Gatsby', src: hero06 },
  { id: 'hero-07', name: 'Dracula', book: 'Dracula', src: hero07 },
  { id: 'hero-08', name: 'Elizabeth', book: 'Pride & Prejudice', src: hero08 },
  { id: 'hero-09', name: 'Hamlet', book: 'Hamlet', src: hero09 },
  { id: 'hero-10', name: 'Don Quixote', book: 'Don Quixote', src: hero10 },
  { id: 'hero-11', name: 'Odysseus', book: 'Odyssey', src: hero11 },
  { id: 'hero-12', name: 'Şəhrazad', book: 'Min bir gecə', src: hero12 },
  { id: 'hero-13', name: 'Əli', book: 'Əli və Nino', src: hero13 },
  { id: 'hero-14', name: 'Nizami', book: 'Xəmsə', src: hero14 },
  { id: 'hero-15', name: 'Kiçik Prins', book: 'Le Petit Prince', src: hero15 },
];

export function findAvatarPreset(src) {
  if (!src) return null;
  return avatarPresets.find((preset) => preset.src === src) ?? null;
}

export function resolveAvatarPresetUrl(presetId) {
  if (!presetId) return null;
  return avatarPresets.find((preset) => preset.id === presetId)?.src ?? null;
}
