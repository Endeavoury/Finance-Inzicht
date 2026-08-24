# Design System Architecture

## Decision summary

The design system is an independent npm workspace under `design-system/`. Nothing in the current Finance Inzicht application imports it, and its build does not read application source. The product is used only as an audit input and as inspiration for mock Storybook screens.

The implementation uses **Lit 3 and standards-based custom elements**. Lit was selected because it keeps the shipped contract as Web Components while adding typed reactive properties, declarative templates, Shadow DOM, small runtime cost, and a maintained React adapter. React and Angular remain consumers; there are no framework-specific visual implementations.

## Current application stack

- Angular 22.1 standalone application, TypeScript 6, RxJS, Angular `HttpClient`.
- One root component currently owns navigation, authentication, dashboard analytics, forms, tables, and responsive behavior.
- Global CSS supplies all styling; there is no existing reusable component package or router-level component hierarchy.
- ASP.NET Core 10 API, PostgreSQL, background worker, and offline browser storage are application concerns and remain outside the design system.

## Workspace and package structure

```text
design-system/
├── packages/
│   ├── tokens/       semantic token CSS and typed token metadata
│   ├── styles/       global opt-in CSS and shared Lit style foundations
│   ├── components/   Web Components and registration entrypoints
│   ├── react/        thin @lit/react adapters
│   └── angular/      registration helper and Angular usage types/docs
├── storybook/        real component stories and product compositions
├── examples/         Vanilla, React, and Angular consumers
├── tests/            package, accessibility, and interoperability checks
└── docs/             architecture, audit, usage, contribution, publishing
```

Each workspace can build independently. Package names use the provisional `@finance-inzicht/*` scope and version `0.1.0`; the scope can be changed before first publication without changing custom-element names.

## Component and Shadow DOM strategy

- Every visual component is a custom element with a `ds-` prefix and open Shadow DOM.
- Attributes represent strings, booleans, numbers, and enumerated values. Arrays and objects are JavaScript properties.
- Events use `ds-*`, bubble, cross the shadow boundary (`composed: true`), and publish typed `detail` objects.
- Native slots provide composition. Stable internals only are exposed through `::part()`; private structure stays private.
- Theme values cross Shadow DOM through inheritable semantic custom properties.
- Form controls use `ElementInternals` when available for form value, validity, reset, labels, and disabled state. Their internal native control remains the keyboard and accessibility implementation.
- Overlay components are P1. When introduced, they will render with the top-layer `<dialog>`/Popover APIs rather than a document-level framework portal.

## Styling and token architecture

- `tokens` owns primitive scales and semantic theme variables for light, dark, and system modes.
- `styles` owns opt-in document reset, typography, canvas defaults, accessibility helpers, layouts, and reusable Lit `CSSResult` foundations.
- Components compose small shared modules (`host`, typography, control, focus, form, surface, visually-hidden) with component-specific styles.
- Lit reuses `CSSResult.styleSheet` objects with `adoptedStyleSheets` in capable browsers and provides its style-element fallback otherwise.
- The distributed ESM build preserves shared imports. Shared foundations are not copied into every component module; a consumer bundler can emit one shared chunk.
- `@finance-inzicht/styles/global.css` is opt-in. It sets tokens and conservative `html/body` typography/canvas defaults plus `[hidden]`; it does not restyle arbitrary buttons, inputs, tables, or application classes.

## Build and package contract

- TypeScript project references emit ESM, declarations, declaration maps, and source maps.
- `@finance-inzicht/design-system` exports a full registration entrypoint and grouped paths such as `/button`, `/forms`, and `/data-table`.
- Class-only modules remain side-effect free; registration entrypoints perform guarded `customElements.define()` calls.
- CSS and token metadata have explicit package exports. Published packages contain only `dist`, CSS assets, README, and license metadata.
- Bundle analysis builds representative full and per-component consumers with Rollup, reports raw/gzip size, and checks that shared foundation markers occur once.

## Storybook architecture

- Dedicated Storybook 10 Web Components + Vite project; stories render the actual registered `ds-*` elements with Lit templates.
- Global Light, Dark, and System toolbar writes `data-ds-theme` on the preview root.
- Viewports cover mobile (390), tablet (768), laptop (1280), desktop (1440), and wide (1920).
- Foundations, components, patterns, and current-product mock screens have separate navigation groups.
- `@storybook/addon-a11y` runs axe in the visual review surface. Interaction stories cover keyboard and event behavior.

## Framework integration

- **Vanilla:** import the full package or an individual registration path, then author native HTML.
- **React:** optional wrappers from `@finance-inzicht/react` use `@lit/react/createComponent`; wrappers map typed custom events and complex properties to the same custom elements.
- **Angular:** import the registration helper once and add `CUSTOM_ELEMENTS_SCHEMA`; property and event bindings target native custom-element APIs. Form-associated controls work with native forms; a future ControlValueAccessor package is optional and not part of the visual source of truth.

## Testing strategy

- Vitest + a DOM environment for component rendering, attributes/properties, events, slots, form behavior, keyboard behavior, and theme inheritance.
- axe checks for representative component states and composed product patterns.
- Storybook interaction tests for controls, menus/tabs when implemented, and responsive states.
- Build smoke tests for Vanilla, React, and Angular examples.
- Storybook static build is the visual artifact. A local screenshot script provides deterministic viewport/theme captures without requiring a paid service.

## Initial P0 and expected bundle architecture

P0 covers the existing product's core workflows: icon, button/icon-button/button-group, form field, input/search/select/checkbox, badge/status badge, avatar, card/panel, metric, alert, loading/empty states, data table, app shell/sidebar/sidebar item, page header, stack/inline/grid/container, filter bar, and KPI grid.

```text
tokens.css + typed metadata
          ↓
shared ESM style modules ─────────┐
          ↓                       │ loaded once
component class modules ─────────┘
          ↓
guarded registration entrypoints
          ↓
full bundle / individual imports / framework adapters
```
