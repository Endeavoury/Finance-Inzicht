import * as React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Input } from '@finance-inzicht/react';
import { describe, expect, it, vi } from 'vitest';

describe('React adapter', () => {
  it('renders the real element and maps properties, children, and typed events', async () => {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    const onChange = vi.fn();
    await act(async () => {
      root.render(
        React.createElement(
          React.Fragment,
          null,
          React.createElement(Input, { label: 'Name', value: 'React value', onDsChange: onChange }),
          React.createElement(Button, { variant: 'secondary' }, 'Save'),
        ),
      );
    });
    const input = container.querySelector('ds-input')!;
    const button = container.querySelector('ds-button')!;
    await Promise.all([input.updateComplete, button.updateComplete]);
    expect(input.value).toBe('React value');
    expect(button.textContent).toBe('Save');
    input.dispatchEvent(
      new CustomEvent('ds-change', { detail: { value: 'Updated' }, bubbles: true, composed: true }),
    );
    expect(onChange.mock.calls[0][0].detail).toEqual({ value: 'Updated' });
    await act(async () => root.unmount());
  });
});
