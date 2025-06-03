import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:4200', // Donde corre Angular
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
