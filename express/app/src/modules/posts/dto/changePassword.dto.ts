import z from 'zod';

export const CreatePostsDTO = z.object({
  userId: z.string(),
});

export type TCreatePostsDTO = z.infer<typeof CreatePostsDTO>;
