import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { CacheMiddleware } from './middlewares/cache.middleware';
import { RedisPollerService } from './redis/redis-poller.service';

async function bootstrap() {
  let app = await NestFactory.create(AppModule);
  let configService = app.get(ConfigService);

  // prefix for api versioning
  app.setGlobalPrefix('api/v1');

  // swagger config
  let config = new DocumentBuilder()
    .setTitle('OnTarget API Test documentation')
    .setDescription('API documentation for the OnTarget application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  let document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  app.use(new LoggingMiddleware().use);
  app.use(new CacheMiddleware().use);

  // start poller
  let poller = app.get(RedisPollerService);
  poller.startPolling();

  let port = configService.get<number>('app.port') || 3000;
  await app.listen(port);
  //remove logs after tests
  console.log(`Application is running on: http://localhost:${port}/api/v1`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api/v1/docs`);
}
bootstrap();
