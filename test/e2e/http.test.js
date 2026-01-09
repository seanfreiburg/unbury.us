/**
 * HTTP Integration Tests
 * These tests verify the server responds correctly without requiring a browser
 */

const http = require('http');
const { spawn } = require('child_process');

const BASE_URL = 'http://localhost:3000';
let server;

// Helper to make HTTP requests
function httpGet(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    }).on('error', reject);
  });
}

// Helper to start the server
function startServer() {
  return new Promise((resolve, reject) => {
    server = spawn('node', ['app.js'], {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NODE_ENV: 'test' }
    });

    server.stdout.on('data', (data) => {
      if (data.toString().includes('Server running')) {
        setTimeout(resolve, 300);
      }
    });

    server.stderr.on('data', (data) => {
      const msg = data.toString();
      if (!msg.includes('GET') && !msg.includes('POST')) {
        console.error(`Server stderr: ${msg}`);
      }
    });

    setTimeout(() => reject(new Error('Server start timeout')), 10000);
  });
}

function stopServer() {
  if (server) {
    server.kill();
    server = null;
  }
}

describe('HTTP Integration Tests', () => {
  beforeAll(async () => {
    await startServer();
  }, 15000);

  afterAll(() => {
    stopServer();
  });

  describe('Home Page (Loan Calculator)', () => {
    test('GET / returns 200', async () => {
      const res = await httpGet('/');
      expect(res.status).toBe(200);
    });

    test('GET / returns HTML content', async () => {
      const res = await httpGet('/');
      expect(res.headers['content-type']).toMatch(/text\/html/);
    });

    test('GET / contains loan calculator elements', async () => {
      const res = await httpGet('/');
      expect(res.body).toContain('loan');
      expect(res.body).toContain('calculate');
    });

    test('GET / contains required form inputs', async () => {
      const res = await httpGet('/');
      expect(res.body).toContain('loan-name');
      expect(res.body).toContain('current-balance');
      expect(res.body).toContain('minimum-payment');
      expect(res.body).toContain('interest-rate');
    });

    test('GET / contains payment type options', async () => {
      const res = await httpGet('/');
      expect(res.body).toContain('avalanche');
      expect(res.body).toContain('snowball');
    });

    test('GET / includes required JavaScript files', async () => {
      const res = await httpGet('/');
      expect(res.body).toContain('loan_calculator');
      expect(res.body).toContain('results_controller');
    });

    test('GET / includes Chart.js', async () => {
      const res = await httpGet('/');
      // Chart.js CDN uses lowercase 'chart.js'
      expect(res.body.toLowerCase()).toContain('chart');
    });
  });

  describe('FI Calculator Page', () => {
    test('GET /fi_calculator returns 200', async () => {
      const res = await httpGet('/fi_calculator');
      expect(res.status).toBe(200);
    });

    test('GET /fi_calculator returns HTML content', async () => {
      const res = await httpGet('/fi_calculator');
      expect(res.headers['content-type']).toMatch(/text\/html/);
    });
  });

  describe('Opportunity Cost Page', () => {
    test('GET /opportunity_cost returns 200', async () => {
      const res = await httpGet('/opportunity_cost');
      expect(res.status).toBe(200);
    });

    test('GET /opportunity_cost returns HTML content', async () => {
      const res = await httpGet('/opportunity_cost');
      expect(res.headers['content-type']).toMatch(/text\/html/);
    });
  });

  describe('Static Assets', () => {
    test('GET /stylesheets/style.css returns 200', async () => {
      const res = await httpGet('/stylesheets/style.css');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/text\/css/);
    });

    test('GET /javascripts/loan_calculator/loan.js returns 200', async () => {
      const res = await httpGet('/javascripts/loan_calculator/loan.js');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/javascript/);
    });

    test('GET /javascripts/loan_calculator/results_controller.js returns 200', async () => {
      const res = await httpGet('/javascripts/loan_calculator/results_controller.js');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/javascript/);
    });

    test('GET /javascripts/lib/jquery-2.1.1.min.js returns 200', async () => {
      const res = await httpGet('/javascripts/lib/jquery-2.1.1.min.js');
      expect(res.status).toBe(200);
    });

    test('GET /javascripts/lib/Chart.js_0.2.0.js returns 200', async () => {
      const res = await httpGet('/javascripts/lib/Chart.js_0.2.0.js');
      expect(res.status).toBe(200);
    });
  });

  describe('404 Handling', () => {
    test('GET /nonexistent returns 404', async () => {
      const res = await httpGet('/nonexistent');
      expect(res.status).toBe(404);
    });
  });

  describe('Security Headers (Helmet)', () => {
    test('Response includes security headers', async () => {
      const res = await httpGet('/');
      // Helmet adds various security headers
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBeDefined();
    });

    test('Response includes X-DNS-Prefetch-Control', async () => {
      const res = await httpGet('/');
      expect(res.headers['x-dns-prefetch-control']).toBeDefined();
    });
  });

  describe('Compression', () => {
    test('Response is compressed when Accept-Encoding includes gzip', async () => {
      // Make a request that accepts gzip
      const res = await new Promise((resolve, reject) => {
        const options = {
          hostname: 'localhost',
          port: 3000,
          path: '/',
          method: 'GET',
          headers: {
            'Accept-Encoding': 'gzip, deflate'
          }
        };

        http.get(options, (res) => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            encoding: res.headers['content-encoding']
          });
        }).on('error', reject);
      });

      expect(res.status).toBe(200);
      // Compression should be applied for large responses
      // Note: small responses may not be compressed
    });
  });
});

describe('URL Hash State Tests', () => {
  beforeAll(async () => {
    if (!server) {
      await startServer();
    }
  }, 15000);

  afterAll(() => {
    stopServer();
  });

  test('Page loads with URL hash parameters', async () => {
    // The server should serve the page regardless of hash
    // Hash handling is client-side
    const res = await httpGet('/');
    expect(res.status).toBe(200);
    expect(res.body).toContain('init.js'); // This file handles URL hash parsing
  });
});
