import { gql } from '@apollo/client';
import { client } from '../provider/ApolloProvider';
import { type Track } from '../schemas/track.schema';

interface TracksMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface TracksResponse {
  data: Track[];
  meta: TracksMeta;
}

interface TracksQueryResult {
  tracks: TracksResponse;
}

interface GenresQueryResult {
  genres: string[];
}

export const fetchTracks = async (page?: number, limit?: number) => {
  const { data } = await client.query<TracksQueryResult>({
    query: gql`
      query GetTracks($page: Int, $limit: Int) {
        tracks(page: $page, limit: $limit) {
          data {
            id
            title
            artist
            album
            genres
            slug
            coverImage
            audioFile
            fileUrl
            createdAt
            updatedAt
          }
          meta {
            total
            page
            limit
            totalPages
          }
        }
      }
    `,
    variables: { page, limit },
    fetchPolicy: 'no-cache',
  });
  return { data: data.tracks };
};

export const fetchGenres = async () => {
  const { data } = await client.query<GenresQueryResult>({
    query: gql`
      query {
        genres
      }
    `,
    fetchPolicy: 'no-cache',
  });
  return { data: data.genres };
};

export const fetchTrackBySlug = async (slug: string) => {
  const { data } = await client.query<{ trackBySlug: Track | null }>({
    query: gql`
      query ($slug: String!) {
        trackBySlug(slug: $slug) {
          id
          title
          artist
          album
          genres
          slug
          coverImage
          audioFile
          fileUrl
          createdAt
          updatedAt
        }
      }
    `,
    variables: { slug },
    fetchPolicy: 'no-cache',
  });
  return data.trackBySlug;
};

export const fetchTrackById = async (id: string) => {
  const { data } = await client.query<{ trackById: Track | null }>({
    query: gql`
      query ($id: ID!) {
        trackById(id: $id) {
          id
          title
          artist
          album
          genres
          slug
          coverImage
          audioFile
          fileUrl
          createdAt
          updatedAt
        }
      }
    `,
    variables: { id },
    fetchPolicy: 'no-cache',
  });
  return data.trackById;
};

export const addTrack = async (
  track: Omit<
    Track,
    'id' | 'createdAt' | 'updatedAt' | 'slug' | 'fileUrl' | 'audioFile'
  >
) => {
  const { data } = await client.mutate<{ addTrack: Track }>({
    mutation: gql`
      mutation ($input: TrackInput!) {
        addTrack(input: $input) {
          id
          title
          artist
          album
          genres
          slug
          coverImage
          audioFile
          fileUrl
          createdAt
          updatedAt
        }
      }
    `,
    variables: { input: track },
  });
  return data?.addTrack;
};

export const updateTrack = async (id: string, track: Partial<Track>) => {
  const { data } = await client.mutate<{ updateTrack: Track | null }>({
    mutation: gql`
      mutation ($id: ID!, $input: TrackInput!) {
        updateTrack(id: $id, input: $input) {
          id
          title
          artist
          album
          genres
          slug
          coverImage
          audioFile
          fileUrl
          createdAt
          updatedAt
        }
      }
    `,
    variables: { id, input: track },
  });
  return data?.updateTrack;
};

export const deleteTrack = async (id: string) => {
  const { data } = await client.mutate<{ deleteTrack: boolean }>({
    mutation: gql`
      mutation ($id: ID!) {
        deleteTrack(id: $id)
      }
    `,
    variables: { id },
  });
  return data?.deleteTrack;
};

export const deleteTracks = async (ids: string[]) => {
  const { data } = await client.mutate<{
    deleteTracks: { success: string[]; failed: string[] };
  }>({
    mutation: gql`
      mutation ($ids: [ID!]!) {
        deleteTracks(ids: $ids) {
          success
          failed
        }
      }
    `,
    variables: { ids },
  });
  return data?.deleteTracks;
};

export const uploadTrackFile = (trackId: string, file: File) => {
  const form = new FormData();
  form.append('file', file);
  return client.mutate({
    mutation: gql`
      mutation {
        uploadTrackFile(id: "${trackId}", file: $file) {
          id
          title
          artist
          album
          genres
          slug
          coverImage
          audioFile
          createdAt
          updatedAt
        }
      }
    `,
    variables: {
      file: form,
    },
  });
};

export const removeTrackFile = (trackId: string) =>
  client.mutate({
    mutation: gql`
      mutation {
        removeTrackFile(id: "${trackId}")
      }
    `,
  });
