import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from '../config';
import { login } from '../helpers/auth';

// Simulates a sudden traffic spike then validates recovery to baseline.
export const options = {
  stages: [
    { duration: '10s', target: 1 },
    { duration: '1m', target: 1 },
    { duration: '10s', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '10s', target: 1 },
    { duration: '3m', target: 1 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.10'],
  },
};

export function setup(): { token: string } {
  return { token: login() };
}

export default function spike(data: { token: string }) {
  const res = http.get(`${BASE_URL}/api/v1/movies`, {
    headers: { Authorization: `Bearer ${data.token}` },
  });
  check(res, {
    'status 200': (r) => r.status === 200,
  });
  sleep(1);
}
