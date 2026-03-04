import { Controller, Get } from '@nestjs/common';
import { StorageService } from '@/infras/storage/storage.service';

@Controller('auth')
export class AuthController {
  constructor(private minio: StorageService) {}
  @Get()
  findAll() {
    return 'hello';
  }
}
