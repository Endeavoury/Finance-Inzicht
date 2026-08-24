import { css, html, nothing, type CSSResultGroup } from 'lit';
import { property } from 'lit/decorators.js';
import { foundationStyles, spinnerStyles, surfaceStyles } from '@finance-inzicht/styles';
import { DsElement, type DsTone } from '../core/ds-element.js';

export class DsAlert extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: block;
      }
      .alert {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        gap: var(--ds-space-3);
        align-items: start;
        padding: var(--ds-space-3) var(--ds-space-4);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-md);
        background: var(--ds-color-bg-surface);
        color: var(--ds-color-text-secondary);
        font-size: var(--ds-font-size-md);
      }
      :host([tone='info']) .alert,
      :host([tone='accent']) .alert {
        background: var(--ds-color-info-soft);
        border-color: color-mix(in srgb, var(--ds-color-info) 30%, transparent);
      }
      :host([tone='success']) .alert {
        background: var(--ds-color-success-soft);
        border-color: color-mix(in srgb, var(--ds-color-success) 30%, transparent);
      }
      :host([tone='warning']) .alert {
        background: var(--ds-color-warning-soft);
        border-color: color-mix(in srgb, var(--ds-color-warning) 30%, transparent);
      }
      :host([tone='danger']) .alert {
        background: var(--ds-color-danger-soft);
        border-color: color-mix(in srgb, var(--ds-color-danger) 30%, transparent);
      }
      .title {
        display: block;
        color: var(--ds-color-text-primary);
        font-weight: var(--ds-font-weight-semibold);
      }
      .message {
        margin-top: var(--ds-space-1);
      }
      button {
        width: 1.75rem;
        height: 1.75rem;
        border: 0;
        border-radius: var(--ds-radius-sm);
        background: transparent;
        color: var(--ds-color-text-secondary);
        cursor: pointer;
      }
      button:hover {
        background: color-mix(in srgb, var(--ds-color-text-primary) 8%, transparent);
      }
    `,
  ];
  @property({ reflect: true }) tone: DsTone = 'info';
  @property() heading = '';
  @property({ type: Boolean }) dismissible = false;
  private dismiss() {
    this.emit('ds-dismiss', {});
    this.remove();
  }
  protected override render() {
    return html`<div
      class="alert"
      part="alert"
      role=${this.tone === 'danger' || this.tone === 'warning' ? 'alert' : 'status'}
    >
      <slot name="icon"></slot>
      <div>
        <span class="title">${this.heading}</span>
        <div class="message"><slot></slot></div>
      </div>
      ${this.dismissible ? html`<button type="button" aria-label="Dismiss" @click=${this.dismiss}>×</button>` : nothing}
    </div>`;
  }
}

export class DsLoadingState extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    surfaceStyles,
    spinnerStyles,
    css`
      :host {
        display: block;
      }
      .state {
        display: grid;
        place-items: center;
        gap: var(--ds-space-3);
        min-height: 10rem;
        padding: var(--ds-space-6);
        text-align: center;
        color: var(--ds-color-text-muted);
      }
      .spinner {
        --ds-spinner-size: 1.75rem;
      }
    `,
  ];
  @property() label = 'Loading';
  protected override render() {
    return html`<div class="state surface" part="state" role="status" aria-live="polite">
      <span class="spinner" aria-hidden="true"></span><span>${this.label}</span>
    </div>`;
  }
}

export class DsEmptyState extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    surfaceStyles,
    css`
      :host {
        display: block;
      }
      .state {
        display: grid;
        place-items: center;
        gap: var(--ds-space-2);
        min-height: 10rem;
        padding: var(--ds-space-6);
        border-style: dashed;
        text-align: center;
      }
      .icon {
        display: grid;
        place-items: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: var(--ds-radius-md);
        background: var(--ds-color-bg-hover);
        color: var(--ds-color-text-muted);
      }
      h2 {
        margin: var(--ds-space-2) 0 0;
        font-size: var(--ds-font-size-lg);
      }
      p {
        max-width: 34rem;
        margin: 0;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-sm);
      }
      .actions {
        margin-top: var(--ds-space-2);
      }
    `,
  ];
  @property() heading = 'Nothing here yet';
  @property() description = '';
  protected override render() {
    return html`<div class="state surface" part="state">
      <div class="icon" part="icon"><slot name="icon">◇</slot></div>
      <h2>${this.heading}</h2>
      ${this.description ? html`<p>${this.description}</p>` : nothing}
      <div class="actions"><slot name="actions"></slot></div>
    </div>`;
  }
}
