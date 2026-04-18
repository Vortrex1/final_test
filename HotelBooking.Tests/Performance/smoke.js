import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.1'],
    http_req_duration: ['p(95)<500'],
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000'

export default function () {
  let response = http.get(`${BASE_URL}/api/rooms`)

  check(response, {
    'GET /api/rooms status is 200': r => r.status === 200,
    'GET /api/rooms response time < 500ms': r => r.timings.duration < 500,
  })

  const now = new Date()
  const checkIn = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const checkOut = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  response = http.get(`${BASE_URL}/api/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`)

  check(response, {
    'GET /api/rooms/available status is 200': r => r.status === 200,
    'GET /api/rooms/available response time < 500ms': r => r.timings.duration < 500,
  })

  sleep(1)
}
