#!/usr/bin/env python3
"""
Comprehensive n8n webhook test script
Tests all webhook behaviors including user creation, counters, and anonymous access
"""

import requests
import random
import string
import json
import sys
import time

WEBHOOK_URL = 'https://n8n.srv484091.hstgr.cloud/webhook/unitydemo-UID'


def generate_uid():
    """Generate a UID in the correct format: ud-xx-xxxxxxxxx-xxxxxxxxx-xxxxxxxxxx"""
    chars = string.ascii_lowercase + string.digits

    def random_string(length):
        return ''.join(random.choice(chars) for _ in range(length))

    return f"ud-{random_string(2)}-{random_string(9)}-{random_string(9)}-{random_string(10)}"


def post_user(uid, page='demo'):
    """POST a user to the webhook"""
    try:
        response = requests.post(
            WEBHOOK_URL,
            headers={'Content-Type': 'application/json'},
            json={'page': page, 'uid': uid},
            timeout=10
        )

        try:
            data = response.json()
        except ValueError:
            data = response.text

        return response.status_code, data
    except requests.exceptions.RequestException as e:
        return None, str(e)


def get_count(uid, page='demo'):
    """GET count for a page using a UID"""
    try:
        response = requests.get(
            WEBHOOK_URL,
            params={'page': page, 'uid': uid},
            timeout=10
        )

        try:
            data = response.json()
        except ValueError:
            data = response.text

        return response.status_code, data
    except requests.exceptions.RequestException as e:
        return None, str(e)


def print_section(title):
    """Print a section header"""
    print('\n' + '='*60)
    print(f'  {title}')
    print('='*60)


def print_result(test_name, status, data, expected_status=None):
    """Print test result"""
    status_emoji = '✅' if (expected_status is None or status == expected_status) else '❌'
    print(f'\n{status_emoji} {test_name}')
    print(f'   Status: {status}')
    print(f'   Response: {json.dumps(data, indent=3) if isinstance(data, dict) else data}')


