# Bundle architecture and measured sizes

`npm run analyze` bundles representative package consumers with Rollup and writes `reports/bundle-sizes.json`. These figures include the Lit runtime and are therefore representative application-entry costs, not just the authored component source.

| Registration entry | Raw | Gzip | Raw budget | Gzip budget |
| ------------------ | --: | ---: | ---------: | ----------: |
| `button`           | 32,671 B | 10,337 B | 45,000 B | 12,000 B |
| `forms`            | 39,945 B | 11,121 B | 60,000 B | 14,000 B |
| full library       | 91,606 B | 18,970 B | 130,000 B | 22,000 B |

The analysis also asserts that unique shared control and spinner-foundation markers each occur exactly once in the bundled full-library output. TypeScript runtime helpers use `tslib`, so decorator helpers are imported rather than copied into every component module.

The package publishes unbundled ESM and grouped registration entry points. Consumers can choose a narrow import, allow their application bundler to tree-shake class modules, or register the complete P0 set. Icons are individual inline SVG templates selected within `ds-icon`; this P0 icon set is deliberately small and should be split into per-icon modules if it grows materially.
