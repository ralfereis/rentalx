// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';

import { app } from '@shared/infra/http/app';

describe('Create Category Controller', () => {
  test('Should be able to create a new category', async () => {
    const response = await request(app).post('/categories').send({
      name: 'any_name',
      description: 'any_description',
    });
    expect(response.status).toBe(201);
  });
});
