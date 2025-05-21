import { makeAutoObservable, runInAction } from 'mobx';
import { Track } from '../types/trackTypes';
import * as trackApi from '../api/trackApi';

export class TrackStore {
  tracks: Track[] = [];
  genres: string[] = [];
  loading = false;
  totalTracks = 0;
  page = 1;
  limit = 10;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchTracks(page = this.page) {
    this.loading = true;
    try {
      const response = await trackApi.fetchTracks(page, this.limit);
      const { data, meta } = response.data;
      runInAction(() => {
        this.tracks = data;
        this.totalTracks = meta.total;
      });
    } catch {
      console.error('Failed to fetch tracks');
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchGenres() {
    try {
      const response = await trackApi.fetchGenres();
      runInAction(() => {
        this.genres = response.data;
      });
    } catch {
      console.error('Failed to fetch genres');
    }
  }

  // TODO: Uncomment and implement this method if needed when we have separate page for track
  // async fetchTrackBySlug(trackId: string): Promise<Track> {
  //   runInAction(() => {
  //     this.loading = true;
  //   });
  //   try {
  //     const { data } = await axios.get<Track>(`/api/tracks/${trackId}`);
  //     runInAction(() => {
  //       const idx = this.tracks.findIndex((t) => t.id === trackId);
  //       if (idx !== -1) this.tracks[idx] = data;
  //     });
  //     return data;
  //   } finally {
  //     runInAction(() => {
  //       this.loading = false;
  //     });
  //   }
  // }

  setPage(page: number) {
    this.page = page;
    this.fetchTracks(page);
  }

  setLimit(limit: number) {
    this.limit = limit;
    this.fetchTracks(this.page);
  }

  async addTrack(track: Track): Promise<Track> {
    const prev = [...this.tracks];
    const tempId = `temp-${Date.now()}`;
    runInAction(() => {
      this.tracks.unshift({ ...track, id: tempId });
    });
    try {
      const { data } = await trackApi.addTrack(track);
      runInAction(() => {
        const idx = this.tracks.findIndex((t) => t.id === tempId);
        if (idx !== -1) this.tracks[idx] = data;
      });
      return data;
    } catch (e) {
      runInAction(() => {
        this.tracks = prev;
      });
      throw e;
    }
  }

  async updateTrack(updated: Track): Promise<Track> {
    const prev = [...this.tracks];
    runInAction(() => {
      const idx = this.tracks.findIndex((t) => t.id === updated.id);
      if (idx !== -1) this.tracks[idx] = updated;
    });
    try {
      const { data } = await trackApi.updateTrack(updated);
      runInAction(() => {
        const idx = this.tracks.findIndex((t) => t.id === data.id);
        if (idx !== -1) this.tracks[idx] = data;
      });
      return data;
    } catch (e) {
      runInAction(() => {
        this.tracks = prev;
      });
      throw e;
    }
  }

  async removeTrack(trackId: string): Promise<void> {
    const prev = [...this.tracks];
    runInAction(() => {
      this.tracks = this.tracks.filter((t) => t.id !== trackId);
    });
    try {
      await trackApi.deleteTrack(trackId);
    } catch (e) {
      runInAction(() => {
        this.tracks = prev;
      });
      throw e;
    }
  }

  async removeTracks(ids: string[]): Promise<void> {
    const prev = [...this.tracks];
    runInAction(() => {
      this.tracks = this.tracks.filter((t) => !ids.includes(t.id));
    });
    try {
      await trackApi.deleteTracks(ids);
    } catch (e) {
      runInAction(() => {
        this.tracks = prev;
      });
      throw e;
    }
  }

  async removeAllTracks(): Promise<void> {
    const all: Track[] = [];
    let page = 1;
    let total = 0;
    const limit = 100;

    do {
      const response = await trackApi.fetchTracks(page, limit);
      const { data, meta } = response.data;
      all.push(...data);
      total = meta.total;
      page++;
    } while (all.length < total);

    const ids = all.map((t) => t.id);
    await this.removeTracks(ids);

    runInAction(() => {
      this.tracks = [];
      this.totalTracks = 0;
      this.page = 1;
    });
  }

  async uploadTrackFile(trackId: string, file: File): Promise<Track> {
    const { data } = await trackApi.uploadTrackFile(trackId, file);
    runInAction(() => {
      const idx = this.tracks.findIndex((t) => t.id === trackId);
      if (idx !== -1) this.tracks[idx] = data;
    });
    return data;
  }

  async removeTrackFile(trackId: string): Promise<void> {
    await trackApi.removeTrackFile(trackId);
    runInAction(() => {
      const idx = this.tracks.findIndex((t) => t.id === trackId);
      if (idx !== -1) this.tracks[idx].fileUrl = undefined;
    });
  }
}
