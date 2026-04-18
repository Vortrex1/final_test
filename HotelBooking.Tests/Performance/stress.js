import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000'
const STRESS_START_VUS = Number(__ENV.STRESS_START_VUS || 2)
const STRESS_STAGE_1_TARGET = Number(__ENV.STRESS_STAGE_1_TARGET || 20)
const STRESS_STAGE_2_TARGET = Number(__ENV.STRESS_STAGE_2_TARGET || 40)
const STRESS_STAGE_3_TARGET = Number(__ENV.STRESS_STAGE_3_TARGET || 50)
const STRESS_STAGE_4_TARGET = Number(__ENV.STRESS_STAGE_4_TARGET || 50)
const STRESS_STAGE_5_TARGET = Number(__ENV.STRESS_STAGE_5_TARGET || 5)
const STRESS_STAGE_1_DURATION = __ENV.STRESS_STAGE_1_DURATION || '20s'
const STRESS_STAGE_2_DURATION = __ENV.STRESS_STAGE_2_DURATION || '40s'
const STRESS_STAGE_3_DURATION = __ENV.STRESS_STAGE_3_DURATION || '30s'
const STRESS_STAGE_4_DURATION = __ENV.STRESS_STAGE_4_DURATION || '30s'
const STRESS_STAGE_5_DURATION = __ENV.STRESS_STAGE_5_DURATION || '20s'

export const options = {
  scenarios: {
    stress_test: {
      executor: 'ramping-vus',
      startVUs: STRESS_START_VUS,
      stages: [
        { duration: STRESS_STAGE_1_DURATION, target: STRESS_STAGE_1_TARGET },
        { duration: STRESS_STAGE_2_DURATION, target: STRESS_STAGE_2_TARGET },
        { duration: STRESS_STAGE_3_DURATION, target: STRESS_STAGE_3_TARGET },
        { duration: STRESS_STAGE_4_DURATION, target: STRESS_STAGE_4_TARGET },
        { duration: STRESS_STAGE_5_DURATION, target: STRESS_STAGE_5_TARGET },
      ],
      exec: 'stressScenario',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1200'],
  },
}

export function stressScenario() {
  const res = http.get(`${BASE_URL}/api/rooms`)

  check(res, {
    'status was 200': r => r.status === 200,
  })

  sleep(1)
}
