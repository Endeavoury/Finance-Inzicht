import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
const meta: Meta = {
  title: 'Introduction/Design System',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
export const Welcome: StoryObj = {
  render: () =>
    html`<div style="max-width:980px;margin:auto;padding:48px 24px">
      <p
        style="color:var(--ds-color-accent-primary);font-weight:650;letter-spacing:.12em;text-transform:uppercase"
      >
        Cross-framework Web Components
      </p>
      <h1 style="max-width:720px;font-size:clamp(32px,5vw,58px);line-height:1.05;margin:12px 0">
        A restrained interface system for technical products.
      </h1>
      <p style="max-width:700px;color:var(--ds-color-text-secondary);font-size:16px">
        One Lit implementation, centralized semantic tokens, shared Shadow DOM foundations, and
        native contracts for Vanilla, React, and Angular.
      </p>
      <div style="margin-top:32px">
        <ds-kpi-grid columns="3"
          ><ds-metric
            label="Source of truth"
            value="Web Components"
            tone="accent"
            detail="Standards-native"
          ></ds-metric
          ><ds-metric
            label="Themes"
            value="Light · Dark"
            tone="success"
            detail="System aware"
          ></ds-metric
          ><ds-metric
            label="Initial release"
            value="P0"
            tone="warning"
            detail="Current workflows"
          ></ds-metric
        ></ds-kpi-grid>
      </div>
      <div style="margin-top:24px">
        <ds-alert heading="Independent by design"
          >This Storybook uses mock data and has no runtime dependency on the Finance Inzicht
          application or APIs.</ds-alert
        >
      </div>
    </div>`,
};
