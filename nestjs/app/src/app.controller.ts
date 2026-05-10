import { Controller, ForbiddenException, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Get('test/forbidden')
  test() {
    throw new ForbiddenException({ message: 'Test throw HttpException' });
  }
}
