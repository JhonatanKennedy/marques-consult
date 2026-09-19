import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DomainErrorFilter } from './presentation/filters/domain-error.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new DomainErrorFilter());
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
