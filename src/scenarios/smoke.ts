import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from '../config';
import { login } from '../helpers/auth';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export function setup(): { token: string } {
  return { token: login() };
}

export default function smoke(data: { token: string }) {
  const headers = { Authorization: `Bearer ${data.token}` };

  const listRes = http.get(`${BASE_URL}/api/v1/movies`, { headers });
  check(listRes, {
    'list movies: status 200': (r) => r.status === 200,
    'list movies: has content': (r) => (r.body as string).length > 0,
  });
  sleep(1);

  const filteredRes = http.get(`${BASE_URL}/api/v1/movies?genre=Action`, { headers });
  check(filteredRes, {
    'genre filter: status 200': (r) => r.status === 200,
  });
  sleep(1);

  const studiosRes = http.get(`${BASE_URL}/api/v1/studios`, { headers });
  check(studiosRes, {
    'list studios: status 200': (r) => r.status === 200,
  });
  sleep(1);

  const notFoundRes = http.get(`${BASE_URL}/api/v1/movie/9999`, {
    headers,
    responseCallback: http.expectedStatuses(404),
  });
  check(notFoundRes, {
    'unknown movie: status 404': (r) => r.status === 404,
  });
  sleep(1);
}
