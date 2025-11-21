#!/usr/bin/env python3
"""
Test script for n8n webhook communication
Tests both GET and POST methods to verify connectivity
"""

import requests
import random
import string
import json
import sys

WEBHOOK_URL = 'https://n8n.srv484091.hstgr.cloud/webhook/unitydemo-UID'


def generate_test_uid():
    """Generate a test UID in the correct format: ud-xx-xxxxxxxxx-xxxxxxxxx-xxxxxxxxxx"""
    chars = string.ascii_lowercase + string.digits

    def random_string(length):
        return ''.join(random.choice(chars) for _ in range(length))

    # Format: ud-xx-xxxxxxxxx-xxxxxxxxx-xxxxxxxxxx
    return f"ud-{random_string(2)}-{random_string(9)}-{random_string(9)}-{random_string(10)}"


def test_post():
    """Test POST method (sending data in request body)"""
    print('\n=== Testing POST Method ===')
    test_uid = generate_test_uid()
    print(f'Test UID: {test_uid}')
    print(f'URL: {WEBHOOK_URL}')

    try:
        response = requests.post(
            WEBHOOK_URL,
            headers={'Content-Type': 'application/json'},
            json={
                'page': 'demo',
                'uid': test_uid
            },
            timeout=10
        )

        print(f'Status: {response.status_code} {response.reason}')

        try:
            data = response.json()
            print('Response Data:', json.dumps(data, indent=2))
        except ValueError:
            print('Response Text:', response.text)

        return response.ok
    except requests.exceptions.RequestException as e:
        print(f'POST Error: {e}')
        return False


def test_get():
    """Test GET method (sending data in query parameters)"""
    print('\n=== Testing GET Method ===')
    test_uid = generate_test_uid()
    print(f'Test UID: {test_uid}')

    params = {
        'page': 'demo',
        'uid': test_uid
    }

    print(f'URL: {WEBHOOK_URL}?page={params["page"]}&uid={params["uid"]}')

    try:
        response = requests.get(
            WEBHOOK_URL,
            params=params,
            timeout=10
        )

        print(f'Status: {response.status_code} {response.reason}')

        try:
            data = response.json()
            print('Response Data:', json.dumps(data, indent=2))
        except ValueError:
            print('Response Text:', response.text)

        return response.ok
    except requests.exceptions.RequestException as e:
        print(f'GET Error: {e}')
        return False


def run_tests():
    """Run both tests"""
    print('========================================')
    print('n8n Webhook Communication Tests')
    print('========================================')

    post_result = test_post()
    get_result = test_get()

    print('\n========================================')
    print('Test Results Summary')
    print('========================================')
    print(f'POST Test: {"✅ PASS" if post_result else "❌ FAIL"}')
    print(f'GET Test: {"✅ PASS" if get_result else "❌ FAIL"}')
    print('========================================\n')

    if post_result and get_result:
        print('✅ All tests passed! n8n webhook is accessible.')
        sys.exit(0)
    else:
        print('❌ Some tests failed. Check the output above for details.')
        sys.exit(1)


if __name__ == '__main__':
    run_tests()
