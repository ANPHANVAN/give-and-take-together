import { Post, Prisma } from '@/generated/client';
import { PostCreateInput } from '@/generated/models';
import { PrismaService } from '@/infras/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsRepository {
  constructor(private prismaService: PrismaService) {}

  private getClient(tx?: Prisma.TransactionClient) {
    return tx ? tx : this.prismaService.getClient();
  }

  createPost(postCreateInput: PostCreateInput, tx?: Prisma.TransactionClient) {
    return this.getClient(tx).post.create({
      data: {
        title: postCreateInput.title,
        description: postCreateInput.description,
        giver: postCreateInput.giver
      },
    });
  }

  findAllPost(): Promise<Post[]> {
    return this.getClient().post.findMany({});
  }

  async findPostById(id: string): Promise<Post | null> {
    return await this.getClient().post.findUnique({
      where: { id: id },
    });
  }

  async updateAllField(id: string, data: Prisma.PostUpdateInput): Promise<Post> {
    return this.getClient().post.update({
      where: { id: id },
      data: data,
    });
  }

  async deletePostById(id: string): Promise<Post> {
    return this.getClient().post.delete({
      where: {
        id: id,
      },
    });
  }
}
