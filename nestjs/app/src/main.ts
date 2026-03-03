import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(process.env.PORT ?? 8000);
  console.log(`Server running at ${configService.get('app.apiHost')}`);
}
bootstrap();
