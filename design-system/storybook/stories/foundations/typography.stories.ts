import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
const meta: Meta = { title: 'Foundations/Typography', tags: ['autodocs'] };
export default meta;
export const Scale: StoryObj = {
  render: () =>
    html`<div style="display:grid;gap:18px;max-width:800px">
      <div style="font-size:var(--ds-font-size-2xl);font-weight:var(--ds-font-weight-semibold)">
        Technical clarity at every density
      </div>
      <div style="font-size:var(--ds-font-size-xl);font-weight:var(--ds-font-weight-semibold)">
        Section heading · 18px
      </div>
      <div style="font-size:var(--ds-font-size-lg)">Lead text for concise page context · 15px</div>
      <div style="font-size:var(--ds-font-size-md)">
        Default interface copy balances density and readability · 13px
      </div>
      <div style="font-size:var(--ds-font-size-sm);color:var(--ds-color-text-secondary)">
        Supporting interface copy · 12px
      </div>
      <div
        style="font-size:var(--ds-font-size-xs);color:var(--ds-color-text-muted);letter-spacing:.1em;text-transform:uppercase"
      >
        Metadata and eyebrow · 11px
      </div>
      <code style="font-family:var(--ds-font-mono)">NL91 ABNA 0417 1643 00</code>
    </div>`,
};
