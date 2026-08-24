# Component usage

## Registration and imports

The full entry point registers all custom elements:

```ts
import '@finance-inzicht/design-system';
import '@finance-inzicht/design-system/styles.css';
```

Group entry points (`button`, `forms`, `display`, `feedback`, `data-table`, `layout`, `navigation`, and `patterns`) register only related elements. `@finance-inzicht/design-system/classes` exports the classes without registering them, which is useful for controlled registries and testing.

## Attributes, properties, slots, and events

Use attributes for simple serializable values and properties for structured values:

```ts
import '@finance-inzicht/design-system/data-table';

const table = document.querySelector('ds-data-table');
table.columns = [{ key: 'name', label: 'Name', sortable: true }];
table.rows = [{ id: '1', name: 'Main account' }];
table.addEventListener('ds-sort', (event) => console.log(event.detail));
```

All design-system custom events use the `ds-` prefix, bubble, cross Shadow DOM boundaries (`composed: true`), and expose a typed `detail`. Native slots are preferred for composable content. Stable styling hooks are selectively exposed through `::part`; internal DOM is not an API.

## Forms

`ds-input`, `ds-search-input`, `ds-select`, and `ds-checkbox` use `ElementInternals` and participate in native forms. They support `name`, value/checked state, disabled state, required validation, reset, labels, keyboard interaction, and `FormData` submission.

```html
<form id="profile">
  <ds-input label="Name" name="name" required></ds-input>
  <ds-checkbox name="active" value="yes">Active</ds-checkbox>
</form>
```

## React

The optional React package wraps the existing element classes with `@lit/react`. It adds JSX property and typed custom-event ergonomics; it does not render a second implementation.

```tsx
import { Button, Input } from '@finance-inzicht/react';

export function Editor() {
  return <Input label="Name" onDsChange={(event) => console.log(event.detail.value)} />;
}
```

## Angular

Import the design-system registration once and add the exported schema to a standalone component or NgModule that uses the elements:

```ts
import '@finance-inzicht/design-system';
import { FINANCE_INZICHT_CUSTOM_ELEMENTS_SCHEMA } from '@finance-inzicht/angular';

@Component({
  standalone: true,
  schemas: [FINANCE_INZICHT_CUSTOM_ELEMENTS_SCHEMA],
  template: `<ds-button (ds-activate)="handle($event)">Save</ds-button>`,
})
export class ExampleComponent {}
```

Use property binding for objects: `<ds-data-table [columns]="columns" [rows]="rows" />`. Native forms work directly; Angular form-control adapters can be introduced later as thin ControlValueAccessor directives without moving behavior or styles out of the Web Components.

## Vanilla JavaScript

No framework is required. See `examples/vanilla`; the React and Angular directories provide buildable equivalents.
