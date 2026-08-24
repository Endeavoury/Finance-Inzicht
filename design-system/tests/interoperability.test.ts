import { describe, expect, it, vi } from 'vitest';
import type { DsDataTable } from '@finance-inzicht/design-system/classes';

describe('framework-neutral custom element contract', () => {
  it('supports attributes, properties, slots, events, and inherited themes', async () => {
    document.documentElement.dataset.dsTheme = 'dark';
    const button = document.createElement('ds-button');
    button.setAttribute('variant', 'primary');
    const icon = document.createElement('ds-icon');
    icon.slot = 'prefix';
    icon.setAttribute('name', 'plus');
    button.append(icon, 'Add account');
    document.body.append(button);
    await button.updateComplete;
    expect(button.variant).toBe('primary');
    expect(button.querySelector('[slot=prefix]')).toBe(icon);
    expect(document.documentElement.dataset.dsTheme).toBe('dark');

    const table = document.createElement('ds-data-table') as DsDataTable;
    table.columns = [{ key: 'name', label: 'Name' }];
    table.rows = [{ id: '1', name: 'Current' }];
    table.selectable = true;
    const event = vi.fn();
    table.addEventListener('ds-row-select', event);
    document.body.append(table);
    await table.updateComplete;
    table.shadowRoot!.querySelector<HTMLTableRowElement>('tbody tr')!.click();
    expect(event).toHaveBeenCalledOnce();
    expect(event.mock.calls[0][0].composed).toBe(true);
  });
});
