import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

describe('representative accessibility compositions', () => {
  it('has no automatically detectable violations in the primary form controls', async () => {
    document.body.innerHTML = `
      <main>
        <h1>Account settings</h1>
        <ds-input label="Account name" name="name" required></ds-input>
        <ds-select label="Type" name="type"></ds-select>
        <ds-checkbox name="enabled">Enabled</ds-checkbox>
        <ds-button variant="primary">Save</ds-button>
      </main>`;
    const select = document.querySelector('ds-select')!;
    select.options = [
      { label: 'Personal', value: 'personal' },
      { label: 'Business', value: 'business' },
    ];
    await Promise.all(
      [
        ...document.querySelectorAll<HTMLElement & { updateComplete: Promise<unknown> }>(
          'ds-input,ds-select,ds-checkbox,ds-button',
        ),
      ].map((element) => element.updateComplete),
    );
    const result = await axe.run(document.body, { rules: { region: { enabled: false } } });
    expect(result.violations).toEqual([]);
  });

  it('exposes status, busy, and empty feedback semantics', async () => {
    document.body.innerHTML = `
      <main>
        <h1>Ledger</h1>
        <ds-alert tone="warning" heading="Review required">Some entries need a category.</ds-alert>
        <ds-loading-state label="Loading ledger"></ds-loading-state>
        <ds-empty-state heading="No transactions">Try another period.</ds-empty-state>
      </main>`;
    await Promise.all(
      [
        ...document.querySelectorAll<HTMLElement & { updateComplete: Promise<unknown> }>(
          'ds-alert,ds-loading-state,ds-empty-state',
        ),
      ].map((element) => element.updateComplete),
    );
    const result = await axe.run(document.body, { rules: { region: { enabled: false } } });
    expect(result.violations).toEqual([]);
  });
});
