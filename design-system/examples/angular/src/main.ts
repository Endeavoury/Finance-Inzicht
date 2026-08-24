import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import '@finance-inzicht/design-system';
@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<ds-container size="narrow"
    ><ds-stack gap="6"
      ><ds-page-header
        eyebrow="Angular example"
        heading="Native custom elements"
        description="Angular property and event bindings target the same Web Components."
      ></ds-page-header
      ><ds-metric
        label="Current value"
        [value]="name()"
        tone="accent"
        detail="Updated through ds-input"
      ></ds-metric
      ><ds-input
        label="Display name"
        [value]="name()"
        (ds-input)="name.set($any($event).detail.value)"
      ></ds-input
      ><ds-checkbox [checked]="enabled()" (ds-change)="enabled.set($any($event).detail.checked)"
        >Enabled</ds-checkbox
      ><ds-button (click)="name.set('Saved consumer')">Save</ds-button
      ><ds-alert tone="success" heading="Shared implementation"
        >No Angular component owns visual behavior.</ds-alert
      ></ds-stack
    ></ds-container
  >`,
})
class App {
  readonly name = signal('Angular consumer');
  readonly enabled = signal(true);
}
bootstrapApplication(App).catch(console.error);
