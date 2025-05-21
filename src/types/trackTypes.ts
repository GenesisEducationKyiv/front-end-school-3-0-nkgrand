export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  audioFile: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  genres: string[];
  slug: string;
  fileUrl?: string;
}