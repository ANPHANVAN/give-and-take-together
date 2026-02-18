import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '@/modules/users/repositories/IUser.repository';
import { IUserIdentityRepository } from '@/modules/users/repositories/IUserIdentity.repository';
import { IPostsRepository } from '../repositories/posts.repository';
import { Post } from '@/generated/client';

@injectable()
export class PostsService {
  constructor(
    @inject('IUserRepository') private userRepo: IUserRepository,
    @inject('IUserIdentityRepository') private userIdentityRepo: IUserIdentityRepository,
    @inject('IPostsRepository') private postsRepo: IPostsRepository,
  ) {}

  getAllPosts(): Promise<Post[]> {
    return this.postsRepo.findAllPost();
  }
}
