import { makeAutoObservable, runInAction } from 'mobx';
import {
  tracksResponseSchema,
  trackSchema,
  type Track,
} from '../schemas/track.schema';
import * as trackApi from '../api/trackApi';
import { isError } from '../utils/isError';
import { z } from 'zod';
import { Result, ok, err } from 'neverthrow';

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

  async fetchTracks(page = this.page): Promise<void> {
    this.loading = true;

    const result: Result<unknown, Error> = await trackApi
      .fetchTracks(page, this.limit)
      .then((res) => ok(res.data))
      .catch((e: unknown) => err(isError(e) ? e : new Error(String(e))));

    result.match(
      (data) => {
        const parsed = tracksResponseSchema.safeParse(data);
        if (!parsed.success) {
          console.error('Zod validation failed:', parsed.error.format());
          return;
        }

        runInAction(() => {
          this.tracks = parsed.data.data;
          this.totalTracks = parsed.data.meta.total;
        });
      },
      (e) => {
        console.error('Failed to fetch tracks:', e.message);
      },
    );

    runInAction(() => {
      this.loading = false;
    });
  }

  async fetchGenres(): Promise<void> {
    const result: Result<unknown, Error> = await trackApi
      .fetchGenres()
      .then((res) => ok(res.data))
      .catch((e: unknown) => err(isError(e) ? e : new Error(String(e))));

    result.match(
      (data) => {
        const parsed = z.array(z.string()).safeParse(data);
        if (!parsed.success) {
          console.error('Zod validation failed:', parsed.error.format());
          return;
        }

        runInAction(() => {
          this.genres = parsed.data;
        });
      },
      (e) => {
        console.error('Failed to fetch genres:', e.message);
      }
    );
  }

  setPage(page: number): void {
    this.page = page;
    void this.fetchTracks(page);
  }

  setLimit(limit: number): void {
    this.limit = limit;
    void this.fetchTracks(this.page);
  }

  // async addTrack(track: Track): Promise<Track> {
  //   const prev = [...this.tracks];
  //   const tempId = `temp-${String(Date.now())}`;

  //   runInAction(() => {
  //     this.tracks.unshift({ ...track, id: tempId });
  //   });

  //   const result: Result<unknown, Error> = await trackApi
  //     .addTrack(track)
  //     .then((res) => ok(res.data))
  //     .catch((e: unknown) => err(isError(e) ? e : new Error(String(e))));

  //   return result.match(
  //     (raw) => {
  //       const parsed = trackSchema.safeParse(raw);
  //       if (!parsed.success) {
  //         console.error('Zod validation failed:', parsed.error.format());

  //         runInAction(() => {
  //           this.tracks = prev;
  //         });

  //         throw new Error('Invalid track data received from server');
  //       }

  //       const data = parsed.data;

  //       runInAction(() => {
  //         const idx = this.tracks.findIndex((t) => t.id === tempId);
  //         if (idx !== -1) this.tracks[idx] = data;
  //       });

  //       return data;
  //     },
  //     (e) => {
  //       runInAction(() => {
  //         this.tracks = prev;
  //       });

  //       throw e;
  //     }
  //   );
  // }

  async addTrack(track: Track): Promise<Result<Track, Error>> {
    const prev = [...this.tracks];
    const tempId = `temp-${Date.now()}`;

    runInAction(() => {
      this.tracks.unshift({ ...track, id: tempId });
    });

    const result = await trackApi
      .addTrack(track)
      .then((res) => ok(res.data))
      .catch((e) => err(isError(e) ? e : new Error(String(e))));

    return result.match<Result<Track, Error>>(
      (raw) => {
        const parsed = trackSchema.safeParse(raw);
        if (!parsed.success) {
          console.error('Zod validation failed:', parsed.error.format());
          runInAction(() => (this.tracks = prev));
          return err(new Error('Invalid track data received from server'));
        }

        const data = parsed.data;

      runInAction(() => {
        const idx = this.tracks.findIndex((t) => t.id === tempId);
        if (idx !== -1) this.tracks[idx] = data;
      });

        return ok(data);
      },
      (e) => {
        runInAction(() => (this.tracks = prev));
        return err(e);
    }
    );
  }


  // async updateTrack(updated: Track): Promise<Track> {
  //   const prev = [...this.tracks];

  //   runInAction(() => {
  //     const idx = this.tracks.findIndex((t) => t.id === updated.id);
  //     if (idx !== -1) this.tracks[idx] = updated;
  //   });

  //   const result: Result<unknown, Error> = await trackApi
  //     .updateTrack(updated)
  //     .then((res) => ok(res.data))
  //     .catch((e: unknown) => err(isError(e) ? e : new Error(String(e))));

  //   return result.match(
  //     (raw) => {
  //       const parsed = trackSchema.safeParse(raw);
  //       if (!parsed.success) {
  //         console.error('Zod validation failed:', parsed.error.format());

  //         runInAction(() => {
  //           this.tracks = prev;
  //         });

  //         throw new Error('Invalid track data received from server');
  //       }

  //       const data = parsed.data;

  //       runInAction(() => {
  //         const idx = this.tracks.findIndex((t) => t.id === data.id);
  //         if (idx !== -1) this.tracks[idx] = data;
  //       });

  //       return data;
  //     },
  //     (e) => {
  //       runInAction(() => {
  //         this.tracks = prev;
  //       });

  //       throw e;
  //     }
  //   );
  // }

  async updateTrack(updated: Track): Promise<Result<Track, Error>> {
    const prev = [...this.tracks];

    runInAction(() => {
      const idx = this.tracks.findIndex((t) => t.id === updated.id);
      if (idx !== -1) this.tracks[idx] = updated;
    });

    const result = await trackApi
      .updateTrack(updated)
      .then((res) => ok(res.data))
      .catch((e) => err(isError(e) ? e : new Error(String(e))));

    return result.match<Result<Track, Error>>(
      (raw) => {
        const parsed = trackSchema.safeParse(raw);
        if (!parsed.success) {
          console.error('Zod validation failed:', parsed.error.format());
          runInAction(() => (this.tracks = prev));
          return err(new Error('Invalid track data received from server'));
        }

        const data = parsed.data;

      runInAction(() => {
        const idx = this.tracks.findIndex((t) => t.id === data.id);
        if (idx !== -1) this.tracks[idx] = data;
      });

      return ok(data);
    },
    (e) => {
      runInAction(() => (this.tracks = prev));
      return err(e);
    }
  );
  }


  async removeTrack(trackId: string): Promise<void> {
    const prev = [...this.tracks];

    runInAction(() => {
      this.tracks = this.tracks.filter((t) => t.id !== trackId);
    });

    const result: Result<null, Error> = await trackApi
      .deleteTrack(trackId)
      .then(() => ok(null))
      .catch((e: unknown) => err(isError(e) ? e : new Error(String(e))));

    result.match(
      () => { },
      (e) => {
        runInAction(() => {
          this.tracks = prev;
        });
        throw e;
      }
    );
  }

  async removeTracks(ids: string[]): Promise<void> {
    const prev = [...this.tracks];

    runInAction(() => {
      this.tracks = this.tracks.filter((t) => !ids.includes(t.id));
    });

    const result: Result<null, Error> = await trackApi
      .deleteTracks(ids)
      .then(() => ok(null))
      .catch((e: unknown) => err(isError(e) ? e : new Error(String(e))));

    result.match(
      () => { },
      (e) => {
        runInAction(() => {
          this.tracks = prev;
        });
        throw e;
      }
    );
  }

  async removeAllTracks(): Promise<void> {
    const all: Track[] = [];
    let page = 1;
    let total = 0;
    const limit = 100;

    do {
      const result: Result<unknown, Error> = await trackApi
        .fetchTracks(page, limit)
        .then((res) => ok(res.data))
        .catch((e: unknown) => err(isError(e) ? e : new Error(String(e))));

      const proceed = result.match(
        (raw) => {
          const parsed = tracksResponseSchema.safeParse(raw);
          if (!parsed.success) {
            console.error('Zod validation failed:', parsed.error.format());
            return false;
          }
          all.push(...parsed.data.data);
          total = parsed.data.meta.total;
          return true;
        },
        (e) => {
          console.error('Failed to fetch tracks:', e.message);
          return false;
        }
      );

      if (!proceed) return;

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
    const result: Result<unknown, Error> = await trackApi
      .uploadTrackFile(trackId, file)
      .then((res) => ok(res.data))
      .catch((e: unknown) => err(isError(e) ? e : new Error(String(e))));

    return result.match(
      (raw) => {
        const parsed = trackSchema.safeParse(raw);
        if (!parsed.success) {
          console.error('Zod validation failed:', parsed.error.format());
          throw new Error('Invalid track data received from server');
        }

        const data = parsed.data;

        runInAction(() => {
          const idx = this.tracks.findIndex((t) => t.id === trackId);
          if (idx !== -1) this.tracks[idx] = data;
        });

        return data;
      },
      (e) => {
        throw e;
      }
    );
  }

  async removeTrackFile(trackId: string): Promise<void> {
    const result: Result<void, Error> = await trackApi
      .removeTrackFile(trackId)
      .then(() => ok(undefined))
      .catch((e: unknown) => err(isError(e) ? e : new Error(String(e))));

    result.match(
      () => {
        runInAction(() => {
          const idx = this.tracks.findIndex((t) => t.id === trackId);
          if (idx !== -1) this.tracks[idx].fileUrl = '';
        });
      },
      (e) => {
        throw e;
      }
    );
  }
}
