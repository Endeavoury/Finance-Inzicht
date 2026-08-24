import { LitElement } from 'lit';

export class DsElement extends LitElement {
  protected emit<T>(name: string, detail: T): CustomEvent<T> {
    const event = new CustomEvent<T>(name, { detail, bubbles: true, composed: true });
    this.dispatchEvent(event);
    return event;
  }
}

export function defineComponent(tag: string, element: CustomElementConstructor): void {
  if (!customElements.get(tag)) customElements.define(tag, element);
}

export type DsTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
export type DsSize = 'small' | 'medium' | 'large';
export type DsDensity = 'compact' | 'comfortable';
