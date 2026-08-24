import { html } from 'lit';
import type { DsTableColumn } from '@finance-inzicht/design-system';

export const productStyles = html`<style>
  .product {
    margin: -24px;
    min-height: 900px;
  }
  .topbar {
    height: 76px;
    padding: 0 28px;
  }
  .content {
    display: grid;
    gap: var(--ds-space-6);
    margin-top: var(--ds-space-6);
  }
  .chart {
    display: flex;
    align-items: end;
    gap: 12px;
    height: 220px;
    padding: 22px 10px 0;
    border-bottom: 1px solid var(--ds-color-border-default);
    background: repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 54px,
      var(--ds-color-border-subtle) 55px
    );
  }
  .chart-group {
    display: flex;
    align-items: end;
    justify-content: center;
    gap: 3px;
    flex: 1;
    height: 100%;
  }
  .bar {
    display: block;
    width: 10px;
    min-height: 3px;
    border-radius: 3px 3px 0 0;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ds-color-success) 84%, white),
      var(--ds-color-success)
    );
    box-shadow: 0 -6px 18px color-mix(in srgb, var(--ds-color-success) 16%, transparent);
  }
  .bar.out {
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ds-color-danger) 84%, white),
      var(--ds-color-danger)
    );
    box-shadow: 0 -6px 18px color-mix(in srgb, var(--ds-color-danger) 14%, transparent);
  }
  .split {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--ds-space-6);
  }
  .category-list {
    display: grid;
    gap: 0;
  }
  .category {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--ds-color-border-subtle);
  }
  .category:first-child {
    padding-top: 2px;
  }
  .category:last-child {
    padding-bottom: 2px;
    border-bottom: 0;
  }
  .category small {
    display: block;
    color: var(--ds-color-text-muted);
  }
  .category i {
    display: block;
    height: 3px;
    margin-top: 6px;
    border-radius: var(--ds-radius-round);
    background: var(--ds-color-accent-primary);
  }
  .calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }
  .day {
    display: grid;
    place-items: center;
    min-height: 50px;
    border: 1px solid transparent;
    border-radius: var(--ds-radius-sm);
    background: var(--ds-color-bg-hover);
    color: var(--ds-color-text-secondary);
    font-size: 11px;
  }
  .day.hot {
    border-color: color-mix(in srgb, var(--ds-color-accent-primary) 46%, transparent);
    background: color-mix(in srgb, var(--ds-color-accent-primary) 20%, var(--ds-color-bg-surface));
    color: #fff;
  }
  .settings {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ds-space-6);
  }
  .drop {
    display: grid;
    place-items: center;
    min-height: 190px;
    border: 1px dashed var(--ds-color-border-strong);
    border-radius: var(--ds-radius-lg);
    background: var(--ds-gradient-surface);
    text-align: center;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--ds-color-text-primary);
    font-weight: var(--ds-font-weight-semibold);
    letter-spacing: var(--ds-letter-spacing-tight);
  }
  .brandmark {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border: 1px solid color-mix(in srgb, var(--ds-color-accent-primary) 48%, white);
    border-radius: var(--ds-radius-md);
    background: var(--ds-gradient-accent);
    box-shadow: var(--ds-shadow-accent);
    color: #fff;
  }
  @media (max-width: 760px) {
    .split,
    .settings {
      grid-template-columns: 1fr;
    }
    .product {
      min-height: 1100px;
    }
    .topbar {
      padding: 0 14px;
    }
  }
</style>`;

export const productSidebar = () =>
  html`<ds-sidebar slot="sidebar"
    ><div slot="brand" class="brand">
      <span class="brandmark">F</span><span>Finance Inzicht</span>
    </div>
    <ds-sidebar-item value="overview" active
      ><ds-icon slot="icon" name="home"></ds-icon>Overview</ds-sidebar-item
    ><ds-sidebar-item value="monthly"
      ><ds-icon slot="icon" name="calendar"></ds-icon>Monthly overview</ds-sidebar-item
    ><ds-sidebar-item value="year"
      ><ds-icon slot="icon" name="chart"></ds-icon>Year overview</ds-sidebar-item
    ><ds-sidebar-item value="ledger"
      ><ds-icon slot="icon" name="table"></ds-icon>Ledger</ds-sidebar-item
    ><ds-sidebar-item value="settings"
      ><ds-icon slot="icon" name="settings"></ds-icon>Accounts</ds-sidebar-item
    ><ds-status-badge slot="footer" tone="success">System online</ds-status-badge></ds-sidebar
  >`;
export const productHeader = (title: string) =>
  html`<ds-inline slot="header" class="topbar" justify="between"
    ><div>
      <span
        style="display:block;color:var(--ds-color-text-muted);font-size:11px;letter-spacing:.12em"
        >PERSONAL FINANCE</span
      ><strong>${title}</strong>
    </div>
    <ds-inline
      ><ds-icon-button label="Refresh"><ds-icon name="refresh"></ds-icon></ds-icon-button
      ><ds-avatar name="Roy Gerritse"></ds-avatar
      ><ds-button size="small"
        ><ds-icon slot="prefix" name="plus"></ds-icon>Import files</ds-button
      ></ds-inline
    ></ds-inline
  >`;
export const money = (value: number) =>
  new Intl.NumberFormat('en-NL', { style: 'currency', currency: 'EUR' }).format(value);
export const ledgerRows = [
  {
    id: '1',
    date: 'Aug 23, 2026',
    account: 'Daily · 4300',
    description: 'Spaghetteria',
    category: 'Food · Restaurants',
    source: 'Manual',
    debit: 69,
    credit: null,
    balance: 12840.22,
  },
  {
    id: '2',
    date: 'Aug 22, 2026',
    account: 'Daily · 4300',
    description: 'Albert Heijn',
    category: 'Food · Groceries',
    source: 'Automatic',
    debit: 153,
    credit: null,
    balance: 12909.22,
  },
  {
    id: '3',
    date: 'Aug 19, 2026',
    account: 'Savings · 9308',
    description: 'Travel Fund',
    category: 'Financial · Savings',
    source: 'Manual',
    debit: null,
    credit: 250,
    balance: 13062.22,
  },
  {
    id: '4',
    date: 'Aug 18, 2026',
    account: 'Daily · 4300',
    description: 'Jumbo',
    category: 'Food · Groceries',
    source: 'Manual',
    debit: 181,
    credit: null,
    balance: 12812.22,
  },
];
export const ledgerColumns: DsTableColumn[] = [
  { key: 'date', label: 'Booking date', sortable: true },
  { key: 'account', label: 'Account' },
  { key: 'description', label: 'Description', sortable: true },
  { key: 'category', label: 'Category' },
  { key: 'source', label: 'Source' },
  {
    key: 'debit',
    label: 'Debit',
    align: 'end',
    format: (value) => (value == null ? '—' : money(Number(value))),
  },
  {
    key: 'credit',
    label: 'Credit',
    align: 'end',
    format: (value) => (value == null ? '—' : money(Number(value))),
  },
  { key: 'balance', label: 'Balance', align: 'end', format: (value) => money(Number(value)) },
];
