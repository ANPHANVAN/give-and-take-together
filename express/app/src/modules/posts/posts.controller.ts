import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { catchAsync } from '@/utils/catchAsync';
import { PostsService } from './posts.service';

@injectable()
export class PostsController {
  constructor(@inject('PostsService') private postsService: PostsService) {}

  getAllPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const allPostsData = await this.postsService.getAllPosts();
    return res.status(200).json(allPostsData);
  });
}
