/**
 * Basic test suite for TeachNexus backend
 * Run with: npm test
 * 
 * For production use, integrate Jest: npm install --save-dev jest
 * and add "test": "jest" to package.json
 */

const http = require('http');
const app = require('../src/server');

const BASE_URL = 'http://localhost:5000/api';
let token = '';
let userId = '';

// Test helper
function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 5000,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: data ? JSON.parse(data) : null,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Test logger
function log(testName, passed, message = '') {
  const status = passed ? '✓' : '✗';
  console.log(`${status} ${testName}${message ? ': ' + message : ''}`);
}

// Tests
async function runTests() {
  console.log('\n🚀 TeachNexus Backend Tests\n');

  try {
    // Test 1: Register
    console.log('AUTH TESTS');
    const registerRes = await request('POST', '/auth/register', {
      name: 'Test Teacher',
      email: `test_${Date.now()}@example.com`,
      password: 'password123',
      role: 'teacher'
    });
    const pass1 = registerRes.status === 201 && registerRes.body.token;
    log('Register', pass1);
    if (pass1) {
      token = registerRes.body.token;
      userId = registerRes.body.user.id;
    }

    // Test 2: Login
    const loginRes = await request('POST', '/auth/login', {
      email: registerRes.body.user.email,
      password: 'password123'
    });
    const pass2 = loginRes.status === 200 && loginRes.body.token;
    log('Login', pass2);

    // Test 3: Invalid password
    const badLoginRes = await request('POST', '/auth/login', {
      email: registerRes.body.user.email,
      password: 'wrongpassword'
    });
    const pass3 = badLoginRes.status === 401;
    log('Reject invalid password', pass3);

    // Test 4: Validation on register
    const noNameRes = await request('POST', '/auth/register', {
      email: 'test@example.com',
      password: 'password123'
    });
    const pass4 = noNameRes.status === 400;
    log('Validate required fields', pass4);

    // RESOURCE TESTS
    console.log('\nRESOURCE TESTS');

    // Test 5: Create resource
    const resourceRes = await request('POST', '/resources', {
      title: 'Test Resource',
      subject: 'math',
      grade: '5',
      description: 'A test resource',
      isPublic: true
    });
    const pass5 = resourceRes.status === 201 && resourceRes.body._id;
    log('Create resource', pass5);
    const resourceId = resourceRes.body._id;

    // Test 6: Get resource
    const getRes = await request('GET', `/resources/${resourceId}`);
    const pass6 = getRes.status === 200 && getRes.body.title === 'Test Resource';
    log('Get single resource', pass6);

    // Test 7: List resources
    const listRes = await request('GET', '/resources');
    const pass7 = listRes.status === 200 && Array.isArray(listRes.body.items);
    log('List resources', pass7);

    // Test 8: Invalid resource ID
    const invalidRes = await request('GET', '/resources/invalid123');
    const pass8 = invalidRes.status === 400;
    log('Reject invalid resource ID', pass8);

    // GAMIFICATION TESTS
    console.log('\nGAMIFICATION TESTS');

    // Test 9: Award XP
    const awardRes = await request('POST', '/gamification/award', {
      amount: 50
    });
    const pass9 = awardRes.status === 200 && awardRes.body.xp > 0;
    log('Award XP', pass9);

    // Test 10: Get leaderboard
    const leaderRes = await request('GET', '/gamification/leaderboard');
    const pass10 = leaderRes.status === 200 && Array.isArray(leaderRes.body.leaderboard);
    log('Get leaderboard', pass10);

    // AI TESTS
    console.log('\nAI TESTS');

    // Test 11: Generate lesson plan
    const aiRes = await request('POST', '/ai/lesson', {
      topic: 'Photosynthesis',
      grade: '6',
      duration: 30
    });
    const pass11 = aiRes.status === 200 && aiRes.body.plan;
    log('Generate lesson (with fallback)', pass11);

    // Test 12: Invalid AI request
    const invalidAiRes = await request('POST', '/ai/lesson', {
      topic: '',
      grade: '5'
    });
    const pass12 = invalidAiRes.status === 400;
    log('Validate AI request', pass12);

    // CHAT TESTS
    console.log('\nCHAT TESTS');

    // Test 13: Get chat history
    const chatRes = await request('GET', '/chat/test_room');
    const pass13 = chatRes.status === 200 && Array.isArray(chatRes.body);
    log('Get chat history', pass13);

    // NOTIFICATIONS TESTS
    console.log('\nNOTIFICATION TESTS');

    // Test 14: Get notifications
    const notifRes = await request('GET', '/notifications');
    const pass14 = notifRes.status === 200 && notifRes.body.items !== undefined;
    log('Get notifications', pass14);

    // SUMMARY
    console.log('\n📊 Test Summary\n');
    const tests = [pass1, pass2, pass3, pass4, pass5, pass6, pass7, pass8, pass9, pass10, pass11, pass12, pass13, pass14];
    const passed = tests.filter(t => t).length;
    const total = tests.length;
    console.log(`Passed: ${passed}/${total}`);

    if (passed === total) {
      console.log('✓ All tests passed!\n');
      process.exit(0);
    } else {
      console.log(`✗ ${total - passed} test(s) failed\n`);
      process.exit(1);
    }

  } catch (err) {
    console.error('Test error:', err.message);
    process.exit(1);
  }
}

// Wait for server startup
setTimeout(runTests, 1000);
