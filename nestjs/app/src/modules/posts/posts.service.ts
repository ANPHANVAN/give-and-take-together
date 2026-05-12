import { Post } from '@/generated/client';
import { Body, Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private postRepo: PostsRepository) {}

  getAllPosts(): Promise<Post[]> {
    return this.postRepo.findAllPost();
  }

  getPostById( postId: string) {
    return this.postRepo.findPostById(postId)
  }

  createPost(createPostDto: CreatePostDto): Promise<Post> {
    return this.postRepo.createPost({
    giver: {
      connect: {
        id: createPostDto.giverId
      }
    },
    title: createPostDto.title,
    description: createPostDto.description
    })
  }
}
