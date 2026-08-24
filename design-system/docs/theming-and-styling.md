# Theming and styling

## Token layers

`@finance-inzicht/tokens/tokens.css` defines primitive scales and semantic aliases. Components consume semantic variables such as `--ds-color-bg-surface`, never theme-specific raw colors. Light and dark themes assign the same semantic names.

Set `data-ds-theme="light"` or `data-ds-theme="dark"` on `html` or any application subtree. `data-ds-theme="system"` follows `prefers-color-scheme`. CSS custom properties inherit across Shadow DOM, so nested theme previews and application-level overrides remain possible.

## Shared Shadow DOM styles

Components use open Shadow DOM. The styles package exports small Lit `CSSResult` foundation modules for host normalization, typography, focus, controls, forms, surfaces, and accessibility. Lit converts these shared modules to constructed stylesheets where the platform supports it, and component modules import the same ESM objects. Each component adds only its unique layout and presentation.

This avoids embedding the global stylesheet or a large copied reset in every component. The bundle analyzer confirms the shared foundation is emitted once in a bundled full-library consumer.

## Global stylesheet

Importing `@finance-inzicht/design-system/styles.css` is optional (the same file is also available from `@finance-inzicht/styles/global.css`). It affects:

- design-system token variables and `color-scheme`;
- `box-sizing` for the consuming document;
- the `body` font, margin, text color, and canvas background;
- explicit `.ds-visually-hidden`, `.ds-page-flow`, and `.ds-content-width` helpers.

It deliberately does not normalize native controls or typography elements globally.

## Supported customization

Prefer semantic custom properties for theme-level customization:

```css
.branded-area {
  --ds-color-accent-primary: oklch(62% 0.18 250);
  --ds-radius-md: 0.5rem;
}
```

Use stable parts only when a local adjustment is needed:

```css
ds-input::part(control) {
  min-width: 18rem;
}
```

Slots customize content and composition. Do not target elements inside a shadow root or depend on undocumented class names.

## Accessibility preferences

Focus rings are centralized and visible for keyboard users. Reduced-motion media queries collapse transition and animation durations. Semantic state tokens are paired with text/icons rather than serving as the sole carrier of meaning.
