import { glob, readFile } from 'node:fs/promises';

const registered = new Set();
for await (const path of glob('packages/components/src/register/*.ts')) {
  const source = await readFile(path, 'utf8');
  for (const match of source.matchAll(/defineComponent\('([^']+)'/g)) registered.add(match[1]);
}

let stories = '';
for await (const path of glob('storybook/stories/**/*.stories.ts'))
  stories += await readFile(path, 'utf8');

const missing = [...registered].filter((tag) => !stories.includes(`<${tag}`));
if (missing.length) throw new Error(`Missing Storybook coverage: ${missing.join(', ')}`);
console.log(`Storybook covers all ${registered.size} registered custom elements.`);
