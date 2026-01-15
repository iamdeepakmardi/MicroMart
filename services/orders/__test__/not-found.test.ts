import request from 'supertest';
import { app } from '../src/app';

it('returns 404 for route that does not exist', async () => {
    await request(app)
        .get('/api/completely-random-route')
        .expect(404);
});
