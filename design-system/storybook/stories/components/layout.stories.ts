import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
const box = (label: string) =>
  html`<div
    style="min-height:48px;padding:12px;border:1px solid var(--ds-color-border-default);border-radius:6px;background:var(--ds-color-bg-surface)"
  >
    ${label}
  </div>`;
const meta: Meta = { title: 'Components/Layout', tags: ['autodocs'] };
export default meta;
export const Stack: StoryObj = {
  render: () => html`<ds-stack gap="3">${box('First')}${box('Second')}${box('Third')}</ds-stack>`,
};
export const Inline: StoryObj = {
  render: () =>
    html`<ds-inline justify="between"
      ><ds-inline><ds-badge>Filter one</ds-badge><ds-badge>Filter two</ds-badge></ds-inline
      ><ds-button size="small">Apply</ds-button></ds-inline
    >`,
};
export const Grid: StoryObj = {
  render: () =>
    html`<ds-grid columns="4" responsive>${['One', 'Two', 'Three', 'Four'].map(box)}</ds-grid>`,
};
export const Container: StoryObj = {
  render: () =>
    html`<ds-container size="narrow">${box('Narrow centered content container')}</ds-container>`,
};
export const PageHeader: StoryObj = {
  render: () =>
    html`<ds-page-header
      eyebrow="Personal finance"
      heading="Account ledger"
      description="Filter, inspect, and categorize normalized bank entries."
      ><ds-inline slot="actions"
        ><ds-icon-button label="Refresh"><ds-icon name="refresh"></ds-icon></ds-icon-button
        ><ds-button>Import files</ds-button></ds-inline
      ></ds-page-header
    >`,
};
