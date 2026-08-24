import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
const meta: Meta = { title: 'Components/Feedback', tags: ['autodocs'] };
export default meta;
export const Alerts: StoryObj = {
  render: () =>
    html`<ds-stack
      >${['info', 'success', 'warning', 'danger'].map((tone) => html`<ds-alert tone=${tone} heading=${tone[0]!.toUpperCase() + tone.slice(1)} ?dismissible=${tone === 'info'}>A concise message explains what happened and what the user can do next.</ds-alert>`)}</ds-stack
    >`,
};
export const Loading: StoryObj = {
  render: () => html`<ds-loading-state label="Calculating financial overview"></ds-loading-state>`,
};
export const Empty: StoryObj = {
  render: () =>
    html`<ds-empty-state
      heading="No transactions found"
      description="Change the filters or import a bank statement to populate this view."
      ><ds-icon slot="icon" name="table"></ds-icon
      ><ds-button slot="actions">Import statement</ds-button></ds-empty-state
    >`,
};
