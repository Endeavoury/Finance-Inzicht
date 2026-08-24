import { css, html, nothing, type CSSResultGroup } from 'lit';
import { property } from 'lit/decorators.js';
import { controlFoundationStyles, spinnerStyles } from '@finance-inzicht/styles';
import { DsElement, type DsSize } from '../core/ds-element.js';

export type DsButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
const activateForm = (
  host: HTMLElement,
  internals: ElementInternals,
  type: 'button' | 'submit' | 'reset',
) => {
  const form = internals.form ?? host.closest('form');
  if (type === 'submit') form?.requestSubmit();
  if (type === 'reset') form?.reset();
};
export class DsButton extends DsElement {
  static formAssociated = true;
  static override styles: CSSResultGroup = [
    controlFoundationStyles,
    spinnerStyles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
      }
      :host([full-width]) {
        display: flex;
        width: 100%;
      }
      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--ds-space-2);
        width: 100%;
        min-height: var(--ds-control-height-md);
        padding: 0 var(--ds-space-4);
        border: 1px solid transparent;
        border-radius: var(--ds-radius-md);
        cursor: pointer;
        font-size: var(--ds-font-size-md);
        font-weight: var(--ds-font-weight-semibold);
        white-space: nowrap;
        transition:
          background var(--ds-duration-fast),
          border-color var(--ds-duration-fast),
          transform var(--ds-duration-fast);
      }
      button:active:not(:disabled) {
        transform: translateY(1px);
      }
      :host([size='small']) button {
        min-height: var(--ds-control-height-sm);
        padding-inline: var(--ds-space-3);
        font-size: var(--ds-font-size-sm);
      }
      :host([size='large']) button {
        min-height: var(--ds-control-height-lg);
        padding-inline: var(--ds-space-5);
        font-size: var(--ds-font-size-lg);
      }
      :host([variant='primary']) button {
        background: var(--ds-color-accent-primary);
        color: var(--ds-color-text-inverse);
      }
      :host([variant='primary']) button:hover:not(:disabled) {
        background: var(--ds-color-accent-hover);
      }
      :host([variant='secondary']) button {
        background: var(--ds-color-bg-surface);
        border-color: var(--ds-color-border-default);
        color: var(--ds-color-text-primary);
      }
      :host([variant='secondary']) button:hover:not(:disabled) {
        background: var(--ds-color-bg-hover);
        border-color: var(--ds-color-border-strong);
      }
      :host([variant='ghost']) button {
        background: transparent;
        color: var(--ds-color-text-secondary);
      }
      :host([variant='ghost']) button:hover:not(:disabled) {
        background: var(--ds-color-bg-hover);
        color: var(--ds-color-text-primary);
      }
      :host([variant='danger']) button {
        background: var(--ds-color-danger);
        color: var(--ds-color-text-inverse);
      }
      button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
      .spinner {
        --ds-spinner-size: 1em;
        --ds-spinner-track: currentColor;
        --ds-spinner-color: currentColor;
      }
      ::slotted([slot='prefix']),
      ::slotted([slot='suffix']) {
        width: var(--ds-icon-md);
        height: var(--ds-icon-md);
      }
    `,
  ];
  @property({ reflect: true }) variant: DsButtonVariant = 'primary';
  @property({ reflect: true }) size: DsSize = 'medium';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: Boolean, attribute: 'full-width', reflect: true }) fullWidth = false;
  @property() type: 'button' | 'submit' | 'reset' = 'button';
  readonly internals: ElementInternals;
  constructor() {
    super();
    this.internals = this.attachInternals();
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }
  override click() {
    this.shadowRoot?.querySelector('button')?.click();
  }
  protected override render() {
    return html`<button
      part="button"
      type="button"
      ?disabled=${this.disabled || this.loading}
      aria-busy=${this.loading ? 'true' : nothing}
      @click=${() => activateForm(this, this.internals, this.type)}
    >
      <span class="prefix" part="prefix"
        >${this.loading ? html`<span class="spinner" aria-hidden="true"></span>` : html`<slot name="prefix"></slot>`}</span
      ><span part="label"><slot></slot></span><slot name="suffix"></slot>
    </button>`;
  }
}

export class DsIconButton extends DsElement {
  static formAssociated = true;
  static override styles: CSSResultGroup = [
    controlFoundationStyles,
    css`
      :host {
        display: inline-flex;
      }
      button {
        display: grid;
        place-items: center;
        width: var(--ds-control-height-md);
        height: var(--ds-control-height-md);
        padding: 0;
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-md);
        background: var(--ds-color-bg-surface);
        color: var(--ds-color-text-secondary);
        cursor: pointer;
      }
      button:hover:not(:disabled) {
        background: var(--ds-color-bg-hover);
        color: var(--ds-color-text-primary);
        border-color: var(--ds-color-border-strong);
      }
      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      :host([size='small']) button {
        width: var(--ds-control-height-sm);
        height: var(--ds-control-height-sm);
      }
      :host([size='large']) button {
        width: var(--ds-control-height-lg);
        height: var(--ds-control-height-lg);
      }
      ::slotted(*) {
        width: var(--ds-icon-md);
        height: var(--ds-icon-md);
      }
    `,
  ];
  @property({ reflect: true }) size: DsSize = 'medium';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() label = '';
  @property() type: 'button' | 'submit' | 'reset' = 'button';
  readonly internals: ElementInternals;
  constructor() {
    super();
    this.internals = this.attachInternals();
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }
  override click() {
    this.shadowRoot?.querySelector('button')?.click();
  }
  protected override render() {
    return html`<button
      part="button"
      type="button"
      ?disabled=${this.disabled}
      aria-label=${this.label || nothing}
      @click=${() => activateForm(this, this.internals, this.type)}
    >
      <slot></slot>
    </button>`;
  }
}

export class DsButtonGroup extends DsElement {
  static override styles: CSSResultGroup = [
    controlFoundationStyles,
    css`
      :host {
        display: inline-flex;
        align-items: stretch;
      }
      div {
        display: flex;
      }
      ::slotted(ds-button),
      ::slotted(ds-icon-button) {
        margin-inline-start: -1px;
      }
      ::slotted(:first-child) {
        margin-inline-start: 0;
      }
    `,
  ];
  @property() label = 'Actions';
  protected override render() {
    return html`<div role="group" aria-label=${this.label} part="group"><slot></slot></div>`;
  }
}
