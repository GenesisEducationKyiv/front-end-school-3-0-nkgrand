import { TrackStore } from '../stores/TrackStore';
import * as trackApi from '../api/trackApi';
import { type Track } from '../schemas/track.schema';

jest.mock('../api/trackApi');

describe('TrackStore', () => {
  let store: TrackStore;

  beforeEach(() => {
    store = new TrackStore();
    jest.clearAllMocks();
  });

  it('should initialize with empty tracks array', () => {
    expect(store.tracks).toEqual([]);
  });

  it('should add a track and replace temp ID', async () => {
    const newTrack: Omit<Track, 'id'> = {
      title: 'Test Title',
      artist: 'Test Artist',
      album: 'Test Album',
      coverImage: 'https://example.com/image.jpg',
      genres: ['rock'],
      audioFile: '',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      slug: 'test-title',
      fileUrl: '',
    };

    const realTrack: Track = { ...newTrack, id: 'real-track-id' };

    (trackApi.addTrack as jest.Mock).mockResolvedValue({ data: realTrack });
    const result = await store.addTrack(newTrack as Track);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.id).toBe('real-track-id');
      expect(store.tracks[0].id).toBe('real-track-id');
    }
  });

  it('should update an existing track', async () => {
    const track: Track = {
      id: 't1',
      title: 'Old',
      artist: 'Old Artist',
      album: 'Old Album',
      coverImage: 'https://example.com/image.jpg',
      genres: ['pop'],
      audioFile: '',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      slug: 'old',
      fileUrl: '',
    };

    store.tracks = [track];

    const updatedTrack: Track = { ...track, title: 'Updated' };
    (trackApi.updateTrack as jest.Mock).mockResolvedValue({
      data: updatedTrack,
    });

    const result = await store.updateTrack(updatedTrack);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.title).toBe('Updated');
      expect(store.tracks[0].title).toBe('Updated');
    }
  });

  it('should remove a track', async () => {
    store.tracks = [
      {
        id: 't1',
        title: 'Test Track',
        artist: 'Test Artist',
        album: 'Test Album',
        coverImage: 'https://example.com/image.jpg',
        genres: ['pop'],
        audioFile: '',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        slug: 'test-track',
        fileUrl: '',
      },
    ];
    (trackApi.deleteTrack as jest.Mock).mockResolvedValue({});

    await store.removeTrack('t1');

    expect(store.tracks).toHaveLength(0);
  });

  it('should remove multiple tracks', async () => {
    store.tracks = [
      {
        id: 't1',
        title: 'Test Track 1',
        artist: 'Test Artist 1',
        album: 'Test Album 1',
        coverImage: 'https://example.com/image1.jpg',
        genres: ['pop'],
        audioFile: '',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        slug: 'test-track-1',
        fileUrl: '',
      },
      {
        id: 't2',
        title: 'Test Track 2',
        artist: 'Test Artist 2',
        album: 'Test Album 2',
        coverImage: 'https://example.com/image2.jpg',
        genres: ['rock'],
        audioFile: '',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        slug: 'test-track-2',
        fileUrl: '',
      },
    ];

    (trackApi.deleteTracks as jest.Mock).mockResolvedValue({});

    await store.removeTracks(['t1', 't2']);

    expect(store.tracks).toHaveLength(0);
  });

  it('should fetch tracks and update store', async () => {
    const mockTracks: Track[] = [
      {
        id: '1',
        title: 'Track 1',
        artist: 'Artist 1',
        album: 'Album 1',
        coverImage: 'https://example.com/image.jpg',
        genres: ['pop'],
        audioFile: '',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        slug: 'track-1',
        fileUrl: '',
      },
    ];

    (trackApi.fetchTracks as jest.Mock).mockResolvedValue({
      data: {
        data: mockTracks,
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      },
    });

    expect(store.loading).toBe(false);

    const fetchPromise = store.fetchTracks();
    expect(store.loading).toBe(true);

    await fetchPromise;

    expect(store.tracks).toEqual(mockTracks);
    expect(store.totalTracks).toBe(1);
    expect(store.loading).toBe(false);
  });

  it('should fetch genres and update store', async () => {
    const mockGenres = ['rock', 'pop'];
    (trackApi.fetchGenres as jest.Mock).mockResolvedValue({ data: mockGenres });

    await store.fetchGenres();

    expect(store.genres).toEqual(mockGenres);
  });

  it('should upload track file and update store', async () => {
    const file = new File(['dummy'], 'track.mp3', { type: 'audio/mp3' });
    const track: Track = {
      id: 'track-id',
      title: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      coverImage: 'https://example.com/image.jpg',
      genres: ['pop'],
      audioFile: '',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      slug: 'test-track',
      fileUrl: '',
    };

    const updatedTrack = { ...track, fileUrl: 'uploaded.mp3' };

    store.tracks = [track];

    (trackApi.uploadTrackFile as jest.Mock).mockResolvedValue({
      data: updatedTrack,
    });

    const result = await store.uploadTrackFile(track.id, file);

    expect(result.fileUrl).toBe('uploaded.mp3');
    expect(store.tracks[0].fileUrl).toBe('uploaded.mp3');
    expect(trackApi.uploadTrackFile).toHaveBeenCalledWith(track.id, file);
  });

  it('should remove track file and clear fileUrl', async () => {
    const track: Track = {
      id: 'track-id',
      title: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      coverImage: 'https://example.com/image.jpg',
      genres: ['pop'],
      fileUrl: 'some-file.mp3',
      audioFile: '',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      slug: 'test-track',
    };

    store.tracks = [track];

    (trackApi.removeTrackFile as jest.Mock).mockResolvedValue({});

    await store.removeTrackFile(track.id);

    expect(store.tracks[0].fileUrl).toBe(''); // Проверка на пустую строку
    expect(trackApi.removeTrackFile).toHaveBeenCalledWith(track.id);
  });

  it('should remove all tracks', async () => {
    const allTracks: Track[] = [
      {
        id: '1',
        title: 'T1',
        artist: 'Artist 1',
        album: 'Album 1',
        coverImage: 'https://example.com/image1.jpg',
        genres: ['pop'],
        audioFile: '',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        slug: 't1',
        fileUrl: '',
      },
      {
        id: '2',
        title: 'T2',
        artist: 'Artist 2',
        album: 'Album 2',
        coverImage: 'https://example.com/image2.jpg',
        genres: ['rock'],
        audioFile: '',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        slug: 't2',
        fileUrl: '',
      },
    ];

    (trackApi.fetchTracks as jest.Mock).mockResolvedValueOnce({
      data: {
        data: allTracks,
        meta: { total: 2, page: 1, limit: 100, totalPages: 1 },
      },
    });

    const removeTracksSpy = jest
      .spyOn(store, 'removeTracks')
      .mockResolvedValue();

    await store.removeAllTracks();

    expect(trackApi.fetchTracks).toHaveBeenCalledWith(1, 100);
    expect(removeTracksSpy).toHaveBeenCalledWith(['1', '2']);
    expect(store.tracks).toEqual([]);
    expect(store.totalTracks).toBe(0);
    expect(store.page).toBe(1);
  });
});
