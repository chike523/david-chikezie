/**
 * Tracks for the music tab. No audio is played on the site; each track links out.
 */

export type Track = {
  title: string;
  artist: string;
  /** Spotify, Apple Music, or any link. */
  href: string;
  /** Artwork under /public, or undefined for a placeholder. */
  src?: string;
};

export const playlist = {
  name: "long roads, late nights",
  description: "98 songs, mostly for long roads and late nights. Tap a track to open it.",
  total: 98,
  href: "https://open.spotify.com/",
};

export const tracks: Track[] = [
  { title: "Placeholder Song One", artist: "An Artist", href: "https://open.spotify.com/" },
  { title: "Placeholder Song Two", artist: "Another Artist", href: "https://open.spotify.com/" },
  { title: "Placeholder Song Three", artist: "A Band", href: "https://open.spotify.com/" },
  { title: "Placeholder Song Four", artist: "A Duo", href: "https://open.spotify.com/" },
  { title: "Placeholder Song Five", artist: "Someone", href: "https://open.spotify.com/" },
  { title: "Placeholder Song Six", artist: "Someone Else", href: "https://open.spotify.com/" },
  { title: "Placeholder Song Seven", artist: "The Locals", href: "https://open.spotify.com/" },
  { title: "Placeholder Song Eight", artist: "Late Night Trio", href: "https://open.spotify.com/" },
];
