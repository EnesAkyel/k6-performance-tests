import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from '../config';
import { login } from '../helpers/auth';

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

export function setup(): { token: string } {
  return { token: login() };
}

export default function stress(data: { token: string }) {
  const res = http.get(`${BASE_URL}/api/v1/movies`, {
    headers: { Authorization: `Bearer ${data.token}` },
  });
  check(res, {
    'status 200': (r) => r.status === 200,
  });
  sleep(1);
}
