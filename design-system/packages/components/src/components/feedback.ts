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
        --alert-accent: var(--ds-color-info);
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        gap: var(--ds-space-3);
        align-items: start;
        padding: 0.875rem var(--ds-space-4);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-lg);
        background:
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--alert-accent) 8%, transparent),
            transparent 34%
          ),
          var(--ds-gradient-surface, var(--ds-color-bg-surface));
        color: var(--ds-color-text-secondary);
        font-size: var(--ds-font-size-md);
        box-shadow:
          inset 3px 0 var(--alert-accent),
          var(--ds-shadow-sm);
      }
      :host([tone='info']) .alert,
      :host([tone='accent']) .alert {
        --alert-accent: var(--ds-color-info);
        border-color: color-mix(in srgb, var(--ds-color-info) 24%, var(--ds-color-border-default));
      }
      :host([tone='success']) .alert {
        --alert-accent: var(--ds-color-success);
        border-color: color-mix(
          in srgb,
          var(--ds-color-success) 24%,
          var(--ds-color-border-default)
        );
      }
      :host([tone='warning']) .alert {
        --alert-accent: var(--ds-color-warning);
        border-color: color-mix(
          in srgb,
          var(--ds-color-warning) 24%,
          var(--ds-color-border-default)
        );
      }
      :host([tone='danger']) .alert {
        --alert-accent: var(--ds-color-danger);
        border-color: color-mix(
          in srgb,
          var(--ds-color-danger) 24%,
          var(--ds-color-border-default)
        );
      }
      .title {
        display: block;
        color: var(--ds-color-text-primary);
        font-weight: var(--ds-font-weight-semibold);
        letter-spacing: -0.01em;
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
        min-height: 11rem;
        padding: var(--ds-space-8);
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
        min-height: 12rem;
        padding: var(--ds-space-8);
        border-style: dashed;
        text-align: center;
      }
      .icon {
        display: grid;
        place-items: center;
        width: 3rem;
        height: 3rem;
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-lg);
        background: var(--ds-gradient-elevated, var(--ds-color-bg-hover));
        color: var(--ds-color-accent-hover);
        box-shadow: var(--ds-shadow-control);
      }
      h2 {
        margin: var(--ds-space-2) 0 0;
        font-size: var(--ds-font-size-lg);
        letter-spacing: var(--ds-letter-spacing-tight);
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
