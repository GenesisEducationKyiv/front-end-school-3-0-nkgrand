import { z } from 'zod';

export const trackSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  album: z.string().optional().nullable(),
  genres: z.array(z.string()),
  slug: z.string(),
  coverImage: z.string().url().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  audioFile: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
});

export const metaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const tracksResponseSchema = z.object({
  data: z.array(trackSchema),
  meta: metaSchema,
});

export type Track = z.infer<typeof trackSchema>;
export type TracksResponse = z.infer<typeof tracksResponseSchema>;
