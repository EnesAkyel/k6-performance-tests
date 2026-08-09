import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { BASE_URL } from '../config';
import { login } from '../helpers/auth';

export const options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '3m', target: 10 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<800', 'p(99)<1500'],
    http_req_failed: ['rate<0.01'],
    'http_req_duration{group:::movies}': ['p(95)<800'],
    'http_req_duration{group:::studios}': ['p(95)<800'],
  },
};

export function setup(): { token: string } {
  return { token: login() };
}

export default function load(data: { token: string }) {
  const headers = { Authorization: `Bearer ${data.token}` };

  group('movies', () => {
    const listRes = http.get(`${BASE_URL}/api/v1/movies`, { headers });
    check(listRes, {
      'list movies: status 200': (r) => r.status === 200,
    });
    sleep(1);

    const filteredRes = http.get(`${BASE_URL}/api/v1/movies?genre=Action&rating=PG-13`, { headers });
    check(filteredRes, {
      'filtered movies: status 200': (r) => r.status === 200,
    });
    sleep(1);

    const paginatedRes = http.get(`${BASE_URL}/api/v1/movies?page=0&size=5`, { headers });
    check(paginatedRes, {
      'paginated movies: status 200': (r) => r.status === 200,
    });
    sleep(1);
  });

  group('studios', () => {
    const studiosRes = http.get(`${BASE_URL}/api/v1/studios`, { headers });
    check(studiosRes, {
      'list studios: status 200': (r) => r.status === 200,
    });
    sleep(1);
  });
}
