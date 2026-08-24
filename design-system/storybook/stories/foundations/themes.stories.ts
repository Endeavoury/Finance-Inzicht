import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
const meta: Meta = { title: 'Foundations/Themes & Accessibility', tags: ['autodocs'] };
export default meta;
export const ThemeComparison: StoryObj = {
  render: () =>
    html`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px"
    >
      ${['light', 'dark'].map(
        (theme) =>
          html`<section
            data-ds-theme=${theme}
            style="padding:20px;border:1px solid var(--ds-color-border-default);border-radius:10px;background:var(--ds-color-bg-canvas);color:var(--ds-color-text-primary)"
          >
            <h2>${theme}</h2>
            <ds-panel heading="Surface hierarchy"
              ><ds-inline
                ><ds-button>Primary</ds-button><ds-button variant="secondary">Secondary</ds-button
                ><ds-status-badge tone="success">Online</ds-status-badge></ds-inline
              ></ds-panel
            >
          </section>`,
      )}
    </div>`,
};
export const AccessibilityFoundation: StoryObj = {
  render: () =>
    html`<ds-panel
      heading="Accessibility defaults"
      description="WCAG-oriented focus, semantics, motion, and contrast are part of the shared foundation."
      ><ul>
        <li>Visible two-pixel focus rings with contrast-aware semantic color.</li>
        <li>Minimum 40px default controls and larger mobile navigation targets.</li>
        <li>Native controls and ElementInternals for form semantics.</li>
        <li>Reduced-motion token override and non-motion loading fallback.</li>
        <li>Errors are text plus color; status dots always retain labels.</li>
      </ul>
      <ds-inline
        ><ds-button>Tab to inspect focus</ds-button
        ><ds-input
          label="Labeled field"
          helpText="Labels and descriptions remain programmatic"
        ></ds-input></ds-inline
    ></ds-panel>`,
};
