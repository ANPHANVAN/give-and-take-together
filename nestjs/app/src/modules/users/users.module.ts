import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UserIdentityRepository } from './user-identity.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserIdentityRepository],
  exports: [UsersRepository, UserIdentityRepository],
})
export class UsersModule {}
