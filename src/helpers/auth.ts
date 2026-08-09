import http from 'k6/http';
import { BASE_URL, AUTH_USERNAME, AUTH_PASSWORD } from '../config';

export function login(): string {
  const res = http.post(
    `${BASE_URL}/api/v1/auth/login`,
    JSON.stringify({ username: AUTH_USERNAME, password: AUTH_PASSWORD }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.json('token') as string;
}
