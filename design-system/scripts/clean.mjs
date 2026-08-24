import { rm } from 'node:fs/promises';
import { glob } from 'node:fs/promises';

for await (const path of glob([
  'packages/*/dist',
  'examples/*/dist',
  'storybook/storybook-static',
  'coverage',
  '.cache',
  '**/*.tsbuildinfo',
])) {
  await rm(path, { recursive: true, force: true });
}
