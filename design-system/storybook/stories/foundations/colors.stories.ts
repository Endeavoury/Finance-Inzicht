import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
const semantic = [
  'bg-canvas',
  'bg-surface',
  'bg-elevated',
  'bg-hover',
  'text-primary',
  'text-secondary',
  'text-muted',
  'border-default',
  'border-subtle',
  'accent-primary',
  'accent-hover',
  'success',
  'warning',
  'danger',
  'info',
];
const meta: Meta = {
  title: 'Foundations/Colors',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const SemanticTokens: StoryObj = {
  render: () =>
    html`<style>
        .swatches {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }
        .swatch {
          overflow: hidden;
          border: 1px solid var(--ds-color-border-default);
          border-radius: 8px;
          background: var(--ds-color-bg-surface);
        }
        .color {
          height: 76px;
          background: var(--token);
        }
        .copy {
          display: grid;
          gap: 3px;
          padding: 10px;
        }
        .copy code {
          font-size: 11px;
        }
        .copy span {
          font-size: 11px;
          color: var(--ds-color-text-muted);
        }
      </style>
      <h1>Semantic color roles</h1>
      <p>
        Change the global theme to verify that components consume roles instead of fixed colors.
      </p>
      <div class="swatches">
        ${semantic.map(
          (name) =>
            html`<div class="swatch" style=${`--token:var(--ds-color-${name})`}>
              <div class="color"></div>
              <div class="copy">
                <code>--ds-color-${name}</code><span>${name.replaceAll('-', ' ')}</span>
              </div>
            </div>`,
        )}
      </div>`,
};