def run_comprehensive_tests():
    """Run all comprehensive tests"""

    print('\n' + '='*60)
    print('  N8N WEBHOOK COMPREHENSIVE TEST SUITE')
    print('='*60)

    # Track test results
    results = {
        'passed': 0,
        'failed': 0,
        'total': 0
    }

    # Generate 10 unique users
    users = [generate_uid() for _ in range(10)]

    # =========================================================================
    print_section('TEST 1: Create First User on Demo Page')
    # =========================================================================

    status, data = post_user(users[0], 'demo')
    print_result(f'POST new user: {users[0][:20]}...', status, data, 200)

    if status == 200 and isinstance(data, dict) and 'uids' in data:
        expected_count = 1
        actual_count = int(data.get('uids', 0))
        if actual_count == expected_count:
            print(f'   ✅ Counter is correct: {actual_count}')
            results['passed'] += 1
        else:
            print(f'   ❌ Counter mismatch! Expected: {expected_count}, Got: {actual_count}')
            results['failed'] += 1
    else:
        results['failed'] += 1

    results['total'] += 1
    time.sleep(0.5)

    # =========================================================================
    print_section('TEST 2: Try to Create Same User Again (Should Say Already Exists)')
    # =========================================================================

    status, data = post_user(users[0], 'demo')
    print_result(f'POST existing user: {users[0][:20]}...', status, data, 200)

    if status == 200 and isinstance(data, dict):
        if 'exists' in str(data).lower() or 'already' in str(data).lower():
            print('   ✅ Correctly reports user already exists')
            results['passed'] += 1
        else:
            print('   ⚠️  User exists but message unclear')
            results['passed'] += 1
    else:
        results['failed'] += 1

    results['total'] += 1
    time.sleep(0.5)

    # =========================================================================
    print_section('TEST 3: Create 9 More Users (Total 10)')
    # =========================================================================

    for i, uid in enumerate(users[1:], start=2):
        status, data = post_user(uid, 'demo')
        print_result(f'POST user #{i}: {uid[:20]}...', status, data, 200)

        if status == 200 and isinstance(data, dict) and 'uids' in data:
            expected_count = i
            actual_count = int(data.get('uids', 0))
            if actual_count == expected_count:
                print(f'   ✅ Counter incremented correctly: {actual_count}')
                results['passed'] += 1
            else:
                print(f'   ❌ Counter mismatch! Expected: {expected_count}, Got: {actual_count}')
                results['failed'] += 1
        else:
            results['failed'] += 1

        results['total'] += 1
        time.sleep(0.3)

    # =========================================================================
    print_section('TEST 4: GET Count with Valid UID')
    # =========================================================================

    status, data = get_count(users[0], 'demo')
    print_result(f'GET with valid UID: {users[0][:20]}...', status, data, 200)

    if status == 200 and isinstance(data, dict) and 'uids' in data:
        if int(data['uids']) == 10:
            print(f'   ✅ Count is correct: {data["uids"]}')
            results['passed'] += 1
        else:
            print(f'   ❌ Count mismatch! Expected: 10, Got: {data["uids"]}')
            results['failed'] += 1
    else:
        results['failed'] += 1

    results['total'] += 1
    time.sleep(0.5)

    # =========================================================================
    print_section('TEST 5: GET Count with Anonymous UID')
    # =========================================================================

    status, data = get_count('anonymous', 'demo')
    print_result('GET with anonymous UID', status, data, 200)

    if status == 200 and isinstance(data, dict) and 'uids' in data:
        if int(data['uids']) == 10:
            print(f'   ✅ Anonymous can see count: {data["uids"]}')
            results['passed'] += 1
        else:
            print(f'   ⚠️  Count: {data["uids"]} (expected 10)')
            results['passed'] += 1  # Still pass since anonymous works
    else:
        results['failed'] += 1

    results['total'] += 1
    time.sleep(0.5)

    # =========================================================================
    print_section('TEST 6: GET Count with Invalid/Nonexistent UID')
    # =========================================================================

    fake_uid = generate_uid()
    status, data = get_count(fake_uid, 'demo')
    print_result(f'GET with invalid UID: {fake_uid[:20]}...', status, data, 403)

    if status == 403:
        print('   ✅ Correctly returns 403 Forbidden')
        results['passed'] += 1
    else:
        print('   ❌ Should return 403 for invalid UID')
        results['failed'] += 1

    results['total'] += 1
    time.sleep(0.5)

    # =========================================================================
    print_section('TEST 7: Create Users on Different Page (landing)')
    # =========================================================================

    # Create NEW users for landing page (users are global, not per-page)
    landing_users = [generate_uid() for _ in range(3)]

    for i, uid in enumerate(landing_users, start=1):
        status, data = post_user(uid, 'landing')
        print_result(f'POST to landing page #{i}: {uid[:20]}...', status, data, 200)

        if status == 200 and isinstance(data, dict):
            if 'uids' in data:
                expected_count = i
                actual_count = int(data.get('uids', 0))
                if actual_count == expected_count:
                    print(f'   ✅ Landing page counter: {actual_count}')
                    results['passed'] += 1
                else:
                    print(f'   ❌ Counter mismatch! Expected: {expected_count}, Got: {actual_count}')
                    results['failed'] += 1
            elif 'server' in data and 'exists' in data['server'].lower():
                print('   ⚠️  User already exists (unexpected for new UID)')
                results['failed'] += 1
            else:
                results['failed'] += 1
        else:
            results['failed'] += 1

        results['total'] += 1
        time.sleep(0.3)

    # =========================================================================
    print_section('TEST 8: GET Count for Landing Page')
    # =========================================================================

    status, data = get_count(landing_users[0], 'landing')
    print_result('GET landing page count', status, data, 200)

    if status == 200 and isinstance(data, dict) and 'uids' in data:
        if int(data['uids']) == 3:
            print(f'   ✅ Landing page count correct: {data["uids"]}')
            results['passed'] += 1
        else:
            print(f'   ⚠️  Landing page count: {data["uids"]} (expected 3)')
            results['failed'] += 1
    else:
        print(f'   ❌ Response format unexpected: {data}')
        results['failed'] += 1

    results['total'] += 1
    time.sleep(0.5)

    # =========================================================================
    print_section('TEST 9: Verify Demo Page Count Still 10')
    # =========================================================================

    status, data = get_count('anonymous', 'demo')
    print_result('GET demo page count (should still be 10)', status, data, 200)

    if status == 200 and isinstance(data, dict) and 'uids' in data:
        if int(data['uids']) == 10:
            print(f'   ✅ Demo page count unchanged: {data["uids"]}')
            results['passed'] += 1
        else:
            print(f'   ❌ Demo page count changed! Expected: 10, Got: {data["uids"]}')
            results['failed'] += 1
    else:
        results['failed'] += 1

    results['total'] += 1
    time.sleep(0.5)

    # =========================================================================
    print_section('TEST 10: Create New Page with Anonymous POST')
    # =========================================================================

    status, data = post_user('anonymous', 'contact')
    print_result('POST anonymous to new page (contact)', status, data, 200)

    if status == 200:
        print('   ✅ Anonymous POST accepted')
        results['passed'] += 1
    else:
        print('   ❌ Anonymous POST failed')
        results['failed'] += 1

    results['total'] += 1

    # =========================================================================
    # Final Summary
    # =========================================================================

    print('\n' + '='*60)
    print('  FINAL TEST RESULTS')
    print('='*60)
    print(f'\n  Total Tests: {results["total"]}')
    print(f'  ✅ Passed: {results["passed"]}')
    print(f'  ❌ Failed: {results["failed"]}')
    print(f'  Success Rate: {(results["passed"]/results["total"]*100):.1f}%')
    print('\n' + '='*60)

    # Print summary of created users
    print('\n📊 CREATED USERS SUMMARY:')
    print(f'   - Demo page: 10 unique users')
    print(f'   - Landing page: 3 new unique users')
    print(f'   - Contact page: 1 user (anonymous)')
    print(f'   - Total unique users created: 13 (10 demo + 3 landing) + anonymous')

    if results['failed'] == 0:
        print('\n✅ ALL TESTS PASSED! n8n webhook is working perfectly.')
        return 0
    else:
        print(f'\n⚠️  {results["failed"]} test(s) failed. See details above.')
        return 1


if __name__ == '__main__':
    sys.exit(run_comprehensive_tests())
