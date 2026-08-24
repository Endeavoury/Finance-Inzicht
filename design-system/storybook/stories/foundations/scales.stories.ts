import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
const meta: Meta = { title: 'Foundations/Scales', tags: ['autodocs'] };
export default meta;
export const Spacing: StoryObj = {
  render: () =>
    html`<h2>Spacing</h2>
      <div style="display:grid;gap:10px">
        ${[1, 2, 3, 4, 5, 6, 7, 8].map((step) => html`<div style="display:flex;align-items:center;gap:12px"><code style="width:100px">--ds-space-${step}</code><span style=${`display:block;height:18px;width:var(--ds-space-${step});background:var(--ds-color-accent-primary)`}></span></div>`)}
      </div>`,
};
export const RadiusAndElevation: StoryObj = {
  render: () =>
    html`<div style="display:flex;gap:24px;flex-wrap:wrap">
      ${['sm', 'md', 'lg'].map((size) => html`<div style=${`width:150px;height:100px;padding:16px;border:1px solid var(--ds-color-border-default);border-radius:var(--ds-radius-${size});background:var(--ds-color-bg-surface);box-shadow:var(--ds-shadow-${size === 'lg' ? 'lg' : 'sm'})`}><code>radius-${size}</code></div>`)}
    </div>`,
};
export const MotionAndBreakpoints: StoryObj = {
  render: () =>
    html`<ds-panel
      heading="Motion and responsive policy"
      description="Fast 120ms feedback, 180ms structural transitions, and automatic reduction when requested."
      ><ds-stack gap="3"
        ><code>mobile 390px · tablet 768px · laptop 1280px · desktop 1440px · wide 1920px</code>
        <p style="color:var(--ds-color-text-secondary)">
          Component responsiveness is container-conscious where possible; application-shell
          navigation changes at 680px.
        </p></ds-stack
      ></ds-panel
    >`,
};
