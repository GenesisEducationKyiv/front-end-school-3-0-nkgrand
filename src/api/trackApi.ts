import axios from 'axios';
import { type Track } from '../schemas/track.schema';

export const fetchTracks = (page?: number, limit?: number) =>
  axios.get('/api/tracks', { params: { page, limit } });

export const fetchGenres = () => axios.get('/api/genres');

export const addTrack = (track: Track) =>
  axios.post<Track>('/api/tracks', track);

export const updateTrack = (track: Track) =>
  axios.put<Track>(`/api/tracks/${track.id}`, track);

export const deleteTrack = (trackId: string) =>
  axios.delete(`/api/tracks/${trackId}`);

export const deleteTracks = (ids: string[]) =>
  axios.post('/api/tracks/delete', { ids });

export const uploadTrackFile = (trackId: string, file: File) => {
  const form = new FormData();
  form.append('file', file);
  return axios.post<Track>(`/api/tracks/${trackId}/upload`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const removeTrackFile = (trackId: string) =>
  axios.delete(`/api/tracks/${trackId}/file`);
