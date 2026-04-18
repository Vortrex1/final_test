import http from 'k6/http'
import { check, group, sleep } from 'k6'

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000'
const ROOM_LIST_VUS = Number(__ENV.LOAD_ROOM_VUS || 15)
const AVAILABLE_ROOM_VUS = Number(__ENV.LOAD_AVAILABLE_VUS || 8)
const LOAD_DURATION = __ENV.LOAD_DURATION || '45s'

export const options = {
  scenarios: {
    room_list: {
      executor: 'constant-vus',
      vus: ROOM_LIST_VUS,
      duration: LOAD_DURATION,
      exec: 'getRooms',
    },
    available_room_check: {
      executor: 'constant-vus',
      vus: AVAILABLE_ROOM_VUS,
      duration: LOAD_DURATION,
      exec: 'getAvailableRooms',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.02'],
    'http_req_duration{scenario:room_list}': ['p(95)<800'],
    'http_req_duration{scenario:available_room_check}': ['p(95)<800'],
  },
}

export function getRooms() {
  group('Get all rooms', () => {
    const res = http.get(`${BASE_URL}/api/rooms`)

    check(res, {
      'status 200': r => r.status === 200,
      'response not empty': r => r.body && r.body.length > 0,
    })

    sleep(1)
  })
}

export function getAvailableRooms() {
  group('Get available rooms', () => {
    const now = new Date()
    const checkIn = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const checkOut = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const res = http.get(`${BASE_URL}/api/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`)

    check(res, {
      'status 200': r => r.status === 200,
      'response not empty': r => r.body && r.body.length > 0,
    })

    sleep(1)
  })
}
