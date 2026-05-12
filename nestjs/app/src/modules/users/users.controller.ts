import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Logger } from 'nestjs-pino';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private logger: Logger,
  ) {}

  @Get()
  async findAllUserByAdmin() {
    const allUser = await this.usersService.findAllUserByAdmin();
    return allUser;
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':userId')
  async getUserById(@Body() userId: string) {
    return this.usersService.getUser(userId);
  }
}
