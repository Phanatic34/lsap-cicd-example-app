const request = require('supertest');
const app = require('./app');

describe('GET /time', () => {
  it('should return an ISO timestamp', async () => {
    const res = await request(app).get('/time');
    expect(res.statusCode).toBe(200);
    expect(typeof res.body.time).toBe('string');
    expect(() => new Date(res.body.time)).not.toThrow();
  });
});
