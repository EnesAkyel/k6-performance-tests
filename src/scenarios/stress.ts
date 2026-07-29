import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from '../config';

// Incrementally increases load to find the API's breaking point.
export const options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 10 },
    { duration: '2m', target: 20 },
    { duration: '5m', target: 20 },
    { duration: '2m', target: 30 },
    { duration: '5m', target: 30 },
    { duration: '2m', target: 40 },
    { duration: '5m', target: 40 },
    { duration: '10m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.05'],
  },
};

export default function stress() {
  const res = http.get(`${BASE_URL}/api/v1/movies`);
  check(res, {
    'status 200': (r) => r.status === 200,
  });
  sleep(1);
}
