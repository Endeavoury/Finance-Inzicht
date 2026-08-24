import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
const names = [
  'plus',
  'search',
  'refresh',
  'chevron-left',
  'chevron-right',
  'chevron-down',
  'home',
  'table',
  'calendar',
  'settings',
  'upload',
  'user',
  'close',
  'check',
  'alert',
  'info',
  'menu',
  'wallet',
  'chart',
];
const meta: Meta = { title: 'Foundations/Icons', tags: ['autodocs'] };
export default meta;
export const CuratedSet: StoryObj = {
  render: () =>
    html`<div
        style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px"
      >
        ${names.map((name) => html`<div style="display:flex;align-items:center;gap:10px;padding:12px;border:1px solid var(--ds-color-border-default);border-radius:7px;background:var(--ds-color-bg-surface)"><ds-icon name=${name} style="font-size:20px"></ds-icon><code style="font-size:11px">${name}</code></div>`)}
      </div>
      <p style="color:var(--ds-color-text-muted)">
        Icons are individually rendered from a small curated path map. No third-party icon font or
        complete icon library is bundled.
      </p>`,
};
