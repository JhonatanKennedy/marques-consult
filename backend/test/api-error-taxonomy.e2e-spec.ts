import 'dotenv/config';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { DomainErrorFilter } from '../src/presentation/filters/domain-error.filter.js';
import { GetCurrentListUseCase } from '../src/application/use-cases/list/get-current-list.use-case.js';

const describeIfDatabase = process.env.DATABASE_URL ? describe : describe.skip;

describeIfDatabase('API error taxonomy (e2e)', () => {
  let app: INestApplication;

  const buildApp = async (failing = false): Promise<INestApplication> => {
    const builder = Test.createTestingModule({ imports: [AppModule] });

    if (failing) {
      builder.overrideProvider(GetCurrentListUseCase).useValue({
        execute: () => {
          throw new Error('something unrelated went wrong');
        },
      });
    }

    const moduleRef: TestingModule = await builder.compile();
    const created = moduleRef.createNestApplication();
    created.useGlobalFilters(new DomainErrorFilter());
    await created.init();
    return created;
  };

  afterEach(async () => {
    await app?.close();
  });

  describe('a resource that is not there', () => {
    beforeEach(async () => {
      app = await buildApp();
    });

    it('answers 404 when a mutation names an item the list does not hold', async () => {
      const response = await request(app.getHttpServer())
        .patch('/list/items/nao-existe')
        .send({ name: 'Novo nome' })
        .expect(404);

      expect(response.body.itemId).toBe('nao-existe');
      expect(response.body.message).toContain('nao-existe');
    });

    it('answers 404 when a removal names an item the list does not hold', async () => {
      const response = await request(app.getHttpServer())
        .delete('/list/items/nao-existe')
        .expect(404);

      expect(response.body.itemId).toBe('nao-existe');
    });

    it('answers 404 when a reorder names an item the list does not hold', async () => {
      const response = await request(app.getHttpServer())
        .patch('/list/items/nao-existe/reorder')
        .send({ newOrder: 0 })
        .expect(404);

      expect(response.body.itemId).toBe('nao-existe');
    });

    it('answers 404 when a restore names a version the record does not hold', async () => {
      const response = await request(app.getHttpServer())
        .post('/list/restore/987654')
        .expect(404);

      expect(response.body.versionNumber).toBe(987654);
      expect(response.body.message).toContain('987654');
    });

    it('does not answer 500 for any of these', async () => {
      const restore = await request(app.getHttpServer()).post(
        '/list/restore/987654',
      );

      expect(restore.status).not.toBe(500);
    });
  });

  describe('a failure that is ours', () => {
    it('answers 500 and does not use the not-found status', async () => {
      app = await buildApp(true);

      const response = await request(app.getHttpServer())
        .get('/list')
        .expect(500);

      expect(response.body.statusCode).toBe(500);
      // The cause is logged, not returned: a client cannot act on a stack trace.
      expect(JSON.stringify(response.body)).not.toContain(
        'something unrelated went wrong',
      );
    });
  });

  describe('a request Nest itself rejects', () => {
    beforeEach(async () => {
      app = await buildApp();
    });

    it('keeps its own status rather than becoming a server error', async () => {
      await request(app.getHttpServer())
        .post('/list/restore/not-a-number')
        .expect(400);
    });
  });
});
