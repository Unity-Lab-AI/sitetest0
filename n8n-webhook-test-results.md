# n8n Webhook Testing Results

## Test Date
2025-11-21

## Webhook URL
`https://n8n.srv484091.hstgr.cloud/webhook/unitydemo-UID`

## Testing Summary

### ✅ POST Method - SUCCESSFUL
- **Status**: 200 OK
- **Method**: POST with JSON body
- **Content-Type**: application/json
- **Request Body**:
  ```json
  {
    "page": "demo",
    "uid": "ud-xx-xxxxxxxxx-xxxxxxxxx-xxxxxxxxxx"
  }
  ```
- **Response**: Empty body, 200 OK status

### ✅ GET Method - SUCCESSFUL
- **Status**: 200 OK
- **Method**: GET with query parameters
- **URL Format**: `?page=demo&uid=ud-xx-xxxxxxxxx-xxxxxxxxx-xxxxxxxxxx`
- **Response**: Empty body, 200 OK status

## UID Format
The webhook expects UIDs in this format:
- **Length**: 36 characters total
- **Format**: `ud-xx-xxxxxxxxx-xxxxxxxxx-xxxxxxxxxx`
- **Pattern**:
  - Prefix: `ud-` (3 chars)
  - Section 1: 2 random alphanumeric chars
  - Separator: `-` (1 char)
  - Section 2: 9 random alphanumeric chars
  - Separator: `-` (1 char)
  - Section 3: 9 random alphanumeric chars
  - Separator: `-` (1 char)
  - Section 4: 10 random alphanumeric chars

**Example**: `ud-ha-m1ptug0rh-adj7b3hzc-kadnysmizo`

## Test Tools Used
1. **Python with requests library** - ✅ Works
2. **curl** - ✅ Works
3. **Node.js with fetch** - ❌ Failed (proxy/network issue in test environment)

## Test Examples

### POST Request (curl)
```bash
curl -X POST "https://n8n.srv484091.hstgr.cloud/webhook/unitydemo-UID" \
  -H "Content-Type: application/json" \
  -d '{"page": "demo", "uid": "ud-test-123456789-123456789-1234567890"}'
```

### GET Request (curl)
```bash
curl "https://n8n.srv484091.hstgr.cloud/webhook/unitydemo-UID?page=demo&uid=ud-test-123456789-123456789-1234567890"
```

### POST Request (Python)
```python
import requests

response = requests.post(
    'https://n8n.srv484091.hstgr.cloud/webhook/unitydemo-UID',
    json={'page': 'demo', 'uid': 'ud-test-123456789-123456789-1234567890'}
)
print(response.status_code)  # 200
```

### GET Request (Python)
```python
import requests

response = requests.get(
    'https://n8n.srv484091.hstgr.cloud/webhook/unitydemo-UID',
    params={'page': 'demo', 'uid': 'ud-test-123456789-123456789-1234567890'}
)
print(response.status_code)  # 200
```

## Implementation Notes

### For Browser Implementation
- Use `fetch()` API for POST requests
- Send JSON body with page and uid parameters
- Set `Content-Type: application/json` header

### UID Generation
- Generate once per user after age verification
- Store in browser cookies (persistent)
- Format must match: `ud-XX-XXXXXXXXX-XXXXXXXXX-XXXXXXXXXX`
- Use lowercase alphanumeric characters only

### Visitor Tracking Strategy
1. **Demo Page (`/ai/demo/`)**:
   - Send POST request to webhook when user visits
   - Include UID from cookie and page identifier

2. **AI Landing Page (`/ai/`)**:
   - Make GET request to retrieve visitor count
   - Display count to users
   - Could update periodically for real-time stats

## Next Steps
1. ✅ Verify webhook communication (COMPLETE)
2. ⏳ Wait for data reset on n8n instance
3. ⏳ Implement UID generation system
4. ⏳ Integrate with demo page (send POST on visit)
5. ⏳ Display visitor count on AI landing page (GET request)
6. ⏳ Test end-to-end functionality

## Test Files Created
- `test-n8n-webhook.js` - Node.js test script
- `test-n8n-webhook.py` - Python test script
- `n8n-webhook-test-results.md` - This document
