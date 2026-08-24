import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
const meta: Meta = { title: 'Components/Data Display', tags: ['autodocs'] };
export default meta;
export const Badges: StoryObj = {
  render: () =>
    html`<ds-inline
      >${['neutral', 'accent', 'success', 'warning', 'danger', 'info'].map((tone) => html`<ds-badge tone=${tone}>${tone}</ds-badge>`)}</ds-inline
    >`,
};
export const StatusBadges: StoryObj = {
  render: () =>
    html`<ds-inline
      ><ds-status-badge tone="success">Online</ds-status-badge
      ><ds-status-badge tone="warning">Sync pending</ds-status-badge
      ><ds-status-badge tone="danger">Offline</ds-status-badge
      ><ds-status-badge>Unknown</ds-status-badge></ds-inline
    >`,
};
export const Avatars: StoryObj = {
  render: () =>
    html`<ds-inline
      ><ds-avatar name="Roy Gerritse" size="small"></ds-avatar
      ><ds-avatar name="Roy Gerritse"></ds-avatar
      ><ds-avatar name="Finance Inzicht" size="large"></ds-avatar
    ></ds-inline>`,
};
export const CardsAndPanels: StoryObj = {
  render: () =>
    html`<ds-grid columns="2" responsive
      ><ds-card
        ><strong slot="header">Account</strong
        ><ds-badge slot="actions" tone="success">Active</ds-badge>
        <p>Daily account · NL91 •••• 4300</p>
        <strong>€12,840.22</strong><span slot="footer">Updated a minute ago</span></ds-card
      ><ds-panel
        eyebrow="Analytics"
        heading="Spending by category"
        description="A technical panel with a stable action slot"
        ><ds-button slot="actions" variant="secondary" size="small">View details</ds-button>
        <p>
          Charts and application-specific visualizations compose inside this neutral surface.
        </p></ds-panel
      ></ds-grid
    >`,
};
export const Metrics: StoryObj = {
  render: () =>
    html`<ds-kpi-grid columns="4"
      ><ds-metric
        label="Income"
        value="€6,200.00"
        detail="External cash received"
        tone="success"
      ></ds-metric
      ><ds-metric
        label="Expenses"
        value="€3,441.00"
        detail="External spending"
        tone="danger"
      ></ds-metric
      ><ds-metric
        label="Savings"
        value="+€2,759.00"
        detail="44.5% savings rate"
        tone="warning"
      ></ds-metric
      ><ds-metric label="Transactions" value="21" detail="August 2026" tone="accent"></ds-metric
    ></ds-kpi-grid>`,
};
export const LongMetricContent: StoryObj = {
  render: () =>
    html`<div style="max-width:220px">
      <ds-metric
        label="Extremely descriptive metric label"
        value="€123,456,789.12"
        detail="Long supporting detail wraps without escaping the surface"
      ></ds-metric>
    </div>`,
};
