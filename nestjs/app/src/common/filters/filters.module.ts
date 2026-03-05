import { Module } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';

@Module({
  providers: [HttpExceptionFilter],
  exports: [HttpExceptionFilter],
  imports: [],
})
export class FiltersModule {}
