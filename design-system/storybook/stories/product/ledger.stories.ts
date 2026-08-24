import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import {
  ledgerColumns,
  ledgerRows,
  productHeader,
  productSidebar,
  productStyles,
} from './product-fixtures.js';
const meta: Meta = {
  title: 'Current Product/Ledger',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
export const FilteredLedger: StoryObj = {
  globals: { theme: 'dark' },
  render: () =>
    html`${productStyles}
      <div class="product">
        <ds-app-shell
          >${productSidebar()}${productHeader('Ledger')}<ds-page-header
            eyebrow="Account ledger"
            heading="Filter, inspect, and categorize"
            description="Balances are calculated independently per account and statement."
            ><ds-badge slot="actions" tone="accent">2,634 entries</ds-badge></ds-page-header
          >
          <div class="content">
            <ds-filter-bar columns="4"
              ><ds-select
                label="Account"
                .options=${[
                  { label: 'All accounts', value: '' },
                  { label: 'Daily · 4300', value: 'daily' },
                ]}
              ></ds-select
              ><ds-select
                label="Category"
                .options=${[
                  { label: 'All categories', value: '' },
                  { label: 'Food', value: 'food' },
                ]}
              ></ds-select
              ><ds-input type="date" label="From" value="2026-08-01"></ds-input
              ><ds-input type="date" label="To" value="2026-08-31"></ds-input
              ><ds-search-input
                label="Search"
                placeholder="Counterparty or reference"
              ></ds-search-input
              ><ds-button slot="actions" variant="secondary">Clear</ds-button
              ><ds-button slot="actions">Apply filters</ds-button></ds-filter-bar
            ><ds-alert tone="info" heading="Balance after transaction"
              >Calculated within each account and statement, anchored to bank-reported
              balances.</ds-alert
            ><ds-data-table
              density="compact"
              selectable
              .columns=${ledgerColumns}
              .rows=${ledgerRows}
            ></ds-data-table></div
        ></ds-app-shell>
      </div>`,
};
