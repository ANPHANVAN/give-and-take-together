import { Post } from '@/generated/client';
import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private postRepo: PostsRepository) {}

  getAllPosts(): Promise<Post[]> {
    return this.postRepo.findAllPost();
  }
}
