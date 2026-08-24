# Development, Storybook, and testing

## Commands

```bash
npm run storybook       # interactive review
npm run typecheck       # project-reference TypeScript check
npm test                # Web Component behavior and accessibility
npm run build           # packages and three framework examples
npm run build-storybook # static documentation build
npm run analyze         # representative bundle sizes and CSS reuse assertion
npm run check           # complete local/CI quality gate
```

Storybook renders shipped Web Components directly with Lit templates. Global controls switch Light, Dark, and System themes. Named mobile, tablet, laptop, desktop, and wide viewports are configured. The accessibility addon runs WCAG-oriented checks; do not suppress a rule without documenting an upstream limitation and adding a replacement test.

## Adding a component

1. Classify it as primitive, component, pattern, or application business feature. Business features do not belong here.
2. Check whether each style belongs in tokens, a shared style foundation, or the component-specific sheet.
3. Add the Lit element without registering it in `classes.ts`.
4. Add it to the narrowest registration entry point and to the full entry point.
5. Define standards-oriented attributes/properties, slots, stable parts, and typed bubbling/composed events.
6. Add stories for meaningful variants, boundaries, keyboard behavior, responsive layouts, and both themes.
7. Add behavior and accessibility tests against the real custom element.
8. Update package exports and documentation when a new public entry point is introduced.

## Adding tokens or shared styles

Add raw scale values and semantic aliases to the tokens package, then document them in a Foundations story. A shared Lit style belongs in the styles package only when several components use the same behavioral or visual convention. Avoid catch-all foundations that make individual component bundles expensive.

## Test strategy

- Vitest + Happy DOM: element lifecycle, attributes/properties, custom events, slots, keyboard behavior, selection/sorting, and form internals where the environment supports them.
- axe-core: automated semantic checks on representative rendered compositions.
- Storybook a11y: interactive and composed-state inspection.
- Cross-framework smoke coverage: the native contract test exercises Vanilla-style attributes, properties, slots, forms, events, and theme inheritance; React has a runtime adapter test; React and Angular examples compile against the actual published entry points and Angular template bindings.
- Storybook static build: validates every story import and docs configuration.
- Bundle analysis: measures minified full and individual imports, gzipped output, and shared-style marker duplication.

Visual regression is prepared for local/CI use through the deterministic static Storybook build. A screenshot runner can be attached to the generated `storybook-static` output without a paid service; project-specific baseline ownership should be established before committing binary snapshots.
