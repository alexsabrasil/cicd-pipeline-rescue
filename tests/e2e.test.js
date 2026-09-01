describe('TechExpress Staging - E2E', () => {
  test('GET /health deve responder corretamente em homologação', async () => {
    const response = await fetch('http://localhost:3001/health');
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      status: 'ok',
      service: 'TechExpress'
    });
  });
});
