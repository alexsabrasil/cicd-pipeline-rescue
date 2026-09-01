const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
  it('deve retornar status 200 e informar que o serviço está saudável', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      service: 'TechExpress'
    });
  });
});
