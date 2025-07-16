import { TrackStore } from '../../stores/TrackStore';
import * as trackApi from '../../api/trackApi';
import { type Track } from '../../schemas/track.schema';

jest.mock('../../api/trackApi');

describe('TrackStore Integration Tests', () => {
  let store: TrackStore;

  beforeEach(() => {
    store = new TrackStore();
    jest.clearAllMocks();
  });

  it('should integrate with React components correctly', async () => {
    const mockTracks: Track[] = [
      {
        id: '1',
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

    (trackApi.fetchTracks as jest.Mock).mockResolvedValue({
      data: {
        data: mockTracks,
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      },
    });

    await store.fetchTracks();

    expect(store.tracks).toEqual(mockTracks);
    expect(store.loading).toBe(false);
    expect(store.totalTracks).toBe(1);
  });

  it('should handle error states correctly in integration', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    (trackApi.fetchTracks as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );

    await store.fetchTracks();

    expect(store.loading).toBe(false);
    expect(store.tracks).toEqual([]);

    consoleSpy.mockRestore();
  });

  it('should integrate add and fetch operations', async () => {
    const newTrack: Omit<Track, 'id'> = {
      title: 'New Track',
      artist: 'New Artist',
      album: 'New Album',
      coverImage: 'https://example.com/new-image.jpg',
      genres: ['rock'],
      audioFile: '',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      slug: 'new-track',
      fileUrl: '',
    };

    const savedTrack: Track = { ...newTrack, id: 'new-id' };

    (trackApi.addTrack as jest.Mock).mockResolvedValue({ data: savedTrack });

    const addResult = await store.addTrack(newTrack as Track);
    expect(addResult.isOk()).toBe(true);

    (trackApi.fetchTracks as jest.Mock).mockResolvedValue({
      data: {
        data: [savedTrack],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      },
    });

    await store.fetchTracks();

    expect(store.tracks).toHaveLength(1);
    expect(store.tracks[0].title).toBe('New Track');
  });

  it('should integrate pagination correctly', async () => {
    const mockTracksPage1: Track[] = [
      {
        id: '1',
        title: 'Track 1',
        artist: 'Artist 1',
        album: 'Album 1',
        coverImage: 'https://example.com/image1.jpg',
        genres: ['pop'],
        audioFile: '',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        slug: 'track-1',
        fileUrl: '',
      },
    ];

    const mockTracksPage2: Track[] = [
      {
        id: '2',
        title: 'Track 2',
        artist: 'Artist 2',
        album: 'Album 2',
        coverImage: 'https://example.com/image2.jpg',
        genres: ['rock'],
        audioFile: '',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        slug: 'track-2',
        fileUrl: '',
      },
    ];

    (trackApi.fetchTracks as jest.Mock).mockResolvedValueOnce({
      data: {
        data: mockTracksPage1,
        meta: { total: 2, page: 1, limit: 1, totalPages: 2 },
      },
    });

    await store.fetchTracks(1);
    expect(store.tracks).toEqual(mockTracksPage1);
    expect(store.page).toBe(1);

    (trackApi.fetchTracks as jest.Mock).mockResolvedValueOnce({
      data: {
        data: mockTracksPage2,
        meta: { total: 2, page: 2, limit: 1, totalPages: 2 },
      },
    });

    store.setPage(2);
    expect(store.page).toBe(2);
  });
});
