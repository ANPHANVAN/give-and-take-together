import { Post } from '@/generated/client';
import { PostCreateInput } from '@/generated/models';

export interface IPostsRepository {
  createPost(createPostInput: PostCreateInput): Promise<Post>;
  findAllPost(): Promise<Post[]>;
  findPostById(id: string): Promise<Post | null>;
  deletePostById(id: string): Promise<Post>;
}
