import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // not 3000 because I tried, then realized that the frontend already running on 3000, change PORT in .env if you need something else
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
