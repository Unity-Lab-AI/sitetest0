/**
 * Test script for n8n webhook communication
 * Tests both GET and POST methods to verify connectivity
 */

const WEBHOOK_URL = 'https://n8n.srv484091.hstgr.cloud/webhook/unitydemo-UID';

// Generate a test UID in the correct format
function generateTestUID() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const randomString = (length) => {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    // Format: ud-xx-xxxxxxxxx-xxxxxxxxx-xxxxxxxxxx
    return `ud-${randomString(2)}-${randomString(9)}-${randomString(9)}-${randomString(10)}`;
}

// Test POST method (sending data in request body)
async function testPOST() {
    console.log('\n=== Testing POST Method ===');
    const testUID = generateTestUID();
    console.log(`Test UID: ${testUID}`);
    console.log(`URL: ${WEBHOOK_URL}`);

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                page: 'demo',
                uid: testUID
            })
        });

        console.log(`Status: ${response.status} ${response.statusText}`);

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('Response Data:', JSON.stringify(data, null, 2));
        } else {
            const text = await response.text();
            console.log('Response Text:', text);
        }

        return response.ok;
    } catch (error) {
        console.error('POST Error:', error.message);
        return false;
    }
}

// Test GET method (sending data in query parameters)
async function testGET() {
    console.log('\n=== Testing GET Method ===');
    const testUID = generateTestUID();
    console.log(`Test UID: ${testUID}`);

    const params = new URLSearchParams({
        page: 'demo',
        uid: testUID
    });

    const urlWithParams = `${WEBHOOK_URL}?${params.toString()}`;
    console.log(`URL: ${urlWithParams}`);

    try {
        const response = await fetch(urlWithParams, {
            method: 'GET'
        });

        console.log(`Status: ${response.status} ${response.statusText}`);

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('Response Data:', JSON.stringify(data, null, 2));
        } else {
            const text = await response.text();
            console.log('Response Text:', text);
        }

        return response.ok;
    } catch (error) {
        console.error('GET Error:', error.message);
        return false;
    }
}

// Run both tests
async function runTests() {
    console.log('========================================');
    console.log('n8n Webhook Communication Tests');
    console.log('========================================');

    const postResult = await testPOST();
    const getResult = await testGET();

    console.log('\n========================================');
    console.log('Test Results Summary');
    console.log('========================================');
    console.log(`POST Test: ${postResult ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`GET Test: ${getResult ? '✅ PASS' : '❌ FAIL'}`);
    console.log('========================================\n');

    if (postResult && getResult) {
        console.log('✅ All tests passed! n8n webhook is accessible.');
        process.exit(0);
    } else {
        console.log('❌ Some tests failed. Check the output above for details.');
        process.exit(1);
    }
}

// Run the tests
runTests();
