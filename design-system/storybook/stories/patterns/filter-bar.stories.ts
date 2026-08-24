import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
const options = [
  { label: 'All accounts', value: '' },
  { label: 'Daily account', value: 'daily' },
  { label: 'Savings', value: 'savings' },
];
const meta: Meta = { title: 'Patterns/Filter Bar', tags: ['autodocs'] };
export default meta;
export const LedgerFilters: StoryObj = {
  render: () =>
    html`<ds-filter-bar columns="4"
      ><ds-select label="Account" .options=${options}></ds-select
      ><ds-select
        label="Category"
        .options=${[
          { label: 'All categories', value: '' },
          { label: 'Food', value: 'food' },
          { label: 'Housing', value: 'housing' },
        ]}
      ></ds-select
      ><ds-input type="date" label="From"></ds-input><ds-input type="date" label="To"></ds-input
      ><ds-search-input label="Search" placeholder="Counterparty or reference"></ds-search-input
      ><ds-button slot="actions" variant="secondary">Clear</ds-button
      ><ds-button slot="actions">Apply filters</ds-button></ds-filter-bar
    >`,
};
