import { css, type CSSResultGroup } from 'lit';

export const hostStyles = css`
  :host {
    box-sizing: border-box;
    color: var(--ds-color-text-primary);
    font-family: var(--ds-font-sans);
    line-height: var(--ds-line-height-normal);
    -webkit-font-smoothing: antialiased;
  }
  :host([hidden]) {
    display: none !important;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;

export const typographyStyles = css`
  button,
  input,
  select,
  textarea {
    font: inherit;
  }
  .eyebrow {
    margin: 0;
    color: var(--ds-color-text-muted);
    font-size: var(--ds-font-size-xs);
    font-weight: var(--ds-font-weight-semibold);
    letter-spacing: var(--ds-letter-spacing-wide);
    line-height: var(--ds-line-height-tight);
    text-transform: uppercase;
  }
  .muted {
    color: var(--ds-color-text-muted);
  }
`;

export const focusStyles = css`
  :where(button, input, select, textarea, a, [tabindex]):focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ds-color-focus) 82%, white);
    outline-offset: 3px;
  }
`;

export const controlStyles = css`
  .control {
    min-height: var(--ds-control-height-md);
    border: 1px solid var(--ds-color-border-default);
    border-radius: var(--ds-radius-md);
    background: var(--ds-color-bg-surface-subtle);
    color: var(--ds-color-text-primary);
    box-shadow: var(--ds-shadow-control);
    transition:
      background var(--ds-duration-fast) var(--ds-ease-standard),
      border-color var(--ds-duration-fast) var(--ds-ease-standard),
      box-shadow var(--ds-duration-fast) var(--ds-ease-standard);
  }
  .control:hover:not(:disabled) {
    border-color: var(--ds-color-border-strong);
    background: var(--ds-color-bg-elevated);
  }
  .control:focus-visible {
    border-color: var(--ds-color-focus);
    outline: 0;
    box-shadow:
      var(--ds-shadow-control),
      0 0 0 3px color-mix(in srgb, var(--ds-color-focus) 18%, transparent);
  }
  .control:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const formStyles = css`
  .field {
    display: grid;
    gap: 0.375rem;
    min-width: 0;
  }
  .label {
    color: var(--ds-color-text-secondary);
    font-size: var(--ds-font-size-sm);
    font-weight: var(--ds-font-weight-semibold);
    letter-spacing: 0.01em;
  }
  .required {
    color: var(--ds-color-danger);
  }
  .help,
  .error {
    margin: 0;
    font-size: var(--ds-font-size-xs);
    line-height: var(--ds-line-height-normal);
  }
  .help {
    color: var(--ds-color-text-muted);
  }
  .error {
    color: var(--ds-color-danger);
  }
`;

export const surfaceStyles = css`
  .surface {
    background: var(--ds-gradient-surface, var(--ds-color-bg-surface));
    border: 1px solid var(--ds-color-border-default);
    border-top-color: var(--ds-color-border-highlight, var(--ds-color-border-default));
    border-radius: var(--ds-radius-lg);
    box-shadow: var(--ds-shadow-panel, var(--ds-shadow-sm));
  }
`;

export const a11yStyles = css`
  .visually-hidden {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }
`;

export const spinnerStyles = css`
  .spinner {
    display: inline-block;
    width: var(--ds-spinner-size, 1.5rem);
    height: var(--ds-spinner-size, 1.5rem);
    border: 2px solid var(--ds-spinner-track, var(--ds-color-border-default));
    border-top-color: var(--ds-spinner-color, var(--ds-color-accent-primary));
    border-right-color: var(--ds-spinner-gap, transparent);
    border-radius: 50%;
    animation: ds-spin 0.8s linear infinite;
  }
  @keyframes ds-spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: none;
      border-right-color: var(--ds-spinner-color, var(--ds-color-accent-primary));
    }
  }
`;

export const foundationStyles: CSSResultGroup = [hostStyles, typographyStyles, focusStyles];
export const controlFoundationStyles: CSSResultGroup = [
  hostStyles,
  typographyStyles,
  focusStyles,
  controlStyles,
];
export const formFoundationStyles: CSSResultGroup = [
  hostStyles,
  typographyStyles,
  focusStyles,
  controlStyles,
  formStyles,
  a11yStyles,
];
