# k6-performance-tests

TypeScript k6 performance test suite targeting [movie-catalog-api](https://github.com/EnesAkyel/movie-catalog-api). Covers smoke, load, stress, and spike scenarios with per-scenario thresholds.

## Tech Stack

| Tool       | Version | Purpose                          |
|------------|---------|----------------------------------|
| k6         | latest  | Load testing engine              |
| TypeScript | 7.0     | Type-safe test scripts           |
| esbuild    | 0.28    | TypeScript bundler               |
| Node.js    | 24      | Build tooling                    |

## Project Structure

```
src/
├── config.ts              # BASE_URL from environment or default
├── types.ts               # Movie, Studio, PageResponse interfaces
└── scenarios/
    ├── smoke.ts           # 1 VU, 30s - verify core endpoints respond correctly
    ├── load.ts            # Ramp 0→10 VUs - normal traffic with grouped assertions
    ├── stress.ts          # Ramp 0→40 VUs in steps - find the breaking point
    └── spike.ts           # 1→100→1 VUs - sudden burst then recovery
```

## Scenarios

| Scenario | VUs       | Duration | p95 Threshold | Error Rate |
|----------|-----------|----------|---------------|------------|
| smoke    | 1         | 30s      | < 500ms       | < 1%       |
| load     | 0 → 10    | 5m       | < 800ms       | < 1%       |
| stress   | 0 → 40    | ~38m     | < 2000ms      | < 5%       |
| spike    | 1 → 100   | ~8m      | < 2000ms      | < 10%      |

## Endpoints Under Test

| Method | Path                           | Scenario    |
|--------|--------------------------------|-------------|
| GET    | `/api/v1/movies`               | all         |
| GET    | `/api/v1/movies?genre=Action`  | smoke, load |
| GET    | `/api/v1/movies?page=0&size=5` | load        |
| GET    | `/api/v1/studios`              | smoke, load |
| GET    | `/api/v1/movie/9999`           | smoke (404) |

## Running Locally

### Prerequisites

- Node.js 24+
- k6 installed - `brew install k6` (macOS) or [k6 install docs](https://grafana.com/docs/k6/latest/set-up/install-k6/)
- movie-catalog-api running on `http://localhost:8080`

Start the API before running any scenario:

```bash
# Option 1 - Maven
cd ../movie-catalog-api
./mvnw spring-boot:run

# Option 2 - Docker
cd ../movie-catalog-api
./mvnw package -DskipTests -q
docker compose up
```

### Install & build

```bash
npm install
npm run build
```

### Run a scenario

```bash
# Against default localhost:8080
npm run smoke
npm run load
npm run stress
npm run spike

# Against a specific URL
k6 run dist/smoke.js -e BASE_URL=https://your-api.example.com
```

## CI/CD

GitHub Actions runs the smoke scenario on every push. Use **workflow_dispatch** to manually trigger any scenario against a custom `base_url`.

See [`.github/workflows/k6-tests.yml`](.github/workflows/k6-tests.yml).
