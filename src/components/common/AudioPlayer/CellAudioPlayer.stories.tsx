
import type { Meta, StoryObj } from '@storybook/react';
import { CellAudioPlayer } from './CellAudioPlayer_storybook_only';
import { Track } from '../../../schemas/track.schema';
import React from 'react';

// 1. Моковый TrackStoreContext и провайдер
const TrackStoreContext = React.createContext<any>(null);

const mockTrackStore = {
  uploadTrackFile: async () => Promise.resolve(),
  removeTrackFile: async () => Promise.resolve(),
  fetchTracks: async () => Promise.resolve(),
  tracks: [],
  genres: [],
};

export const MockTrackStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <TrackStoreContext.Provider value={mockTrackStore}>
    {children}
  </TrackStoreContext.Provider>
);

const mockTrackWithAudio: Track = {
  id: '1',
  title: 'Test Track',
  artist: 'Test Artist',
  album: 'Test Album',
  genres: ['Rock', 'Pop'],
  coverImage: '',
  audioFile: 'Mdmc Disco Dancing.mp3',
  fileUrl: '/Mdmc Disco Dancing.mp3',
  slug: 'test-track',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockTrackWithoutAudio: Track = {
  ...mockTrackWithAudio,
  id: '2',
  audioFile: undefined,
  slug: 'test-track-2',
};

const meta: Meta<typeof CellAudioPlayer> = {
  title: 'Audio/CellAudioPlayer',
  component: CellAudioPlayer,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockTrackStoreProvider>
        <Story />
      </MockTrackStoreProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CellAudioPlayer>;

// 4. Stories
export const WithAudio: Story = {
  args: {
    track: mockTrackWithAudio,
  },
};

export const WithoutAudio: Story = {
  args: {
    track: mockTrackWithoutAudio,
  },
};

