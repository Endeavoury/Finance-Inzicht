import { fireEvent } from '@testing-library/dom';
import { describe, expect, it, vi } from 'vitest';
import type {
  DsCheckbox,
  DsDataTable,
  DsInput,
  DsSelect,
  DsSidebarItem,
} from '@finance-inzicht/design-system/classes';

const mount = async <T extends HTMLElement>(element: T): Promise<T> => {
  document.body.append(element);
  await (element as T & { updateComplete?: Promise<unknown> }).updateComplete;
  return element;
};

describe('actions and forms', () => {
  it('renders button content and forwards native activation', async () => {
    const button = await mount(document.createElement('ds-button'));
    button.textContent = 'Save';
    const listener = vi.fn();
    button.addEventListener('click', listener);
    fireEvent.click(button.shadowRoot!.querySelector('button')!);
    expect(listener).toHaveBeenCalledOnce();
    const slot = button.shadowRoot!.querySelector<HTMLSlotElement>('slot:not([name])')!;
    expect(
      slot
        .assignedNodes()
        .map((node) => node.textContent)
        .join(''),
    ).toContain('Save');
  });

  it('submits its containing native form when configured as submit', async () => {
    const form = document.createElement('form');
    const button = document.createElement('ds-button');
    button.type = 'submit';
    button.textContent = 'Save';
    form.append(button);
    document.body.append(form);
    await button.updateComplete;
    const listener = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', listener);
    fireEvent.click(button.shadowRoot!.querySelector('button')!);
    expect(listener).toHaveBeenCalledOnce();
  });

  it('emits composed typed input and change events', async () => {
    const input = (await mount(document.createElement('ds-input'))) as DsInput;
    input.label = 'Account name';
    const inputListener = vi.fn();
    const changeListener = vi.fn();
    input.addEventListener('ds-input', inputListener);
    input.addEventListener('ds-change', changeListener);
    await input.updateComplete;
    const native = input.shadowRoot!.querySelector('input')!;
    native.value = 'Savings';
    fireEvent.input(native);
    fireEvent.change(native);
    expect(input.value).toBe('Savings');
    expect(inputListener.mock.calls[0][0]).toMatchObject({
      bubbles: true,
      composed: true,
      detail: { value: 'Savings' },
    });
    expect(changeListener.mock.calls[0][0].detail).toEqual({ value: 'Savings' });
  });

  it('binds structured select options through a JavaScript property', async () => {
    const select = (await mount(document.createElement('ds-select'))) as DsSelect;
    select.options = [
      { label: 'Personal', value: 'personal' },
      { label: 'Business', value: 'business' },
    ];
    await select.updateComplete;
    const native = select.shadowRoot!.querySelector('select')!;
    native.value = 'business';
    fireEvent.change(native);
    expect(select.value).toBe('business');
  });

  it('toggles a checkbox once from label or keyboard activation', async () => {
    const checkbox = (await mount(document.createElement('ds-checkbox'))) as DsCheckbox;
    const listener = vi.fn();
    checkbox.addEventListener('ds-change', listener);
    await checkbox.updateComplete;
    fireEvent.click(checkbox.shadowRoot!.querySelector('label')!);
    expect(checkbox.checked).toBe(true);
    expect(listener).toHaveBeenCalledOnce();
    fireEvent.keyDown(checkbox.shadowRoot!.querySelector('[role=checkbox]')!, { key: ' ' });
    expect(checkbox.checked).toBe(false);
    expect(listener).toHaveBeenCalledTimes(2);
  });
});

describe('data and navigation', () => {
  it('sorts rows and announces sorting through a custom event', async () => {
    const table = (await mount(document.createElement('ds-data-table'))) as DsDataTable;
    table.columns = [{ key: 'amount', label: 'Amount', sortable: true }];
    table.rows = [
      { id: 'b', amount: 20 },
      { id: 'a', amount: 10 },
    ];
    const listener = vi.fn();
    table.addEventListener('ds-sort', listener);
    await table.updateComplete;
    fireEvent.click(table.shadowRoot!.querySelector('.sort')!);
    await table.updateComplete;
    expect(listener.mock.calls[0][0].detail).toEqual({ key: 'amount', direction: 'ascending' });
    expect(
      [...table.shadowRoot!.querySelectorAll('tbody td')].map((cell) => cell.textContent),
    ).toEqual(['10', '20']);
  });

  it('selects rows by pointer and keyboard with the configured key', async () => {
    const table = (await mount(document.createElement('ds-data-table'))) as DsDataTable;
    table.columns = [{ key: 'name', label: 'Name' }];
    table.rows = [{ id: 'account-1', name: 'Current' }];
    table.selectable = true;
    const listener = vi.fn();
    table.addEventListener('ds-row-select', listener);
    await table.updateComplete;
    fireEvent.keyDown(table.shadowRoot!.querySelector('tbody tr')!, { key: 'Enter' });
    expect(table.selectedKey).toBe('account-1');
    expect(listener.mock.calls[0][0].detail.key).toBe('account-1');
  });

  it('emits navigation activation across the shadow boundary', async () => {
    const item = (await mount(document.createElement('ds-sidebar-item'))) as DsSidebarItem;
    item.value = 'ledger';
    const listener = vi.fn();
    item.addEventListener('ds-activate', listener);
    await item.updateComplete;
    fireEvent.click(item.shadowRoot!.querySelector('button,a')!);
    expect(listener.mock.calls[0][0]).toMatchObject({
      bubbles: true,
      composed: true,
      detail: { value: 'ledger' },
    });
  });
});

describe('display foundations', () => {
  it('creates icon geometry in the SVG namespace', async () => {
    const icon = await mount(document.createElement('ds-icon'));
    icon.name = 'refresh';
    await icon.updateComplete;
    expect(icon.shadowRoot!.querySelector('path')?.namespaceURI).toBe('http://www.w3.org/2000/svg');
  });

  it('only exposes card regions that have assigned content', async () => {
    const card = await mount(document.createElement('ds-card'));
    const headerRegion = card.shadowRoot!.querySelector<HTMLElement>('.header')!;
    const footerRegion = card.shadowRoot!.querySelector<HTMLElement>('.footer')!;
    expect(headerRegion.hidden).toBe(true);
    expect(footerRegion.hidden).toBe(true);

    const heading = document.createElement('strong');
    heading.slot = 'header';
    heading.textContent = 'Account summary';
    card.append(heading);
    fireEvent(card.shadowRoot!.querySelector("slot[name='header']")!, new Event('slotchange'));
    await card.updateComplete;
    expect(headerRegion.hidden).toBe(false);
    expect(footerRegion.hidden).toBe(true);
  });
});
