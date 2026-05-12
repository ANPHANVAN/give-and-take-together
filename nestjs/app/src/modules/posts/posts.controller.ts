import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Get()
  async getAllPost() {
    return await this.postService.getAllPosts();
  }

  @Post()
  async createPost (@Body() postBody: CreatePostDto) {
    return this.postService.createPost(postBody)
  }

  @Get(':postId')
  async getPostById (@Body() postId: string) {
    return await this.postService.getPostById(postId);
  }
}
