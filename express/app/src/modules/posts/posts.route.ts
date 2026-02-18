import express, { Router } from 'express';
import { PostsController } from './controllers/posts.controller';
import { container } from '@/config/container';

const postsController = container.resolve(PostsController);
const router: Router = express.Router();

// [get] /posts
router.get('/', postsController.getAllPosts);

export default router;
