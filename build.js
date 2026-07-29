const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const scenarios = fs
  .readdirSync(path.join(__dirname, 'src', 'scenarios'))
  .filter((f) => f.endsWith('.ts'))
  .map((f) => path.join('src', 'scenarios', f));

esbuild
  .build({
    entryPoints: scenarios,
    bundle: true,
    outdir: 'dist',
    format: 'cjs',
    target: 'es2015',
    external: ['k6', 'k6/*'],
  })
  .then(() => console.log('Build complete:', scenarios.map((s) => path.basename(s)).join(', ')))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
