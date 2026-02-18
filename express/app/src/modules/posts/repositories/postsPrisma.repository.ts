import { Post, Prisma, User } from '@/generated/client';
import { BaseRepository } from '@/modules/shared/database/base.repository';
import { injectable } from 'tsyringe';
import { IPostsRepository } from './posts.repository';

@injectable()
export class PostsPrismaRepository extends BaseRepository implements IPostsRepository {
  createPost(createPostInput: Prisma.PostCreateInput): Promise<Post> {
    return this.db.post.create({ data: createPostInput });
  }
  findAllPost(): Promise<Post[]> {
    return this.db.post.findMany();
  }
}
