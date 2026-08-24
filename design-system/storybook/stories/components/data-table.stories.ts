import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { DsTableColumn } from '@finance-inzicht/design-system';
const rows = [
  {
    id: '1',
    date: '2026-08-23',
    counterparty: 'Spaghetteria',
    category: 'Food · Restaurants',
    status: 'Manual',
    amount: -69,
    balance: 12840.22,
  },
  {
    id: '2',
    date: '2026-08-22',
    counterparty: 'Albert Heijn',
    category: 'Food · Groceries',
    status: 'Automatic',
    amount: -153,
    balance: 12909.22,
  },
  {
    id: '3',
    date: '2026-08-19',
    counterparty: 'Travel Fund',
    category: 'Financial · Savings',
    status: 'Manual',
    amount: 250,
    balance: 13062.22,
  },
];
const columns: DsTableColumn[] = [
  { key: 'date', label: 'Booking date', sortable: true, width: '130px' },
  { key: 'counterparty', label: 'Description', sortable: true },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Source' },
  {
    key: 'amount',
    label: 'Amount',
    align: 'end',
    sortable: true,
    format: (value) =>
      new Intl.NumberFormat('en-NL', { style: 'currency', currency: 'EUR' }).format(Number(value)),
  },
  {
    key: 'balance',
    label: 'Balance after',
    align: 'end',
    format: (value) =>
      new Intl.NumberFormat('en-NL', { style: 'currency', currency: 'EUR' }).format(Number(value)),
  },
];
const meta: Meta = {
  title: 'Components/Data/Data Table',
  tags: ['autodocs'],
  argTypes: {
    density: { control: 'select', options: ['compact', 'comfortable'] },
    busy: { control: 'boolean' },
    selectable: { control: 'boolean' },
  },
};
export default meta;
export const Playground: StoryObj = {
  args: { density: 'comfortable', busy: false, selectable: true },
  render: (args) =>
    html`<ds-data-table
      caption="Ledger entries"
      density=${args['density']}
      ?busy=${args['busy']}
      ?selectable=${args['selectable']}
      .columns=${columns}
      .rows=${rows}
    ></ds-data-table>`,
};
export const CompactDenseData: StoryObj = {
  render: () =>
    html`<ds-data-table
      density="compact"
      .columns=${columns}
      .rows=${[...rows, ...rows.map((row, index) => ({ ...row, id: `copy-${index}`, date: `2026-08-${18 - index}` }))]}
    ></ds-data-table>`,
};
export const EmptyAndLoading: StoryObj = {
  render: () =>
    html`<ds-stack
      ><ds-data-table
        emptyMessage="No ledger entries match these filters"
        .columns=${columns}
        .rows=${[]}
      ></ds-data-table
      ><ds-data-table busy .columns=${columns} .rows=${rows}></ds-data-table
    ></ds-stack>`,
};
export const LongContentAndOverflow: StoryObj = {
  render: () =>
    html`<div style="max-width:520px">
      <ds-data-table
        .columns=${columns}
        .rows=${[{ ...rows[0], counterparty: 'A very long international counterparty name that should remain contained in the horizontally scrollable table', category: 'Shopping · Household Items and related supplies' }]}
      ></ds-data-table>
    </div>`,
};
